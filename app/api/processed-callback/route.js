// Simple in-memory database for processed videos
const processedVideos = {};

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ VIDEO PROCESSING COMPLETE - CALLBACK RECEIVED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Validate callback data
    if (!body.masterPlaylist || !body.thumbnails || !body.allFiles) {
      console.error("❌ Invalid callback data");
      return Response.json(
        { error: "Invalid callback data" },
        { status: 400 }
      );
    }

    // Extract video ID from the processed path
    // e.g., "processed/video_b140aebd/master.m3u8" -> "video_b140aebd"
    const videoIdMatch = body.masterPlaylist.match(/processed\/(video_[a-f0-9]+)\//);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      console.error("❌ Could not extract video ID");
      return Response.json(
        { error: "Could not extract video ID" },
        { status: 400 }
      );
    }

    console.log("📝 Video ID:", videoId);

    // Extract HLS variants from allFiles
    const hlsVariants = {
      master: body.masterPlaylist,
      "1080p": body.allFiles.find(f => f.key.includes("1080p_h264.m3u8"))?.url,
      "720p": body.allFiles.find(f => f.key.includes("720p_h264.m3u8"))?.url,
      "480p": body.allFiles.find(f => f.key.includes("480p_h264.m3u8"))?.url,
      "360p": body.allFiles.find(f => f.key.includes("360p_h264.m3u8"))?.url,
    };

    console.log("📹 HLS Variants:");
    Object.entries(hlsVariants).forEach(([quality, url]) => {
      console.log(`  ${quality}: ${url ? "✅" : "❌"}`);
    });

    // Store in memory
    processedVideos[videoId] = {
      videoId,
      status: "processed",
      hlsPlaylist: hlsVariants,
      thumbnails: body.thumbnails,
      totalFiles: body.totalFiles,
      processedAt: new Date(body.processedAt),
      createdAt: new Date(),
      allFiles: body.allFiles, // Store all files for reference
    };

    console.log("\n🎯 Saved to memory");
    console.log("Thumbnails:", body.thumbnails.length, "images");
    console.log("Total files:", body.totalFiles);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return Response.json(
      {
        ok: true,
        message: "Video processing completed and saved",
        videoId,
        status: "processed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Callback Error:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Optional: Get a specific video by ID
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (videoId) {
      const video = processedVideos[videoId];
      if (!video) {
        return Response.json(
          { error: "Video not found" },
          { status: 404 }
        );
      }
      return Response.json(video, { status: 200 });
    }

    // Get all videos
    const videoIds = Object.keys(processedVideos);
    return Response.json(
      {
        ok: true,
        message: "Video processing callback handler",
        totalVideos: videoIds.length,
        videoIds,
        videos: processedVideos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET Error:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}