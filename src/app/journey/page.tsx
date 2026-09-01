import { getSession } from "@/lib/session";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import JourneyView from "@/components/journey/JourneyView";
import SpaceHeader from "@/components/layout/SpaceHeader";

export default async function JourneyPage() {
  const session = await getSession();

  if (!session.couple) {
    return <OnboardingFlow />;
  }

  const couple = session.couple;
  const now = new Date();
  const nextMeeting = couple.meetings.find(
    (m: any) => new Date(m.scheduledAt) > now && m.status === "PLANNED"
  );

  const completedMeetings = couple.meetings.filter((m: any) => m.status === "COMPLETED");
  const uniquePlaces = new Set(completedMeetings.map((m: any) => m.locationName)).size;
  const completedKm = completedMeetings.reduce((acc: number, m: any) => acc + (m.distance ?? 0), 0);
  const plannedKm = couple.meetings
    .filter((m: any) => m.status === "PLANNED")
    .reduce((acc: number, m: any) => acc + (m.distance ?? 0), 0);

  const hasCompleted = completedMeetings.length > 0;
  const displayKmValue = hasCompleted ? completedKm : plannedKm;
  const kmLabel = hasCompleted ? "KM Crossed" : "Planned KM";

  const cityA = couple.userACity || (couple.members[0]?.user?.city ?? "");
  const cityB = couple.userBCity || (couple.members[1]?.user?.city ?? "");

  let headerApartKm = nextMeeting?.distance ?? 0;
  if (!nextMeeting && cityA && cityB) {
    const { getCityCoordinates, getDistanceKm } = await import("@/lib/geo");
    const coordsA = getCityCoordinates(cityA, 0);
    const coordsB = getCityCoordinates(cityB, 1);
    headerApartKm = getDistanceKm(coordsA, coordsB);
  }

  return (
    <div className="flex flex-col min-h-full">
      <SpaceHeader
        inviteCode={couple.inviteCode}
        isWaiting={couple.members.length < 2}
        currentUser={session.user}
      />

      {/* Header */}
      <header className="pt-8 pb-6 flex flex-col items-center justify-center border-b border-[var(--color-border)]/50">
        <h1 className="text-[10px] tracking-[0.4em] font-medium text-[var(--color-muted)] uppercase">
          Journey
        </h1>

        <div className="mt-8 flex flex-col items-center">
          <span className="text-3xl font-light text-[var(--color-foreground)] tracking-wide">
            {headerApartKm.toLocaleString("id-ID")} KM
          </span>
          <span className="text-[9px] tracking-[0.3em] text-[var(--color-muted)] mt-2 uppercase">
            Apart
          </span>
        </div>
      </header>

      {/* Journey Views */}
      <JourneyView
        meetings={couple.meetings}
        userACity={couple.userACity || (couple.members[0]?.user?.city ?? null)}
        userBCity={couple.userBCity || (couple.members[1]?.user?.city ?? null)}
      />

      {/* Summary Footer */}
      <div className="mt-auto px-8 py-6 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="flex flex-col items-center">
          <span className="text-lg font-light text-[var(--color-foreground)]">{completedMeetings.length}</span>
          <span className="text-[8px] tracking-[0.2em] text-[var(--color-muted)] uppercase mt-0.5">Meetings</span>
        </div>
        <div className="w-[1px] h-6 bg-[var(--color-border)]" />
        <div className="flex flex-col items-center">
          <span className="text-lg font-light text-[var(--color-foreground)]">{uniquePlaces}</span>
          <span className="text-[8px] tracking-[0.2em] text-[var(--color-muted)] uppercase mt-0.5">Places</span>
        </div>
        <div className="w-[1px] h-6 bg-[var(--color-border)]" />
        <div className="flex flex-col items-center">
          <span className="text-lg font-light text-[var(--color-foreground)]">{displayKmValue.toLocaleString("id-ID")}</span>
          <span className="text-[8px] tracking-[0.2em] text-[var(--color-brand)] uppercase mt-0.5 font-medium">{kmLabel}</span>
        </div>
      </div>
    </div>
  );
}
