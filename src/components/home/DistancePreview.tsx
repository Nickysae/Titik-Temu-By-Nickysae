"use client";
import { motion } from "framer-motion";

export default function DistancePreview({ distance }: { distance: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 1 }}
      className="flex flex-col items-center justify-center py-12 border-t border-b border-[var(--color-border)]/50 mx-10"
    >
      <h2 className="text-2xl font-light text-[var(--color-foreground)] tracking-wide">
        {distance} KM
      </h2>
      <p className="text-[10px] text-[var(--color-muted)] tracking-widest mt-1.5 mb-8 uppercase">
        between you two
      </p>

      <div className="w-full flex items-center justify-between relative max-w-[200px]">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-foreground)] z-10" />
        <div className="absolute left-0 right-0 h-[1px] bg-[var(--color-border)]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-foreground)] z-10" />
      </div>

      <div className="w-full flex items-center justify-between mt-3 px-2 max-w-[220px]">
        <p className="text-[10px] text-[var(--color-muted)] tracking-wider">Lamongan</p>
        <p className="text-[10px] text-[var(--color-muted)] tracking-wider">Surabaya</p>
      </div>
    </motion.div>
  );
}
