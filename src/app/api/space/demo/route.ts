import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

// POST /api/space/demo - Instant 1-click access to Layla & Majnun demo space
export async function POST() {
  try {
    // 1. Find or create Layla and Majnun
    let majnun = await prisma.user.findFirst({
      where: { name: "Majnun" },
    });

    if (!majnun) {
      majnun = await prisma.user.create({
        data: { name: "Majnun", city: "Najd" },
      });
    }

    let layla = await prisma.user.findFirst({
      where: { name: "Layla" },
    });

    if (!layla) {
      layla = await prisma.user.create({
        data: { name: "Layla", city: "Sham" },
      });
    }

    // 2. Find or create Demo Couple
    let couple = await prisma.couple.findUnique({
      where: { inviteCode: "TEMU-DEMO" },
      include: { members: true },
    });

    if (!couple) {
      couple = await prisma.couple.create({
        data: {
          inviteCode: "TEMU-DEMO",
          status: "ACTIVE",
          relationshipStart: new Date("2024-01-14"),
          userACity: "Najd",
          userBCity: "Sham",
          members: {
            create: [
              { userId: majnun.id, role: "CREATOR" },
              { userId: layla.id, role: "PARTNER" },
            ],
          },
        },
        include: { members: true },
      });

      // Create sample meeting
      await prisma.meeting.create({
        data: {
          coupleId: couple.id,
          title: "Pertemuan di Bawah Bintang",
          scheduledAt: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000), // 38 days from now
          locationName: "Padang Pasir Cinta",
          distance: 327,
          status: "PLANNED",
        },
      });

      // Create sample Rindu Jar
      const jar = await prisma.rinduJar.create({
        data: {
          coupleId: couple.id,
          status: "LOCKED",
        },
      });

      // Create sample poetic rindus
      await prisma.rindu.createMany({
        data: [
          { jarId: jar.id, authorId: majnun.id, content: "Bahkan hembusan angin malam mengingatkanku pada suaramu, Layla." },
          { jarId: jar.id, authorId: layla.id, content: "Jarak ini hanya menguji seberapa luas ruang hatiku untukmu." },
          { jarId: jar.id, authorId: majnun.id, content: "Setiap langkah menuju pertemuan adalah bait syair terindah." },
        ],
      });

      // Create sample milestone
      await prisma.milestone.createMany({
        data: [
          { coupleId: couple.id, title: "Awal Cerita Abadi", description: "Dua jiwa yang saling menemukan di tengah jarak.", date: new Date("2024-01-14"), type: "START" },
          { coupleId: couple.id, title: "Pertemuan Pertama", description: "Ketika dunia terasa berhenti berputar.", date: new Date("2024-07-17"), type: "MEETING" },
        ],
      });
    }

    // 3. Set cookie session directly to Majnun
    await setSession(majnun.id, couple.id);

    return NextResponse.json({ success: true, coupleId: couple.id });
  } catch (error) {
    console.error("Demo space error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
