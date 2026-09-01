import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

// GET /api/rindu - get rindu for current session couple
export async function GET() {
  try {
    const session = await getSession();
    if (!session.coupleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeJar = session.couple.rinduJars[0] ?? null;
    const rindus = activeJar?.rindus ?? [];

    const countByUser: Record<string, number> = {};
    for (const r of rindus) {
      countByUser[r.authorId] = (countByUser[r.authorId] ?? 0) + 1;
    }

    return NextResponse.json({
      jar: activeJar,
      total: rindus.length,
      countByUser,
      rindus: activeJar?.status === "OPENED" ? rindus : [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/rindu - save a new rindu entry scoped to current couple and author
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.coupleId || !session.userId) {
      return NextResponse.json({ error: "No active couple space" }, { status: 401 });
    }

    const { content, photoUrl } = await req.json();
    if (!content?.trim() && !photoUrl) {
      return NextResponse.json({ error: "Content or photo is required" }, { status: 400 });
    }

    // Find active LOCKED jar for this couple
    let jar = await prisma.rinduJar.findFirst({
      where: { coupleId: session.coupleId, status: "LOCKED" },
      orderBy: { createdAt: "desc" },
    });

    if (!jar) {
      jar = await prisma.rinduJar.create({
        data: { coupleId: session.coupleId, status: "LOCKED" },
      });
    }

    const rindu = await prisma.rindu.create({
      data: {
        jarId: jar.id,
        authorId: session.userId,
        content: content?.trim() || "(Foto Kenangan)",
        photoUrl: photoUrl || null,
      },
      include: { author: true },
    });

    return NextResponse.json({ rindu }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
