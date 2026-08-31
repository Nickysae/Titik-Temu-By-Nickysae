import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/jar/reset - archive current opened jar and start a fresh locked one
export async function POST(req: NextRequest) {
  try {
    const couple = await prisma.couple.findFirst({
      include: {
        rinduJars: {
          where: { status: "OPENED" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        meetings: {
          where: { status: "PLANNED" },
          orderBy: { scheduledAt: "asc" },
          take: 1,
        },
      },
    });

    if (!couple) {
      return NextResponse.json({ error: "No couple found" }, { status: 404 });
    }

    // 1. Archive previous opened jar
    const currentJar = couple.rinduJars[0];
    if (currentJar) {
      await prisma.rinduJar.update({
        where: { id: currentJar.id },
        data: { status: "ARCHIVED" },
      });
    }

    // 2. Create new LOCKED jar
    const nextMeeting = couple.meetings[0];
    const newJar = await prisma.rinduJar.create({
      data: {
        coupleId: couple.id,
        meetingId: nextMeeting?.id || null,
        status: "LOCKED",
      },
    });

    return NextResponse.json({ success: true, jar: newJar });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
