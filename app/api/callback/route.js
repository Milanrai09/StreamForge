





// const videosDatabase = [];

// export async function POST(request) {
//   try {
//     // Parse the incoming request body
//     const data = await request.json();

//     // Log all received data
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//     console.log("📥 Received video processing data:");
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//     console.log("Master Playlist URL:", data.masterPlaylist);
//     console.log("Total Files:", data.totalFiles);
//     console.log("Status:", data.status);
//     console.log("Processed At:", data.processedAt);
//     console.log("Thumbnails Count:", data.thumbnails?.length);
//     console.log("Thumbnails:", data.thumbnails);
//     console.log("All Files Count:", data.allFiles?.length);
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

//     // Validate required fields
//     if (!data.masterPlaylist) {
//       return Response.json(
//         { error: "masterPlaylist URL is required" },
//         { status: 400 }
//       );
//     }

//     // Create a video record (dummy object)
//     const videoRecord = {
//       id: `video_${Date.now()}`,
//       masterPlaylist: data.masterPlaylist,
//       thumbnails: data.thumbnails || [],
//       totalFiles: data.totalFiles,
//       status: data.status,
//       processedAt: data.processedAt,
//       createdAt: new Date().toISOString(),
//       allFilesCount: data.allFiles?.length || 0,
//     };

//     // Store in dummy database
//     videosDatabase.push(videoRecord);

// //create
//     // const user = await prisma.user.create({
//     //   data: {
//     //     email: "test@example.com",
//     //     name: "Milan",
//     //   },
//     // });

// // read
// // const users = await prisma.user.findMany();
// //get one user
// // const user = await prisma.user.findUnique({
// //   where: { id: "user-id-here" }
// // });

// // update

// // const updated = await prisma.user.update({
// //   where: { id: "user-id-here" },
// //   data: { name: "Updated Name" }
// // });


// //delete

// // const deleted = await prisma.user.delete({
// //   where: { id: "user-id-here" }
// // });


//     console.log("✅ Video record stored in database:");
//     console.log(JSON.stringify(videoRecord, null, 2));
//     console.log(`📊 Total videos in database: ${videosDatabase.length}`);
//     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

//     // Return success response
//     return Response.json(
//       {
//         success: true,
//         message: "Video processing data updated successfully",
//         videoId: videoRecord.id,
//         playlistUrl: data.masterPlaylist,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("❌ Error updating database:", error.message);
//     return Response.json(
//       { error: "Failed to update database", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Optional: GET endpoint to retrieve all videos from dummy database
// export async function GET() {
//   console.log("📋 Retrieving all videos from database...");
//   console.log(`Found ${videosDatabase.length} videos`);

//   return Response.json(
//     {
//       success: true,
//       count: videosDatabase.length,
//       videos: videosDatabase,
//     },
//     { status: 200 }
//   );
// }



// app/api/ecsCall/route.js
// Next.js 13+ API endpoint to receive callbacks from ECS Fargate tasks
// Logs all data received from ECS

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📥 ECS TASK CALLBACK RECEIVED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("\n📋 FULL REQUEST BODY:");
    console.log(JSON.stringify(body, null, 2));

    console.log("\n📊 PARSED DATA:");
    console.log("Status:", body.status);
    console.log("Video URL:", body.videoUrl);
    console.log("Task ARN:", body.taskArn);
    console.log("Timestamp:", body.timestamp);
    console.log("S3 Bucket:", body.s3Bucket);
    console.log("Video Key:", body.videoKey);
    console.log("Output S3 Path:", body.outputS3Path);
    console.log("Error:", body.error);
    console.log("Error Message:", body.errorMessage);
    console.log("Progress:", body.progress);
    console.log("Current Frame:", body.currentFrame);
    console.log("Total Frames:", body.totalFrames);
    console.log("Result:", body.result);

    console.log("\n🔍 ALL PROPERTIES:");
    Object.keys(body).forEach((key) => {
      console.log(`  ${key}: ${JSON.stringify(body[key])}`);
    });

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return Response.json(
      {
        ok: true,
        message: "Callback received and logged",
        receivedStatus: body.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("\n❌ ERROR PARSING CALLBACK:");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  console.log("✅ ECS Callback API is running");
  return Response.json({
    ok: true,
    message: "ECS callback API is running and ready to receive data",
    timestamp: new Date().toISOString(),
  });
}