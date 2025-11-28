// app/api/generate-upload-url/route.js
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// Temporary in-memory "DB"
let videos = [];

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileName, fileType, title, description, tags = [] } = body;
    const id = uuidv4();
    const key = `videos/raw/${id}-${fileName}`;

    // 1️⃣ Generate pre-signed upload URL
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5, // 5 minutes

    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);

    // 2️⃣ Store metadata
    const videoData = {
      id,
      title,
      description,
      tags,
      fileName,
      fileType,
      key,
      status: "uploading",
      createdAt: new Date(),
    };

    videos.push(videoData);
    console.log("video data",videos)

    // 3️⃣ Return response
    return Response.json({ uploadURL, key, videoId: id });
  } catch (err) {
    console.error("Error generating URL:", err);
    return Response.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}






