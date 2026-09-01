import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "TEMU-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { name, city, pin } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const cleanPin = pin ? String(pin).trim() : null;

    // 1. Create User
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        city: city?.trim() || null,
      },
    });

    // 2. Generate unique invite code
    let inviteCode = generateInviteCode();
    let isUnique = false;
    while (!isUnique) {
      const existing = await prisma.couple.findUnique({ where: { inviteCode } });
      if (!existing) isUnique = true;
      else inviteCode = generateInviteCode();
    }

    // 3. Create Couple Space with PIN
    const couple = await prisma.couple.create({
      data: {
        inviteCode,
        pin: cleanPin,
        status: "PENDING",
        userACity: city?.trim() || null,
        relationshipStart: new Date(),
        members: {
          create: [{ userId: user.id, role: "CREATOR" }],
        },
      },
    });

    // 4. Set Session Cookies
    await setSession(user.id, couple.id);

    return NextResponse.json({
      success: true,
      inviteCode,
      coupleId: couple.id,
      userId: user.id,
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
