import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  const session = await auth0.getSession();
  const userId = session?.user?.sub;

  if (!userId) {
    redirect("/auth/login");
  }

  const displayName =
    session.user.name ||
    session.user.nickname ||
    session.user.given_name ||
    session.user.email ||
    userId;

  // Ensure the user exists for FK-backed settings/profile writes.
  await prisma.user.upsert({
    where: { id: userId },
    update: {
      name: displayName,
      email: session.user.email || null,
    },
    create: {
      id: userId,
      name: displayName,
      email: session.user.email || null,
    },
  });

  return {
    userId,
    user: session.user,
  };
}
