import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { inviteCode, name } = await req.json();

    if (!inviteCode?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: "Kode undangan dan nama harus diisi" },
        { status: 400 }
      );
    }

    const code = inviteCode.trim().toUpperCase();
    const cleanName = name.trim();

    // Find the couple space by invite code
    const couple = await prisma.couple.findUnique({
      where: { inviteCode: code },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    if (!couple) {
      return NextResponse.json(
        { error: "Ruang dengan kode undangan tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    // Match member by name (case-insensitive)
    const matchingMember = couple.members.find(
      (m) => m.user.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (!matchingMember) {
      const memberNames = couple.members.map((m) => m.user.name).join(", ");
      return NextResponse.json(
        {
          error: `Nama "${cleanName}" tidak terdaftar di ruang ini. Nama yang terdaftar: ${memberNames}`,
        },
        { status: 400 }
      );
    }

    // Restore session
    await setSession(matchingMember.userId, couple.id);

    return NextResponse.json({
      success: true,
      user: matchingMember.user,
      coupleId: couple.id,
    });
  } catch (error) {
    console.error("Login space error:", error);
    return NextResponse.json(
      { error: "Gagal masuk ke ruang" },
      { status: 500 }
    );
  }
}
