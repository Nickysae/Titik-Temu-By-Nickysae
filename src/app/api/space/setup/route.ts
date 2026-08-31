import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, clearSession } from "@/lib/session";

// POST /api/space/setup - update relationship start date
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.coupleId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { relationshipStart, nextMeetingDate, nextMeetingCity, distance } = await req.json();

    if (relationshipStart) {
      await prisma.couple.update({
        where: { id: session.coupleId },
        data: {
          relationshipStart: new Date(relationshipStart),
        },
      });
    }

    if (nextMeetingDate && nextMeetingCity) {
      await prisma.meeting.create({
        data: {
          coupleId: session.coupleId,
          title: "Next Meeting",
          scheduledAt: new Date(nextMeetingDate),
          locationName: nextMeetingCity,
          distance: Number(distance) || 0,
          status: "PLANNED",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
