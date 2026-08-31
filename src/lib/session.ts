import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const USER_COOKIE = "titik_user_id";
const COUPLE_COOKIE = "titik_couple_id";

export interface SessionData {
  userId: string | null;
  coupleId: string | null;
  user: { id: string; name: string; city: string | null } | null;
  couple: any | null;
}

export async function getSession(): Promise<SessionData> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_COOKIE)?.value || null;
  const coupleId = cookieStore.get(COUPLE_COOKIE)?.value || null;

  if (!userId || !coupleId) {
    // Check if there is an active seed couple for initial fallback or return null
    return { userId: null, coupleId: null, user: null, couple: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const couple = await prisma.couple.findUnique({
    where: { id: coupleId },
    include: {
      members: { include: { user: true } },
      meetings: { orderBy: { scheduledAt: "asc" } },
      milestones: { orderBy: { date: "asc" } },
      rinduJars: {
        include: {
          rindus: {
            include: { author: true },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return {
    userId,
    coupleId,
    user,
    couple,
  };
}

export async function setSession(userId: string, coupleId: string) {
  const cookieStore = await cookies();
  // 1 year expiration
  const oneYear = 60 * 60 * 24 * 365;

  cookieStore.set(USER_COOKIE, userId, {
    path: "/",
    maxAge: oneYear,
    httpOnly: true,
    sameSite: "lax",
  });

  cookieStore.set(COUPLE_COOKIE, coupleId, {
    path: "/",
    maxAge: oneYear,
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
  cookieStore.delete(COUPLE_COOKIE);
}
