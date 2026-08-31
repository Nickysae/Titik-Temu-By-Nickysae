"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronDown, ChevronUp, Lock, ShieldCheck, CalendarClock } from "lucide-react";
import LdrGraduationCard from "@/components/us/LdrGraduationCard";

interface Props {
  nameA: string;
  nameB: string;
  daysTogether: number;
  startDateStr: string;
  endDateStr: string;
  meetingsDone: number;
  uniquePlaces: number;
  totalKm: number;
  totalRindu: number;
  userACity: string;
  userBCity: string;
  coupleCreatedAt: string; // ISO string — when couple space was first created
}

const MINIMUM_DAYS = 30;

export default function LdrGraduationSection(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // --- Eligibility Gate ---
  const daysSinceJoined = Math.floor(
    (Date.now() - new Date(props.coupleCreatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, MINIMUM_DAYS - daysSinceJoined);
  const isEligible = daysSinceJoined >= MINIMUM_DAYS;
  const progressPercent = Math.min(100, Math.round((daysSinceJoined / MINIMUM_DAYS) * 100));

  const unlockDate = new Date(props.coupleCreatedAt);
  unlockDate.setDate(unlockDate.getDate() + MINIMUM_DAYS);
  const unlockDateStr = unlockDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mt-10 mx-4">
      {/* Separator */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--color-muted)] font-medium">
          Kenang-kenangan
        </span>
        <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
      </div>

      {/* ── LOCKED STATE (< 30 days) ── */}
      {!isEligible && (
        <div className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-400 flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-stone-600 tracking-wide">
                LDR Selesai? Klaim Kenang-kenanganmu
              </p>
              <p className="text-[9px] text-stone-400 mt-0.5">
                Masih terkunci — verifikasi LDR minimal 30 hari
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-2">
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-rose-300 to-amber-300"
              />
            </div>
            <div className="flex items-center justify-between text-[9px] text-stone-400 font-mono">
              <span>Hari ke-{daysSinceJoined}</span>
              <span className="font-semibold text-stone-500">{progressPercent}% terverifikasi</span>
              <span>Hari ke-{MINIMUM_DAYS}</span>
            </div>
          </div>

          {/* Unlock Info */}
          <div className="flex items-start gap-2 bg-white border border-stone-100 rounded-xl p-3">
            <CalendarClock size={14} className="text-rose-400 mt-0.5 shrink-0" />
            <div className="text-[10px] text-stone-500 leading-relaxed">
              {daysRemaining > 0 ? (
                <>
                  Kartu kenang-kenangan akan terbuka dalam{" "}
                  <strong className="text-stone-700">{daysRemaining} hari lagi</strong>,
                  yaitu pada{" "}
                  <strong className="text-rose-500">{unlockDateStr}</strong>.
                  <br />
                  <span className="text-stone-400 font-light">
                    Terus jalani LDR kalian — setiap hari yang berlalu adalah bukti perjuangan cinta.
                  </span>
                </>
              ) : (
                "Syarat terpenuhi hari ini!"
              )}
            </div>
          </div>

          {/* Why this requirement */}
          <div className="flex items-start gap-2">
            <ShieldCheck size={12} className="text-stone-300 mt-0.5 shrink-0" />
            <p className="text-[9px] text-stone-300 font-light leading-relaxed italic">
              Kami memverifikasi perjalanan LDR minimal 30 hari agar kenang-kenangan ini benar-benar bermakna — bukan sekadar kartu kosong.
            </p>
          </div>
        </div>
      )}

      {/* ── UNLOCKED STATE (≥ 30 days) ── */}
      {isEligible && (
        <>
          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 hover:border-rose-200 transition-all group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                <Award size={18} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[11px] font-semibold text-stone-800 tracking-wide">
                    LDR Selesai? Klaim Kenang-kenanganmu
                  </p>
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-semibold uppercase tracking-wide">
                    Terbuka
                  </span>
                </div>
                <p className="text-[9px] text-stone-400 font-light">
                  Cetak kartu perjalanan LDR kalian — seperti Strava, tapi lebih romantis 💍
                </p>
              </div>
            </div>
            <div className="text-stone-400 group-hover:text-rose-400 transition-colors shrink-0 ml-2">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {/* Expandable Card */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <LdrGraduationCard {...props} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
