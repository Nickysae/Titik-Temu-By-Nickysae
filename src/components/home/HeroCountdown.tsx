"use client";
import { motion } from "framer-motion";

interface Props {
  daysLeft: number;
  dateStr: string;
  locationStr: string;
}

export default function HeroCountdown({ daysLeft, dateStr, locationStr }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-12 my-2"
    >
      <p className="text-[10px] tracking-[0.25em] text-[var(--color-muted)] uppercase mb-8">Until we meet again</p>
      
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[5.5rem] leading-none font-light text-[var(--color-foreground)] tracking-tighter">
          {daysLeft}
        </h1>
        <p className="text-[10px] tracking-[0.3em] text-[var(--color-brand)] mt-3 font-medium uppercase">Days</p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-1.5">
        <p className="text-[13px] font-medium tracking-wide text-[var(--color-foreground)]">{dateStr}</p>
        <p className="text-[11px] tracking-wide text-[var(--color-muted)]">{locationStr}</p>
      </div>

      <p className="mt-8 text-[13px] text-[var(--color-muted)] italic font-light">
        The distance is getting smaller.
      </p>
    </motion.div>
  );
}
