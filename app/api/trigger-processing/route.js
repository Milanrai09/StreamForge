import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import AWS from "aws-sdk";
import { prisma } from "@/lib/prisma";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ecs = new ECSClient({ region: process.env.AWS_REGION });

export async function POST(req) {
  try {
    const body = await req.json();

    // Handle AWS SNS structure
    if (body.Type === "SubscriptionConfirmation") {
      // Confirm SNS subscription (only happens once)
      const confirmUrl = body.SubscribeURL;
      console.log("Confirming SNS subscription:", confirmUrl);
      return Response.json({ message: "Subscription confirmation received" });
    }

    if (body.Type === "Notification") {
      // Extract event data from SNS notification
      const snsMessage = JSON.parse(body.Message);
      const record = snsMessage.Records[0];
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key);
      const keyDir = key.substring(0, key.lastIndexOf("/")); // strip filename
      const namespace = keyDir.split("/").pop();
      const claimed = namespace
        ? await prisma.video.updateMany({
            where: {
              namespace,
              status: "pending_upload",
            },
            data: { status: "processing_queued" },
          })
        : { count: 0 };

      if (!namespace || claimed.count === 0) {
        return Response.json(
          {
            message: "Skipping duplicate or unknown upload event",
            namespace: namespace || null,
          },
          { status: 200 }
        );
      }

      const downloadUrl = await s3.getSignedUrlPromise("getObject", {
        Bucket: bucket,
        Key: key,
        Expires: 60 * 60, // 1 hour
      });

      const rawPrefix = process.env.S3_RAW_PREFIX || "videos/raw";
      const processedPrefix = process.env.S3_PROCESSED_PREFIX || "videos/processed";

      // Derive the output namespace by replacing the raw prefix with processed
      // e.g. videos/raw/<namespace>/file.mp4 → videos/processed/<namespace>
      const outputS3Path = processedPrefix + keyDir.substring(rawPrefix.length);

      console.log("🎥 New video uploaded:", key);
      console.log("📥 Download URL generated (expires in 1h)");
      console.log("📂 Output S3 path:", outputS3Path);
      console.log("📂 Claimed namespace for processing:", namespace);

      // Launch ECS task to process video
      const command = new RunTaskCommand({
        cluster: process.env.AWS_ECS_CLUSTER || process.env.ECS_CLUSTER_NAME,
        taskDefinition: process.env.AWS_ECS_TASK_DEFINITION || process.env.VIDEO_TASK_DEFINITION,
        launchType: "FARGATE",
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: (process.env.AWS_SUBNETS || process.env.AWS_SUBNET_ID || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            securityGroups: process.env.AWS_SECURITY_GROUP
              ? [process.env.AWS_SECURITY_GROUP]
              : undefined,
            assignPublicIp: "ENABLED",
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: process.env.AWS_CONTAINER_NAME || process.env.VIDEO_CONTAINER_NAME,
              environment: [
                { name: "VIDEO_URL", value: downloadUrl },
                { name: "NAMESPACE", value: namespace || "" },
              ],
            },
          ],
        },
      });

      let response;
      try {
        response = await ecs.send(command);
      } catch (ecsError) {
        await prisma.video.updateMany({
          where: { namespace, status: "processing_queued" },
          data: { status: "pending_upload" },
        });
        throw ecsError;
      }
      console.log("🚀 ECS Task started:", response.tasks?.[0]?.taskArn);

      return Response.json({
        message: "ECS task launched",
        taskArn: response.tasks?.[0]?.taskArn,
        downloadUrl,
      });
    }

    return Response.json({ message: "Invalid SNS message type" }, { status: 400 });
  } catch (err) {
    console.error("Error in trigger-processing:", err);
    return Response.json({ error: "Failed to trigger ECS" }, { status: 500 });
  }
}
