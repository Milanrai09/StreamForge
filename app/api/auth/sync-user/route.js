import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { authId, email, name, picture } = body;

    if (!authId) {
      return NextResponse.json({ error: "authId missing" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { authId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          authId,
          email,
          name,
          picture
        }
      });
    } else {
      // Optional: update user profile on every login
      user = await prisma.user.update({
        where: { authId },
        data: {
          email,
          name,
          picture
        }
      });
    }

    return NextResponse.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
