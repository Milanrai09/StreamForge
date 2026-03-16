import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎬 VIDEO CALLBACK RECEIVED");
    console.log(JSON.stringify(body, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (!body.masterPlaylist || !body.thumbnails || !body.allFiles) {
      return NextResponse.json(
        { error: "Invalid callback payload" },
        { status: 400 }
      );
    }

    // processed/<namespace>/master.m3u8 → <namespace>
    const match = body.masterPlaylist.match(/processed\/([^/]+)\//);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid masterPlaylist path" },
        { status: 400 }
      );
    }

    const namespace = match[1];

    console.log("🆔 Namespace:", namespace);

    const hls = {
      master: body.masterPlaylist,
      "1080p": body.allFiles.find(f => f.key.includes("1080p"))?.url,
      "720p": body.allFiles.find(f => f.key.includes("720p"))?.url,
      "480p": body.allFiles.find(f => f.key.includes("480p"))?.url,
      "360p": body.allFiles.find(f => f.key.includes("360p"))?.url,
    };

    const video = await prisma.video.findUnique({
      where: { namespace },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    const updatedVideo = await prisma.video.update({
      where: { namespace },
      data: {
        status: "processed",
        hlsMaster: hls.master,
        hls1080p: hls["1080p"],
        hls720p: hls["720p"],
        hls480p: hls["480p"],
        hls360p: hls["360p"],
        thumbnails: body.thumbnails,
        allFiles: body.allFiles,
        totalFiles: body.totalFiles,
        processingCompletedAt: new Date(body.processedAt),
      },
    });

    console.log("✅ Video updated:", updatedVideo.id);

    return NextResponse.json({
      ok: true,
      namespace,
      status: "processed",
    });
  } catch (error) {
    console.error("❌ CALLBACK ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

