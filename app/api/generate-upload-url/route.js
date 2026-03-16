import AWS from "aws-sdk";
import { prisma } from "@/lib/prisma";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function sanitizeFileName(fileName) {
  return String(fileName || "upload.bin").replace(/[^\w.\-]/g, "_");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      fileName,
      fileType,
      title,
      description,
      userId,
      username,
    } = body;

    if (!fileName || !fileType || !title || !userId) {
      return Response.json(
        { error: "Missing required fields: fileName, fileType, title, userId" },
        { status: 400 }
      );
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const namespace = `${slugify(title)}-${randomNum}-${slugify(username || "user")}`;
    const cleanFileName = sanitizeFileName(fileName);
    const rawPrefix = process.env.S3_RAW_PREFIX || "videos/raw";
    const namespacePrefix = `${rawPrefix}/${namespace}/`;
    const key = `${namespacePrefix}${cleanFileName}`;

    // Create folder-like namespace object before issuing upload URL
    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET,
        Key: namespacePrefix,
        Body: "",
      })
      .promise();

    const uploadURL = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5,
    });

    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: username || null },
    });

    const videoRecord = await prisma.video.create({
      data: {
        userId,
        title,
        description: description || "",
        status: "pending_upload",
        namespace,
        videoLink: uploadURL,
      },
    });

    return Response.json(
      {
        uploadURL,
        key,
        namespace,
        publicUrl,
        videoId: namespace,
        databaseId: videoRecord.id,
        status: videoRecord.status,
        message: "Upload URL generated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error generating URL:", error);
    return Response.json(
      {
        error: "Failed to generate signed URL",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    message: "Generate upload URL endpoint",
  });
}
