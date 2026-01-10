import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Initialize AWS ECS Client (SDK v3)
const ecsClient = new ECSClient({
  region: process.env.AWS_REGION,
});

// Initialize AWS SNS Client (SDK v3)
const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
});

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📥 Webhook Event Received");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Full body:", JSON.stringify(body, null, 2));

    let s3Event = null;

    // ⭐ 1. Check if it's SNS Subscription Confirmation
    if (body.Type === "SubscriptionConfirmation") {
      console.log("📩 SNS Subscription Confirmation");
      const subscribeURL = body.SubscribeURL;
      await fetch(subscribeURL);
      return Response.json({
        ok: true,
        message: "SNS subscription confirmed",
      });
    }

    // ⭐ 2. Check if it's SNS Notification wrapping S3 event
    if (body.Type === "Notification") {
      console.log("📨 SNS Notification detected");
      const message = JSON.parse(body.Message);
      s3Event = message.Records?.[0];
    }

    // ⭐ 3. Check if it's direct S3 event (from S3 -> API webhook)
    if (body.Records && Array.isArray(body.Records)) {
      console.log("📦 Direct S3 event detected");
      s3Event = body.Records[0];
    }

    // Validate we have S3 event data
    if (!s3Event || !s3Event.s3) {
      console.error("❌ No valid S3 event found in request");
      return Response.json(
        { error: "Invalid event format - no S3 data found" },
        { status: 400 }
      );
    }

    // Extract S3 details
    const bucket = s3Event.s3.bucket.name;
    const key = s3Event.s3.object.key;
    const region = process.env.AWS_REGION || "ap-south-1";
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    console.log("🎉 S3 Upload Event Detected");
    console.log("Bucket:", bucket);
    console.log("Key:", key);
    console.log("File Size:", s3Event.s3.object.size, "bytes");
    console.log("File URL:", fileUrl);

    // ⭐ 4. Validate file is a video (optional but recommended)
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".flv", ".webm"];
    const fileExtension = key.toLowerCase().substring(key.lastIndexOf("."));
    if (!videoExtensions.includes(fileExtension)) {
      console.warn("⚠️ File is not a video format:", fileExtension);
      return Response.json(
        { error: "Only video files are supported" },
        { status: 400 }
      );
    }

    // ⭐ 5. Spin up ECS Fargate Task
    console.log("\n🚀 Starting ECS Fargate Task...");

    const command = new RunTaskCommand({
      cluster: process.env.AWS_ECS_CLUSTER,
      taskDefinition: process.env.AWS_ECS_TASK_DEFINITION,
      launchType: "FARGATE",
      networkConfiguration: {
        awsvpcConfiguration: {
          assignPublicIp: "ENABLED",
          subnets: process.env.AWS_SUBNETS?.split(",") || [],
          securityGroups: process.env.AWS_SECURITY_GROUP ? [process.env.AWS_SECURITY_GROUP] : [],
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: process.env.AWS_CONTAINER_NAME || "video-processor",
            environment: [
              { name: "VIDEO_URL", value: fileUrl },
              { name: "S3_BUCKET", value: bucket },
              { name: "S3_KEY", value: key },
              { name: "AWS_REGION", value: region },
              { name: "BACKEND_URL", value: process.env.BACKEND_URL || "" },
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
        try {
          await snsClient.send(
            new PublishCommand({
              TopicArn: process.env.AWS_SNS_TOPIC_ARN,
              Subject: "Video Processing Started",
              Message: JSON.stringify({
                status: "processing_started",
                bucket,
                key,
                fileUrl,
                taskArn,
                fileSize: s3Event.s3.object.size,
                timestamp: new Date().toISOString(),
              }),
            })
          );
          console.log("📧 SNS notification sent");
        } catch (snsError) {
          console.warn("⚠️ Failed to send SNS notification:", snsError.message);
        }
      }

      return Response.json(
        {
          ok: true,
          status: "processing_started",
          taskArn,
          bucket,
          key,
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
