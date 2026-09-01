import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { name, city, inviteCode, pin } = await req.json();

    if (!name?.trim() || !inviteCode?.trim()) {
      return NextResponse.json(
        { error: "Name and invite code are required" },
        { status: 400 }
      );
    }

    const cleanCode = inviteCode.trim().toUpperCase();

    // 1. Find Couple
    const couple = await prisma.couple.findUnique({
      where: { inviteCode: cleanCode },
      include: { members: true },
    });

    if (!couple) {
      return NextResponse.json(
        { error: "Kode ruang tidak ditemukan. Periksa kembali kodenya." },
        { status: 404 }
      );
    }

    // Verify PIN if the creator set one
    if (couple.pin) {
      const cleanPin = pin ? String(pin).trim() : "";
      if (!cleanPin || cleanPin !== couple.pin) {
        return NextResponse.json(
          { error: "PIN Ruang salah. Tanyakan 4-digit PIN ke pasanganmu." },
          { status: 403 }
        );
      }
    }

    if (couple.members.length >= 2) {
      return NextResponse.json(
        { error: "Ruang pasangan ini sudah terisi 2 orang." },
        { status: 400 }
      );
    }

    // 2. Create User
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        city: city?.trim() || null,
      },
    });

    // 3. Add Member & Activate Space
    await prisma.coupleMember.create({
      data: {
        coupleId: couple.id,
        userId: user.id,
        role: "PARTNER",
      },
    });

    await prisma.couple.update({
      where: { id: couple.id },
      data: {
        status: "ACTIVE",
        userBCity: city?.trim() || null,
      },
    });

    // 4. Create initial Rindu Jar if none exists
    const existingJar = await prisma.rinduJar.findFirst({
      where: { coupleId: couple.id },
    });

    if (!existingJar) {
      await prisma.rinduJar.create({
        data: {
          coupleId: couple.id,
          status: "LOCKED",
        },
      });
    }

    // 5. Create initial Milestone
    await prisma.milestone.create({
      data: {
        coupleId: couple.id,
        title: "Two Halves Connected",
        description: "Joined Titik Temu together.",
        date: new Date(),
        type: "START",
      },
    });

    // 6. Set Session Cookies
    await setSession(user.id, couple.id);

    return NextResponse.json({
      success: true,
      coupleId: couple.id,
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
