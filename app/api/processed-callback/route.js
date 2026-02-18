import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function extractNamespaceFromRawKey(key, rawPrefix) {
  const normalizedPrefix = String(rawPrefix || "videos/raw").replace(/\/+$/, "");
  const normalizedKey = String(key || "").replace(/\/+$/, "");
  const prefixWithSlash = `${normalizedPrefix}/`;

  if (normalizedKey.startsWith(prefixWithSlash)) {
    const rest = normalizedKey.slice(prefixWithSlash.length);
    return rest.split("/")[0] || null;
  }

  // Fallback: last segment if key shape is unexpected.
  return normalizedKey.split("/").pop() || null;
}

export async function POST(request) {
  try {
    const body = await request.json();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎬 VIDEO CALLBACK RECEIVED");
    console.log(JSON.stringify(body, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Handle S3 event payload shape from SNS/S3 notifications.
    if (Array.isArray(body.Records) && body.Records[0]?.s3?.object?.key) {
      const record = body.Records[0];
      const bucket = record.s3.bucket.name;
      const rawKey = decodeURIComponent(record.s3.object.key);
      const region = process.env.AWS_REGION;
      const rawPrefix = process.env.S3_RAW_PREFIX || "videos/raw";
      const namespace = extractNamespaceFromRawKey(rawKey, rawPrefix);
      const isFolderMarker =
        rawKey.endsWith("/") || Number(record.s3.object.size || 0) === 0;

      if (!namespace) {
        return NextResponse.json(
          { error: "Could not extract namespace from S3 key", key: rawKey },
          { status: 400 }
        );
      }

      // Namespace placeholder object (size 0) is expected; acknowledge and skip DB writes.
      if (isFolderMarker) {
        return NextResponse.json(
          {
            ok: true,
            message: "Namespace marker event ignored",
            namespace,
            key: rawKey,
          },
          { status: 200 }
        );
      }

      const objectUrl = `https://${bucket}.s3.${region}.amazonaws.com/${rawKey}`;
      await prisma.video.updateMany({
        where: { namespace },
        data: {
          videoLink: objectUrl,
        },
      });

      return NextResponse.json(
        {
          ok: true,
          message: "S3 upload callback processed",
          namespace,
          videoLink: objectUrl,
        },
        { status: 200 }
      );
    }

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

export async function GET(request) {
  try {
    // Get Auth0 user ID from session
    // const session = await getSession();
    
    // if (!session?.user) {
    //   return Response.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const userId = process.env.USERID //session.user.sub; // Auth0 user ID
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    // Get specific video by videoId AND userId relationship
    if (videoId) {
      const video = await prisma.video.findFirst({
        where: {
          videoId: videoId,
          userId: userId, // Use the FK relationship - Auth0 ID
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      if (!video || video.isDeleted) {
        return Response.json(
          { error: "Video not found" },
          { status: 404 }
        );
      }

      return Response.json(video, { status: 200 });
    }

    // Get all videos for current user only
    const videos = await prisma.video.findMany({
      where: { 
        userId: userId, // Filter by Auth0 user ID (FK relationship)
        isDeleted: false 
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return Response.json(
      {
        ok: true,
        total: videos.length,
        userId: userId,
        videos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET Error:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
