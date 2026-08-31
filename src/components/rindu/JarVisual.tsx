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
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center pt-8 pb-12 w-full"
    >
      <div className="text-[5rem] mb-8 opacity-90 drop-shadow-sm">🫙</div>
      
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-4xl font-light text-[var(--color-foreground)] tracking-wide">{count}</h2>
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-brand)] font-medium">Rindu</p>
      </div>

      {/* Breakdown */}
      <div className="mt-8 flex items-center justify-center gap-8 w-full max-w-[200px] border-t border-[var(--color-border)] pt-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-light text-[var(--color-foreground)]">{userACount}</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">{nameA}</span>
        </div>
        <div className="w-[1px] h-8 bg-[var(--color-border)]"></div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-lg font-light text-[var(--color-foreground)]">{userBCount}</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">{nameB}</span>
        </div>
      </div>

      {/* Lock Status */}
      <div className="mt-12 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex items-center justify-center mb-4 text-[var(--color-muted)]">
          <Lock size={16} strokeWidth={1.5} />
        </div>
        <p className="text-[12px] font-medium tracking-wide text-[var(--color-foreground)] text-center">
          Your rindu is waiting<br />for your next meeting.
        </p>
        <p className="text-[11px] tracking-widest text-[var(--color-muted)] mt-4 uppercase">
          {meetingDate}
        </p>
      </div>
    </motion.div>
  );
}
