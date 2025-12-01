// app/api/update-db/route.js
// Next.js 13+ App Router API Route

// Dummy database (in-memory storage)
const videosDatabase = [];

export async function POST(request) {
  try {
    // Parse the incoming request body
    const data = await request.json();

    // Log all received data
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📥 Received video processing data:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Master Playlist URL:", data.masterPlaylist);
    console.log("Total Files:", data.totalFiles);
    console.log("Status:", data.status);
    console.log("Processed At:", data.processedAt);
    console.log("Thumbnails Count:", data.thumbnails?.length);
    console.log("Thumbnails:", data.thumbnails);
    console.log("All Files Count:", data.allFiles?.length);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Validate required fields
    if (!data.masterPlaylist) {
      return Response.json(
        { error: "masterPlaylist URL is required" },
        { status: 400 }
      );
    }

    // Create a video record (dummy object)
    const videoRecord = {
      id: `video_${Date.now()}`,
      masterPlaylist: data.masterPlaylist,
      thumbnails: data.thumbnails || [],
      totalFiles: data.totalFiles,
      status: data.status,
      processedAt: data.processedAt,
      createdAt: new Date().toISOString(),
      allFilesCount: data.allFiles?.length || 0,
    };

    // Store in dummy database
    videosDatabase.push(videoRecord);

    console.log("✅ Video record stored in database:");
    console.log(JSON.stringify(videoRecord, null, 2));
    console.log(`📊 Total videos in database: ${videosDatabase.length}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Return success response
    return Response.json(
      {
        success: true,
        message: "Video processing data updated successfully",
        videoId: videoRecord.id,
        playlistUrl: data.masterPlaylist,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating database:", error.message);
    return Response.json(
      { error: "Failed to update database", details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve all videos from dummy database
export async function GET() {
  console.log("📋 Retrieving all videos from database...");
  console.log(`Found ${videosDatabase.length} videos`);

  return Response.json(
    {
      success: true,
      count: videosDatabase.length,
      videos: videosDatabase,
    },
    { status: 200 }
  );
}