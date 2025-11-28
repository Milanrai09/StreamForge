// app/api/test/route.js

export async function GET(request) {
    return Response.json({
      message: "Test endpoint working!",
      success: true,
      timestamp: Date.now(),
    });
  }
  