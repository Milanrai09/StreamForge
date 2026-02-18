import { prisma } from "@/lib/prisma";

export async function syncAuth0User(sessionUser) {
  if (!sessionUser?.sub) {
    throw new Error("Auth0 user id missing");
  }

  const userId = sessionUser.sub;
  const displayName =
    sessionUser.name ||
    sessionUser.nickname ||
    sessionUser.given_name ||
    sessionUser.email ||
    userId;

  return prisma.user.upsert({
    where: { id: userId },
    update: {
      name: displayName,
    },
    create: {
      id: userId,
      name: displayName,
    },
  });
}
