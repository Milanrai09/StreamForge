import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";

// ✅ S3 v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ ECS v3 (already correct)
const ecs = new ECSClient({
  region: process.env.AWS_REGION,
});

// ─────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📩 Incoming Body:", body);

    // 1. Direct S3 Event
    if (body.Records && body.Records[0]?.eventSource === "aws:s3") {
      console.log("📦 Direct S3 Event Detected");

      const record = body.Records[0];
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key);

      return await handleS3Event(bucket, key);
    }

    // 2. SNS Subscription Confirmation
    if (body.Type === "SubscriptionConfirmation") {
      const confirmUrl = body.SubscribeURL;

      console.log("🔗 Confirming SNS subscription:", confirmUrl);
      await fetch(confirmUrl);

      console.log("✅ SNS Subscription Confirmed");

      return Response.json({ message: "Subscription confirmed" });
    }

    // 3. SNS Notification
    if (body.Type === "Notification") {
      let snsMessage;

      try {
        snsMessage = JSON.parse(body.Message);
      } catch (err) {
        console.log("⚠️ Invalid SNS message format:", body.Message);
        return Response.json({ message: "Invalid message format" }, { status: 200 });
      }

      const record = snsMessage.Records?.[0];

      if (!record) {
        console.log("⚠️ No S3 record in SNS message");
        return Response.json({ message: "No record" }, { status: 200 });
      }

      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key);

      return await handleS3Event(bucket, key);
    }

    // 4. Ignore unknown
    console.log("ℹ️ Ignored message type:", body.Type);

    return Response.json({ message: "Ignored" }, { status: 200 });

  } catch (err) {
    console.error("❌ Error in trigger-processing:", err);

    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// CORE S3 HANDLER
// ─────────────────────────────────────────────
async function handleS3Event(bucket, key) {
  try {
    // ✅ Ignore folder-creation events (empty objects ending with /) and non-video files.
    // The upload API creates an empty folder object before the real upload, which fires
    // its own S3 event. Without this guard, the container gets launched with the folder
    // key (0 bytes) instead of the actual video file.
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];
    const hasVideoExtension = videoExtensions.some((ext) => key.toLowerCase().endsWith(ext));
    if (key.endsWith("/") || !hasVideoExtension) {
      console.log("⏭️ Skipping non-video key:", key);
      return Response.json({ message: "Skipping non-video key" });
    }

    const keyDir = key.substring(0, key.lastIndexOf("/"));
    const namespace = keyDir.split("/").pop();

    console.log("📦 Bucket:", bucket);
    console.log("📁 Key:", key);
    console.log("🧠 Namespace:", namespace);

    // 🧠 Idempotency
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
      console.log("⏭️ Skipping duplicate or unknown upload");

      return Response.json({
        message: "Skipping duplicate or unknown upload event",
        namespace: namespace || null,
      });
    }

    // 🔐 Generate signed DOWNLOAD URL (v3)
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 60, // 1 hour
    });

    const rawPrefix = process.env.S3_RAW_PREFIX || "videos/raw";
    const processedPrefix = process.env.S3_PROCESSED_PREFIX || "videos/processed";

    const outputS3Path =
      processedPrefix + keyDir.substring(rawPrefix.length);

    console.log("🎥 New video uploaded:", key);
    console.log("📥 Download URL generated");
    console.log("📂 Output S3 path:", outputS3Path);

    // 🚀 ECS TASK
    const ecsCommand = new RunTaskCommand({
      cluster:
        process.env.AWS_ECS_CLUSTER ||
        process.env.ECS_CLUSTER_NAME,

      taskDefinition:
        process.env.AWS_ECS_TASK_DEFINITION ||
        process.env.VIDEO_TASK_DEFINITION,

      launchType: "FARGATE",

      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: (
            process.env.AWS_SUBNETS ||
            process.env.AWS_SUBNET_ID ||
            ""
          )
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
            name:
              process.env.AWS_CONTAINER_NAME ||
              process.env.VIDEO_CONTAINER_NAME,

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
      response = await ecs.send(ecsCommand);
    } catch (ecsError) {
      console.error("❌ ECS failed, reverting DB");

      await prisma.video.updateMany({
        where: {
          namespace,
          status: "processing_queued",
        },
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

  } catch (err) {
    console.error("❌ Error in handleS3Event:", err);

    return Response.json(
      { error: "Failed to process S3 event" },
      { status: 500 }
    );
  }
}