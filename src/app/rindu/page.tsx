import { getSession } from "@/lib/session";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import RinduContainer from "@/components/rindu/RinduContainer";
import SpaceHeader from "@/components/layout/SpaceHeader";

export default async function RinduPage() {
  const session = await getSession();

  if (!session.couple) {
    return <OnboardingFlow />;
  }

  const couple = session.couple;
  const jar = couple.rinduJars[0] ?? null;
  const rindus = jar?.rindus ?? [];
  const nextMeeting = couple.meetings.find(
    (m: any) => new Date(m.scheduledAt) > new Date() && m.status === "PLANNED"
  );

  const countByUser: Record<string, { name: string; count: number }> = {};
  for (const m of couple.members) {
    countByUser[m.userId] = { name: m.user.name, count: 0 };
  }
  for (const r of rindus) {
    if (countByUser[r.authorId]) {
      countByUser[r.authorId].count++;
    }
  }

  const [userA, userB] = Object.values(countByUser);

  // Find latest rindu for the mystery teaser
  const sortedRindus = [...rindus].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latest = sortedRindus[0] ?? null;
  const latestAuthor = latest ? couple.members.find((m: any) => m.userId === latest.authorId)?.user.name || "Pasanganmu" : null;
  const latestRinduTeaser = latest
    ? {
        authorName: latestAuthor || "Pasanganmu",
        createdAt: latest.createdAt.toISOString(),
        wordCount: latest.content.trim().split(/\s+/).length,
      }
    : null;

  const meetingDateStr = nextMeeting
    ? new Date(nextMeeting.scheduledAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No Upcoming Meeting";

  return (
    <div className="flex flex-col min-h-full">
      <SpaceHeader
        inviteCode={couple.inviteCode}
        isWaiting={couple.members.length < 2}
        currentUser={session.user}
      />

      <header className="pt-8 pb-4 flex flex-col items-center justify-center">
        <h1 className="text-[10px] tracking-[0.4em] font-medium text-[var(--color-muted)] uppercase">
          Rindu Jar
        </h1>
      </header>

      <RinduContainer
        total={rindus.length}
        userACount={userA?.count ?? 0}
        userBCount={userB?.count ?? 0}
        nameA={userA?.name ?? "You"}
        nameB={userB?.name ?? (couple.members.length < 2 ? "Waiting..." : "Partner")}
        jarStatus={jar?.status ?? "LOCKED"}
        meetingDate={meetingDateStr}
        rindus={jar?.status === "OPENED" ? rindus : []}
        latestRindu={latestRinduTeaser}
      />
    </div>
  );
}
