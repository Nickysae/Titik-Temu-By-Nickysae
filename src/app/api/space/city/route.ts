import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getCityCoordinates, getDistanceKm } from "@/lib/geo";

// POST /api/space/city - update current user's city or partner's city
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const user = session.user;
    const couple = session.couple;

    if (!user || !couple) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { city } = await req.json();

    if (!city || !city.trim()) {
      return NextResponse.json({ error: "Nama kota tidak boleh kosong" }, { status: 400 });
    }

    const cleanCity = city.trim();

    // 1. Update user's city in User table
    await prisma.user.update({
      where: { id: user.id },
      data: { city: cleanCity },
    });

    // 2. Identify if this user is Creator (A) or Partner (B) in Couple
    const member = couple.members.find((m: any) => m.userId === user.id);
    const isCreator = member?.role === "CREATOR";

    await prisma.couple.update({
      where: { id: couple.id },
      data: isCreator ? { userACity: cleanCity } : { userBCity: cleanCity },
    });

    // 3. Automatically add a milestone log in "Our Story"
    await prisma.milestone.create({
      data: {
        coupleId: couple.id,
        title: `${user.name} Pindah ke ${cleanCity}`,
        description: `Memulai babak baru dari kota ${cleanCity}. Jarak baru disesuaikan.`,
        date: new Date(),
        type: "MOMENT",
      },
    });

    return NextResponse.json({ success: true, city: cleanCity });
  } catch (error) {
    console.error("Update city error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
