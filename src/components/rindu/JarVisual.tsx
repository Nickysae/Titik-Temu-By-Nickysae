"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, Clock, Heart, Volume2, ShieldCheck } from "lucide-react";

interface Props {
  count: number;
  userACount: number;
  userBCount: number;
  nameA: string;
  nameB: string;
  meetingDate: string;
  latestRindu?: {
    authorName: string;
    createdAt: string;
    wordCount: number;
  } | null;
}

export default function JarVisual({
  count,
  userACount,
  userBCount,
  nameA,
  nameB,
  meetingDate,
  latestRindu,
}: Props) {
  const [isSealing, setIsSealing] = useState(false);

  // Play a soft aesthetic wax seal stamp sound via Web Audio API (No external assets required!)
  const playStampSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      // Deep resonant stamp thump
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);

      // Trigger visual stamp bounce
      setIsSealing(true);
      setTimeout(() => setIsSealing(false), 600);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center pt-6 pb-6 w-full"
    >
      {/* Large Sealed Envelope Vector Illustration with Interactive Stamp */}
      <div
        onClick={playStampSound}
        className="relative mb-6 flex items-center justify-center cursor-pointer group select-none"
        title="Ketuk untuk merasakan segel lilin"
      >
        <motion.div
          animate={isSealing ? { scale: [1, 1.06, 0.96, 1], rotate: [0, -2, 2, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <svg viewBox="0 0 120 84" className="w-36 h-28 overflow-visible drop-shadow-lg">
            {/* Envelope Body Base */}
            <rect
              x="8"
              y="12"
              width="104"
              height="68"
              rx="8"
              fill="var(--color-surface)"
              stroke="var(--color-border)"
              strokeWidth="1.5"
            />

            {/* Bottom & Side Fold Lines */}
            <path
              d="M 8 80 L 52 46 L 8 12"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1.2"
            />
            <path
              d="M 112 80 L 68 46 L 112 12"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1.2"
            />
            <path
              d="M 8 80 L 60 46 L 112 80"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1.2"
            />

            {/* Closed Top Flap */}
            <path
              d="M 8 12 L 60 50 L 112 12 Z"
              fill="var(--color-background)"
              stroke="var(--color-border)"
              strokeWidth="1.5"
            />

            {/* Multi-layered Wax Seal Stamp (Segel Lilin Tebal Bertingkat) */}
            {/* Outer wax pool */}
            <circle
              cx="60"
              cy="50"
              r="14"
              fill="#b38a63"
              opacity="0.3"
              className="group-hover:scale-105 transition-transform"
            />
            {/* Main Wax Seal */}
            <circle
              cx="60"
              cy="50"
              r="12.5"
              fill="#c9a27e"
              stroke="#a67c52"
              strokeWidth="1.5"
              className="drop-shadow-md group-hover:fill-[#b8916d] transition-colors"
            />
            <circle
              cx="60"
              cy="50"
              r="9.5"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Lock Icon embedded in Wax Seal */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white">
          <Lock size={12} strokeWidth={2.5} />
        </div>

        {/* Floating sound prompt badge */}
        <div className="absolute -bottom-1 bg-stone-900/80 text-stone-300 text-[8px] px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Volume2 size={9} />
          <span>Ketuk segel</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-4xl font-light text-[var(--color-foreground)] tracking-wide">{count}</h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-brand)] font-semibold">
          Surat Rindu Tersegel
        </p>
      </div>

      {/* 💌 Teaser / Blur Peek: "Nara menyegel pesan rahasia semalam pukul 23:45" */}
      {latestRindu && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[280px] mt-5 p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs relative overflow-hidden flex flex-col gap-1.5 text-center"
        >
          <div className="flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider text-[var(--color-brand)] font-semibold">
            <Sparkles size={10} />
            <span>Pesan Terakhir Masuk</span>
          </div>

          <p className="text-[11px] text-[var(--color-foreground)] leading-relaxed">
            <strong className="font-medium">{latestRindu.authorName}</strong> menyegel pesan rahasia ({latestRindu.wordCount} kata)
          </p>

          <span className="text-[9px] text-[var(--color-muted)] flex items-center justify-center gap-1 font-mono">
            <Clock size={10} />
            {new Date(latestRindu.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </motion.div>
      )}

      {/* Breakdown per user */}
      <div className="mt-6 flex items-center justify-center gap-8 w-full max-w-[220px] border-t border-[var(--color-border)] pt-5">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-lg font-light text-[var(--color-foreground)]">{userACount}</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">{nameA}</span>
        </div>
        <div className="w-[1px] h-7 bg-[var(--color-border)]" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-lg font-light text-[var(--color-foreground)]">{userBCount}</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">{nameB}</span>
        </div>
      </div>

      {/* Sealed Status Explanation */}
      <div className="mt-6 flex flex-col items-center">
        <p className="text-[11px] font-medium tracking-wide text-[var(--color-foreground)] text-center leading-relaxed">
          Surat-surat rindu ini terjaga aman di dalam segel,<br />hanya bisa dibuka saat bertemu langsung.
        </p>
        <p className="text-[9px] tracking-widest text-[var(--color-muted)] mt-2 uppercase">
          Titik Temu: {meetingDate}
        </p>
      </div>
    </motion.div>
  );
}
