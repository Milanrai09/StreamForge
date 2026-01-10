import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
      const session = await getSession(req);
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const videoId = params.id;
  
      // Fetch video + renditions + thumbnails
      const video = await prisma.video.findUnique({
        where: { id: videoId },
        include: {
          renditions: true,
          thumbnails: true,
          logs: {
            orderBy: { createdAt: "desc" }
          },
          user: true
        }
      });
  
      if (!video) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }
  
      // Optional: ensure user owns this video
      if (video.userId !== session.user.sub) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
  
      return NextResponse.json({
        id: video.id,
        title: video.title,
        description: video.description,
        tags: video.tags,
        status: video.status,
        masterPlaylistUrl: video.masterPlaylistUrl,
  
        renditions: video.renditions.map(r => ({
          id: r.id,
          resolution: r.resolution,
          bitrate: r.bitrate,
          playlistUrl: r.playlistUrl,
          segmentCount: r.segmentCount
        })),
  
        thumbnails: video.thumbnails,
        logs: video.logs,
        uploadedAt: video.uploadedAt,
        processedAt: video.processedAt
      });
    } catch (err) {
      console.error("❌ Error fetching video:", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
// PATCH → Update video
export async function PATCH(req, { params }) {
  const data = await req.json();

  const video = await prisma.video.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(video);
}

// DELETE → Delete video
export async function DELETE(req, { params }) {
  await prisma.video.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
