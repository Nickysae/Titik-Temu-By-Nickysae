import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Titik Temu database...");

  // Create users
  const rosyid = await prisma.user.upsert({
    where: { id: "user-rosyid" },
    update: { name: "Rosyid", city: "Lamongan" },
    create: { id: "user-rosyid", name: "Rosyid", city: "Lamongan" },
  });

  const nara = await prisma.user.upsert({
    where: { id: "user-nara" },
    update: { name: "Nara", city: "Surabaya" },
    create: { id: "user-nara", name: "Nara", city: "Surabaya" },
  });

  console.log(`✅ Created users: ${rosyid.name}, ${nara.name}`);

  // Create couple with inviteCode
  const couple = await prisma.couple.upsert({
    where: { id: "couple-001" },
    update: {},
    create: {
      id: "couple-001",
      inviteCode: "TEMU-2026",
      status: "ACTIVE",
      relationshipStart: new Date("2025-01-14"),
      userACity: "Lamongan",
      userBCity: "Surabaya",
      members: {
        create: [
          { userId: rosyid.id, role: "CREATOR" },
          { userId: nara.id, role: "PARTNER" },
        ],
      },
    },
  });

  console.log(`✅ Created couple with inviteCode: ${couple.inviteCode}`);

  // Create meetings (past + upcoming)
  const meetings = [
    { id: "meet-1", title: "First Meeting", scheduledAt: new Date("2025-07-17"), locationName: "Surabaya", distance: 72, status: "COMPLETED" },
    { id: "meet-2", title: "Meeting #02",   scheduledAt: new Date("2025-09-20"), locationName: "Lamongan", distance: 45, status: "COMPLETED" },
    { id: "meet-3", title: "Meeting #03",   scheduledAt: new Date("2025-11-05"), locationName: "Malang",   distance: 95, status: "COMPLETED" },
    { id: "meet-4", title: "Meeting #04",   scheduledAt: new Date("2026-01-14"), locationName: "Surabaya", distance: 72, status: "COMPLETED" },
    { id: "meet-5", title: "Meeting #05",   scheduledAt: new Date("2026-02-20"), locationName: "Jogja",    distance: 327, status: "COMPLETED" },
    { id: "meet-6", title: "Meeting #06",   scheduledAt: new Date("2026-04-12"), locationName: "Surabaya", distance: 72, status: "COMPLETED" },
    { id: "meet-7", title: "Meeting #07",   scheduledAt: new Date("2026-07-17"), locationName: "Malang",   distance: 95, status: "COMPLETED" },
    { id: "meet-8", title: "Meeting #08",   scheduledAt: new Date("2026-09-14"), locationName: "Surabaya", distance: 72, status: "PLANNED" },
  ];

  for (const m of meetings) {
    await prisma.meeting.upsert({
      where: { id: m.id },
      update: {},
      create: { ...m, coupleId: couple.id },
    });
  }

  // Create Rindu Jar (LOCKED to next meeting)
  const jar = await prisma.rinduJar.upsert({
    where: { id: "jar-001" },
    update: {},
    create: {
      id: "jar-001",
      coupleId: couple.id,
      meetingId: "meet-8",
      status: "LOCKED",
    },
  });

  const rinduEntries = [
    { authorId: rosyid.id, content: "Kangen suara kamu waktu ketawa." },
    { authorId: nara.id,   content: "Kangen nemenin kamu makan sambil cerita hari ini." },
    { authorId: rosyid.id, content: "Kangen duduk diam-diam di sebelah kamu." },
    { authorId: nara.id,   content: "Kangen aroma parfum kamu yang selalu sama." },
    { authorId: rosyid.id, content: "Kangen lihat kamu bingung pilih menu makanan." },
  ];

  for (let i = 0; i < rinduEntries.length; i++) {
    await prisma.rindu.create({
      data: {
        jarId: jar.id,
        authorId: rinduEntries[i].authorId,
        content: rinduEntries[i].content,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      },
    });
  }

  const milestones = [
    { id: "ms-1", title: "We started",        date: new Date("2025-01-14"), type: "START",       description: "The beginning of us." },
    { id: "ms-2", title: "First Meeting",      date: new Date("2025-07-17"), type: "MEETING",     description: "The distance disappeared for the first time." },
    { id: "ms-3", title: "One Year Together",  date: new Date("2026-01-14"), type: "ANNIVERSARY", description: "365 days of choosing each other." },
    { id: "ms-4", title: "Meeting #08",        date: new Date("2026-09-14"), type: "MEETING",     description: "" },
  ];

  for (const ms of milestones) {
    await prisma.milestone.upsert({
      where: { id: ms.id },
      update: {},
      create: { ...ms, coupleId: couple.id },
    });
  }

  console.log("\n🎉 Seed complete! Multi-tenant spaces enabled.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
