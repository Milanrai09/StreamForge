import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";

// ✅ AWS SDK v3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ─────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// POST: Generate signed upload URL
// ─────────────────────────────────────────────
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

    // ✅ namespace
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const namespace = `${slugify(title)}-${randomNum}-${slugify(
      username || "user"
    )}`;

    const cleanFileName = sanitizeFileName(fileName);

    const rawPrefix = process.env.S3_RAW_PREFIX || "videos/raw";
    const namespacePrefix = `${rawPrefix}/${namespace}/`;

    const key = `${namespacePrefix}${cleanFileName}`;

    // ✅ create folder-like prefix (optional)
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: namespacePrefix,
        Body: "",
      })
    );

    // ✅ generate signed URL
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // 5 min
    });

    // ✅ permanent public URL
    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // ✅ ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: username || null },
    });

    // ⚠️ store PUBLIC URL, not signed URL
    const videoRecord = await prisma.video.create({
      data: {
        userId,
        title,
        description: description || "",
        status: "pending_upload",
        namespace,
        videoLink: publicUrl,
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

// ─────────────────────────────────────────────
// GET: health check
// ─────────────────────────────────────────────
export async function GET() {
  return Response.json({
    ok: true,
    message: "Generate upload URL endpoint",
  });
}