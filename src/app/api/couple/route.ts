import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/couple - get couple data including next meeting, days together, distance
export async function GET() {
  try {
    const couple = await prisma.couple.findFirst({
      include: {
        members: {
          include: { user: true },
        },
        meetings: {
          orderBy: { scheduledAt: "asc" },
        },
        milestones: {
          orderBy: { date: "asc" },
        },
      },
    });

    if (!couple) {
      return NextResponse.json({ error: "No couple found" }, { status: 404 });
    }

    const now = new Date();
    const start = new Date(couple.relationshipStart);
    const daysTogether = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const nextMeeting = couple.meetings.find(
      (m) => new Date(m.scheduledAt) > now && m.status === "PLANNED"
    );
    
    const daysUntilMeet = nextMeeting
      ? Math.ceil(
          (new Date(nextMeeting.scheduledAt).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return NextResponse.json({
      couple,
      daysTogether,
      nextMeeting: nextMeeting ?? null,
      daysUntilMeet,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
