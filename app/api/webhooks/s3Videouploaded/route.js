// app/api/process-video/route.js
// Next.js 13+ App Router API Route with ECS Fargate integration

import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize AWS ECS Client
const ecsClient = new ECSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize AWS SNS Client (for notifications)
const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📥 Webhook Event Received");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // ⭐ 1. SNS Subscription Confirmation
    if (body.Type === "SubscriptionConfirmation") {
      console.log("📩 SNS Subscription Confirmation");
      const subscribeURL = body.SubscribeURL;
      await fetch(subscribeURL);
      return Response.json({
        ok: true,
        message: "SNS subscription confirmed",
      });
    }

    // ⭐ 2. SNS Notification with S3 Event
    if (body.Type === "Notification") {
      const message = JSON.parse(body.Message);
      const record = message.Records?.[0];

      if (!record) {
        return Response.json(
          { error: "Invalid S3 event format" },
          { status: 400 }
        );
      }

      const bucket = record.s3.bucket.name;
      const key = record.s3.object.key;
      const region = "ap-south-1";
      const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

      console.log("🎉 S3 Upload Event Detected");
      console.log("Bucket:", bucket);
      console.log("Key:", key);
      console.log("File URL:", fileUrl);

      // ⭐ 3. Spin up ECS Fargate Task
      console.log("\n🚀 Starting ECS Fargate Task...");

      const command = new RunTaskCommand({
        cluster: process.env.AWS_ECS_CLUSTER,
        taskDefinition: process.env.AWS_ECS_TASK_DEFINITION,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
          awsvpcConfiguration: {
            assignPublicIp: "ENABLED",
            subnets: process.env.AWS_SUBNETS.split(","),
            securityGroups: [process.env.AWS_SECURITY_GROUP],
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: process.env.AWS_CONTAINER_NAME || "video-processor",
              environment: [
                { name: "VIDEO_URL", value: fileUrl },
                { name: "S3_BUCKET", value: bucket },
                { name: "AWS_REGION", value: region },
                { name: "BACKEND_URL", value: process.env.BACKEND_URL },
                { name: "AWS_ACCESS_KEY_ID", value: process.env.AWS_ACCESS_KEY_ID },
                { name: "AWS_SECRET_ACCESS_KEY", value: process.env.AWS_SECRET_ACCESS_KEY },
              ],
            },
          ],
        },
      });

      try {
        const response = await ecsClient.send(command);
        const taskArn = response.tasks?.[0]?.taskArn;

        console.log("✅ ECS Task Started Successfully");
        console.log("Task ARN:", taskArn);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

        // Optional: Publish notification to SNS topic
        if (process.env.AWS_SNS_TOPIC_ARN) {
          await snsClient.send(
            new PublishCommand({
              TopicArn: process.env.AWS_SNS_TOPIC_ARN,
              Subject: "Video Processing Started",
              Message: JSON.stringify({
                status: "processing_started",
                fileUrl,
                taskArn,
                timestamp: new Date().toISOString(),
              }),
            })
          );
        }

        return Response.json(
          {
            ok: true,
            status: "processing_started",
            taskArn,
            fileUrl,
            message: "Video processing task queued on ECS Fargate",
          },
          { status: 202 }
        );
      } catch (ecsError) {
        console.error("❌ ECS Error:", ecsError);
        return Response.json(
          {
            error: "Failed to start ECS task",
            details: ecsError.message,
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      { message: "Unhandled SNS Message Type" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return Response.json(
      { error: error.message, details: error.stack },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return Response.json({
    ok: true,
    message: "Video processing webhook is running",
    timestamp: new Date().toISOString(),
  });
}