"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronDown, ChevronUp } from "lucide-react";
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
}

export default function LdrGraduationSection(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

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
            <p className="text-[11px] font-semibold text-stone-800 tracking-wide">
              LDR Selesai? Klaim Kenang-kenanganmu
            </p>
            <p className="text-[9px] text-stone-400 mt-0.5 font-light">
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
    </div>
  );
}
