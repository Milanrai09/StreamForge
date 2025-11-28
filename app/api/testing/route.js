// app/api/test/route.js

export async function GET(request) {
    console.log('helo form testing')
    return Response.json({
      message: "Test endpoint working!",
      success: true,
      timestamp: Date.now(),
    });
  }
