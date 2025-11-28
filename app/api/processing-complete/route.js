import { videos } from "@/lib/db";

export async function POST(req) {
  const { videoId, processedKey } = await req.json();
  const video = videos.find((v) => v.id === videoId);
  if (!video) return Response.json({ error: "Video not found" }, { status: 404 });

  video.status = "processed";
  video.processedKey = processedKey;
  video.processedUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${processedKey}`;
  video.updatedAt = new Date();

  console.log("✅ Video marked as processed:", video);

  return Response.json({ success: true, video });
}



