

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
