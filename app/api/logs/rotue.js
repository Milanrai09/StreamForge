import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST → Add processing log
export async function POST(req) {
  const {
    videoId,
    stage,
    status,
    message,
    duration,
    errorCode,
    errorDetails,
  } = await req.json();

  const log = await prisma.processingLog.create({
    data: {
      videoId,
      stage,
      status,
      message,
      duration,
      errorCode,
      errorDetails,
    },
  });

  return NextResponse.json(log);
}
