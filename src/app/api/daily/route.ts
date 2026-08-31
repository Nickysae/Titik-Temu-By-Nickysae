import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getQuestionForDate } from "@/lib/dailyQuestions";

// GET /api/daily - fetch today's question & both answers if unlocked
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const couple = session.couple;
    const user = session.user;

    if (!couple || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const question = getQuestionForDate(today);

    // Find all answers for today for this couple
    const answers = await prisma.dailyAnswer.findMany({
      where: {
        coupleId: couple.id,
        dateKey: today,
      },
    });

    const myAnswer = answers.find((a) => a.userId === user.id);
    const partnerMember = couple.members.find((m: any) => m.userId !== user.id);
    const partnerAnswer = partnerMember
      ? answers.find((a) => a.userId === partnerMember.userId)
      : null;

    const isUnlocked = Boolean(myAnswer && partnerAnswer);

    return NextResponse.json({
      dateKey: today,
      question,
      hasMyAnswer: Boolean(myAnswer),
      hasPartnerAnswer: Boolean(partnerAnswer),
      isUnlocked,
      myAnswer: myAnswer ? myAnswer.answer : null,
      partnerAnswer: isUnlocked && partnerAnswer ? partnerAnswer.answer : null,
      partnerName: partnerMember ? partnerMember.user.name : "Pasanganmu",
      streakDays: 1, // can be expanded
    });
  } catch (error) {
    console.error("Daily question GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/daily - submit answer to today's question
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const couple = session.couple;
    const user = session.user;

    if (!couple || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answer } = await req.json();
    if (!answer || !answer.trim()) {
      return NextResponse.json({ error: "Answer cannot be empty" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    const dailyAnswer = await prisma.dailyAnswer.upsert({
      where: {
        coupleId_userId_dateKey: {
          coupleId: couple.id,
          userId: user.id,
          dateKey: today,
        },
      },
      update: {
        answer: answer.trim(),
      },
      create: {
        coupleId: couple.id,
        userId: user.id,
        dateKey: today,
        answer: answer.trim(),
      },
    });

    return NextResponse.json({ success: true, answer: dailyAnswer });
  } catch (error) {
    console.error("Daily question POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
