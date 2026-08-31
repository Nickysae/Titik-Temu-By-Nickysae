import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/meeting - create a new meeting
export async function POST(req: NextRequest) {
  try {
    const { title, scheduledAt, locationName, distance } = await req.json();

    if (!title || !scheduledAt || !locationName) {
      return NextResponse.json(
        { error: "Title, scheduledAt, and locationName are required" },
        { status: 400 }
      );
    }

    const couple = await prisma.couple.findFirst();
    if (!couple) {
      return NextResponse.json({ error: "No couple found" }, { status: 404 });
    }

    const meeting = await prisma.meeting.create({
      data: {
        coupleId: couple.id,
        title: title.trim(),
        scheduledAt: new Date(scheduledAt),
        locationName: locationName.trim(),
        distance: Number(distance) || 0,
        status: "PLANNED",
      },
    });

    // Check if there is an active locked jar, if not, create one linked to this meeting
    const activeJar = await prisma.rinduJar.findFirst({
      where: { coupleId: couple.id, status: "LOCKED" },
    });

    if (!activeJar) {
      await prisma.rinduJar.create({
        data: {
          coupleId: couple.id,
          meetingId: meeting.id,
          status: "LOCKED",
        },
      });
    }

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
