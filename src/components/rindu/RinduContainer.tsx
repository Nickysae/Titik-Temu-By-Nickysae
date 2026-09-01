"use client";
import { useState } from "react";
import JarVisual from "@/components/rindu/JarVisual";
import AddRinduForm from "@/components/rindu/AddRinduForm";
import TwoHalvesModal from "@/components/rindu/TwoHalvesModal";
import UnlockedJarView, { RinduItem } from "@/components/rindu/UnlockedJarView";
import { Sparkles } from "lucide-react";

interface Props {
  total: number;
  userACount: number;
  userBCount: number;
  nameA: string;
  nameB: string;
  jarStatus: string;
  meetingDate: string;
  rindus: RinduItem[];
  latestRindu?: {
    authorName: string;
    createdAt: string;
    wordCount: number;
  } | null;
  spaceCode?: string;
  relationshipStart?: string | null;
  cities?: string;
  distanceKm?: number;
}

export default function RinduContainer({
  total,
  userACount,
  userBCount,
  nameA,
  nameB,
  jarStatus,
  meetingDate,
  rindus,
  latestRindu,
  spaceCode = "TEMU",
  relationshipStart,
  cities = "LDR Space",
  distanceKm = 450,
}: Props) {
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  if (jarStatus === "OPENED") {
    return <UnlockedJarView rindus={rindus} total={total} />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between px-6 pt-4 pb-8">
      <JarVisual
        count={total}
        userACount={userACount}
        userBCount={userBCount}
        nameA={nameA}
        nameB={nameB}
        meetingDate={meetingDate}
        latestRindu={latestRindu}
      />

      {/* Two Halves Verification Button for Demo/Real Meeting */}
      <div className="my-6 flex flex-col items-center gap-2">
        <button
          onClick={() => setIsVerifyOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-brand)] bg-[var(--color-surface)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-sm group"
        >
          <Sparkles size={13} />
          <span>Verify Meeting (Two Halves)</span>
        </button>
        <span className="text-[9px] text-[var(--color-muted)]">
          Tap when you are together to unlock this jar
        </span>
      </div>

      <div className="mt-auto w-full pt-4">
        <AddRinduForm />
      </div>

      <TwoHalvesModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        partnerName={nameB}
        spaceCode={spaceCode}
        relationshipStart={relationshipStart}
        cities={cities}
        distanceKm={distanceKm}
        coupleName={`${nameA} & ${nameB}`}
      />
    </div>
  );
}
