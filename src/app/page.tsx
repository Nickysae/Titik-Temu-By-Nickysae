import { getSession } from "@/lib/session";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import HeroCountdown from "@/components/home/HeroCountdown";
import DistancePreview from "@/components/home/DistancePreview";
import RinduJarPreview from "@/components/home/RinduJarPreview";
import DailyQuestionWidget from "@/components/home/DailyQuestionWidget";
import SpaceHeader from "@/components/layout/SpaceHeader";

export default async function Home() {
  const session = await getSession();

  // If user does not belong to any couple space yet, show onboarding
  if (!session.couple) {
    return <OnboardingFlow />;
  }

  const couple = session.couple;
  const now = new Date();
  const start = couple.relationshipStart ? new Date(couple.relationshipStart) : now;
  const daysTogether = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const nextMeeting = couple.meetings.find(
    (m: any) => new Date(m.scheduledAt) > now && m.status === "PLANNED"
  );

  const daysUntilMeet = nextMeeting
    ? Math.ceil(
        (new Date(nextMeeting.scheduledAt).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const activeJar = couple.rinduJars[0] ?? null;
  const rinduCount = activeJar?.rindus?.length ?? 0;
  const names = couple.members.map((m: any) => m.user.name);

  const me = session.user;
  const partnerMember = couple.members.find((m: any) => m.userId !== me?.id);
  const partnerUser = partnerMember ? partnerMember.user : null;
  const isWaitingPartner = couple.members.length < 2;

  const cityA = couple.userACity || me?.city || "";
  const cityB = couple.userBCity || partnerUser?.city || "";

  // If there's a planned meeting, use its distance. Otherwise, calculate distance between their 2 home cities!
  let displayDistance = nextMeeting?.distance ?? 0;
  if (!nextMeeting && cityA && cityB) {
    const { getCityCoordinates, getDistanceKm } = await import("@/lib/geo");
    const coordsA = getCityCoordinates(cityA, 0);
    const coordsB = getCityCoordinates(cityB, 1);
    displayDistance = getDistanceKm(coordsA, coordsB);
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Space Bar */}
      <SpaceHeader
        inviteCode={couple.inviteCode}
        isWaiting={isWaitingPartner}
        currentUser={me}
      />

      {/* Couple Names & Days Together Header */}
      <header className="pt-8 pb-6 flex flex-col items-center justify-center">
        <h1 className="text-[11px] tracking-[0.3em] font-medium text-[var(--color-foreground)] uppercase">
          {names[0] || "You"} <span className="mx-2 text-[var(--color-brand)] opacity-60">·</span> {names[1] || "Waiting..."}
        </h1>
        <div className="mt-6 flex flex-col items-center">
          <span className="text-2xl font-light text-[var(--color-foreground)] tracking-wide">
            {daysTogether} DAYS
          </span>
          <span className="text-[9px] tracking-[0.25em] text-[var(--color-muted)] mt-1.5 uppercase">
            together
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {daysUntilMeet !== null && nextMeeting ? (
          <HeroCountdown
            daysLeft={daysUntilMeet}
            dateStr={new Date(nextMeeting.scheduledAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            locationStr={nextMeeting.locationName}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 my-2 text-center px-8">
            <p className="text-[12px] text-[var(--color-muted)] italic font-light">
              {isWaitingPartner
                ? "Menunggu pasanganmu memasukkan kode undangan..."
                : "Belum ada rencana pertemuan berikutnya."}
            </p>
          </div>
        )}

        <DistancePreview
          distance={displayDistance}
          userACity={cityA || "Kota Kamu"}
          userBCity={cityB || "Kota Pasangan"}
          myCity={me?.city || ""}
          myName={me?.name || "Kamu"}
          partnerName={partnerUser?.name || "Pasangan"}
        />

        {/* Daily Check-in Question */}
        <DailyQuestionWidget />

        <RinduJarPreview count={rinduCount} />
      </div>
    </div>
  );
}
