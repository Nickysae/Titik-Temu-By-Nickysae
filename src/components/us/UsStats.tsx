"use client";
import { motion } from "framer-motion";

interface Props {
  daysTogether: number;
  meetings: number;
  places: number;
  kmCrossed: string;
  rinduSaved: number;
}

export default function UsStats({ daysTogether, meetings, places, kmCrossed, rinduSaved }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="w-full flex flex-col items-center pt-16 pb-12 mt-8 border-t border-[var(--color-border)]/50"
    >
      <h3 className="text-[10px] tracking-[0.3em] font-medium text-[var(--color-muted)] uppercase mb-10 text-center">
        Look how far we've come
      </h3>

      <div className="flex flex-col gap-8 w-full max-w-[240px]">
        <div className="flex justify-between items-end border-b border-[var(--color-border)]/50 pb-2">
          <span className="text-2xl font-light text-[var(--color-foreground)]">{daysTogether}</span>
          <span className="text-[9px] tracking-widest text-[var(--color-muted)] uppercase mb-1">Days Together</span>
        </div>

        <div className="flex justify-between items-end border-b border-[var(--color-border)]/50 pb-2">
          <span className="text-2xl font-light text-[var(--color-foreground)]">{meetings}</span>
          <span className="text-[9px] tracking-widest text-[var(--color-muted)] uppercase mb-1">Times We Met</span>
        </div>

        <div className="flex justify-between items-end border-b border-[var(--color-border)]/50 pb-2">
          <span className="text-2xl font-light text-[var(--color-foreground)]">{kmCrossed}</span>
          <span className="text-[9px] tracking-widest text-[var(--color-brand)] uppercase font-medium mb-1">KM Crossed</span>
        </div>

        <div className="flex justify-between items-end pb-2">
          <span className="text-2xl font-light text-[var(--color-foreground)]">{rinduSaved}</span>
          <span className="text-[9px] tracking-widest text-[var(--color-muted)] uppercase mb-1">Rindu Saved</span>
        </div>

        <div className="flex justify-between items-end pb-2">
          <span className="text-2xl font-light text-[var(--color-foreground)]">{places}</span>
          <span className="text-[9px] tracking-widest text-[var(--color-muted)] uppercase mb-1">Places Visited</span>
        </div>
      </div>

      <p className="text-[10px] text-[var(--color-muted)] italic font-light mt-12 text-center max-w-[200px]">
        Numbers are just another way of telling our story.
      </p>
    </motion.div>
  );
}
