import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/milestone - create a custom milestone/moment
export async function POST(req: NextRequest) {
  try {
    const { title, description, date, type } = await req.json();

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      );
    }

    const couple = await prisma.couple.findFirst();
    if (!couple) {
      return NextResponse.json({ error: "No couple found" }, { status: 404 });
    }

    const milestone = await prisma.milestone.create({
      data: {
        coupleId: couple.id,
        title: title.trim(),
        description: description?.trim() || null,
        date: new Date(date),
        type: type || "MOMENT",
      },
    });

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
