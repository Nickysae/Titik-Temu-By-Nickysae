"use client";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface Props {
  count: number;
  userACount: number;
  userBCount: number;
  nameA: string;
  nameB: string;
  meetingDate: string;
}

export default function JarVisual({ count, userACount, userBCount, nameA, nameB, meetingDate }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center pt-8 pb-8 w-full"
    >
      {/* Large Sealed Envelope Vector Illustration */}
      <div className="relative mb-8 flex items-center justify-center">
        <svg viewBox="0 0 120 84" className="w-32 h-24 overflow-visible drop-shadow-md">
          {/* Envelope Body Base */}
          <rect 
            x="8" 
            y="12" 
            width="104" 
            height="68" 
            rx="6" 
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

          {/* Closed Top Flap (folded down over the envelope) */}
          <path 
            d="M 8 12 L 60 50 L 112 12 Z" 
            fill="var(--color-background)" 
            stroke="var(--color-border)" 
            strokeWidth="1.5" 
          />

          {/* Wax Seal Stamp (Segel Lilin Emas/Terracotta) */}
          <circle 
            cx="60" 
            cy="50" 
            r="12" 
            fill="#c9a27e" 
            stroke="#a67c52" 
            strokeWidth="1.5" 
            className="drop-shadow-md" 
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

        {/* Lock Icon embedded in Wax Seal */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white">
          <Lock size={12} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1.5">
        <h2 className="text-4xl font-light text-[var(--color-foreground)] tracking-wide">{count}</h2>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-brand)] font-medium">Surat Rindu</p>
      </div>

      {/* Breakdown per user */}
      <div className="mt-8 flex items-center justify-center gap-8 w-full max-w-[220px] border-t border-[var(--color-border)] pt-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-light text-[var(--color-foreground)]">{userACount}</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">{nameA}</span>
        </div>
        <div className="w-[1px] h-8 bg-[var(--color-border)]" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-light text-[var(--color-foreground)]">{userBCount}</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">{nameB}</span>
        </div>
      </div>

      {/* Sealed Status Explanation */}
      <div className="mt-8 flex flex-col items-center">
        <p className="text-[12px] font-medium tracking-wide text-[var(--color-foreground)] text-center leading-relaxed">
          Surat-surat rindu ini tersegel rapi,<br />menunggu hari pertemuan kalian.
        </p>
        <p className="text-[10px] tracking-widest text-[var(--color-muted)] mt-3 uppercase">
          {meetingDate}
        </p>
      </div>
    </motion.div>
  );
}
