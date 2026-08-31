import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/meeting/verify - verify meeting, unlock Rindu Jar & create a milestone
export async function POST(req: NextRequest) {
  try {
    const { getSession } = await import("@/lib/session");
    const session = await getSession();
    if (!session.couple) {
      return NextResponse.json({ error: "No couple found" }, { status: 404 });
    }

    const couple = await prisma.couple.findUnique({
      where: { id: session.couple.id },
      include: {
        meetings: {
          where: { status: "PLANNED" },
          orderBy: { scheduledAt: "asc" },
          take: 1,
        },
        rinduJars: {
          where: { status: "LOCKED" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!couple) {
      return NextResponse.json({ error: "No couple found" }, { status: 404 });
    }

    const meeting = couple.meetings[0];
    const jar = couple.rinduJars[0];

    // 1. Complete Meeting
    if (meeting) {
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: "COMPLETED" },
      });

      // Automatically add milestone
      await prisma.milestone.create({
        data: {
          coupleId: couple.id,
          title: meeting.title,
          description: `Met at ${meeting.locationName}. Distance crossed: ${meeting.distance} km.`,
          date: new Date(),
          type: "MEETING",
        },
      });
    }

    // 2. Unlock active Rindu Jar
    if (jar) {
      await prisma.rinduJar.update({
        where: { id: jar.id },
        data: { status: "OPENED" },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Two halves united! Meeting verified & Rindu Jar unlocked.",
      meetingId: meeting?.id,
      jarId: jar?.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
