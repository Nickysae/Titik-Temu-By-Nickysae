import { getSession } from "@/lib/session";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import StoryTimeline from "@/components/us/StoryTimeline";
import UsStats from "@/components/us/UsStats";
import AddMomentButton from "@/components/us/AddMomentButton";
import SpaceHeader from "@/components/layout/SpaceHeader";

export default async function UsPage() {
  const session = await getSession();

  if (!session.couple) {
    return <OnboardingFlow />;
  }

  const couple = session.couple;
  const now = new Date();
  const start = couple.relationshipStart ? new Date(couple.relationshipStart) : now;
  const daysTogether = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalRindu = couple.rinduJars.reduce((acc: number, j: any) => acc + j.rindus.length, 0);
  const meetingsDone = couple.meetings.filter((m: any) => m.status === "COMPLETED").length;
  const uniquePlaces = new Set(couple.meetings.map((m: any) => m.locationName)).size;
  const totalKm = couple.meetings.reduce((acc: number, m: any) => acc + (m.distance ?? 0), 0);

  const names = couple.members.map((m: any) => m.user.name);

  const startDateStr = start.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col min-h-full">
      <SpaceHeader inviteCode={couple.inviteCode} isWaiting={couple.members.length < 2} />

      {/* Header */}
      <header className="pt-8 pb-8 flex flex-col items-center justify-center">
        <h1 className="text-[11px] tracking-[0.3em] font-medium text-[var(--color-foreground)] uppercase">
          {names[0] || "You"} <span className="mx-2 text-[var(--color-brand)] opacity-60">·</span> {names[1] || "Waiting..."}
        </h1>

        <div className="mt-8 flex flex-col items-center">
          <span className="text-2xl font-light text-[var(--color-foreground)] tracking-wide">
            {daysTogether} DAYS
          </span>
          <span className="text-[9px] tracking-[0.2em] text-[var(--color-muted)] mt-1.5 uppercase">
            Since {startDateStr}
          </span>
        </div>

        <p className="mt-8 text-[12px] text-[var(--color-brand)] italic font-light">
          "Still choosing each other."
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[var(--color-surface)] border-t border-[var(--color-border)] rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.01)] pt-8 pb-12 mt-4">
        <h2 className="text-[10px] tracking-[0.4em] font-medium text-[var(--color-muted)] uppercase text-center mb-4">
          Our Story
        </h2>

        <StoryTimeline milestones={couple.milestones} />

        <AddMomentButton />

        <UsStats
          daysTogether={daysTogether}
          meetings={meetingsDone}
          places={uniquePlaces}
          kmCrossed={totalKm.toLocaleString("id-ID")}
          rinduSaved={totalRindu}
        />
      </div>
    </div>
  );
}
