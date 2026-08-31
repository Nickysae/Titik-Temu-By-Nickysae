"use client";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function RinduJarPreview({ count }: { count: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 pb-16"
    >
      {/* Aesthetic Sealed Envelope Vector Art */}
      <div className="relative mb-6 flex items-center justify-center">
        <svg viewBox="0 0 100 70" className="w-24 h-18 overflow-visible drop-shadow-sm">
          {/* Envelope Body Base */}
          <rect 
            x="8" 
            y="12" 
            width="84" 
            height="54" 
            rx="5" 
            fill="var(--color-surface)" 
            stroke="var(--color-border)" 
            strokeWidth="1.5" 
          />
          
          {/* Bottom & Side Fold Lines */}
          <path 
            d="M 8 66 L 44 38 L 8 12" 
            fill="none" 
            stroke="var(--color-border)" 
            strokeWidth="1.2" 
          />
          <path 
            d="M 92 66 L 56 38 L 92 12" 
            fill="none" 
            stroke="var(--color-border)" 
            strokeWidth="1.2" 
          />
          <path 
            d="M 8 66 L 50 38 L 92 66" 
            fill="none" 
            stroke="var(--color-border)" 
            strokeWidth="1.2" 
          />

          {/* Closed Top Flap (folded down over the envelope) */}
          <path 
            d="M 8 12 L 50 42 L 92 12 Z" 
            fill="var(--color-background)" 
            stroke="var(--color-border)" 
            strokeWidth="1.5" 
          />

          {/* Wax Seal Stamp (Segel Lilin) */}
          <circle 
            cx="50" 
            cy="42" 
            r="8.5" 
            fill="#c9a27e" 
            stroke="#a67c52" 
            strokeWidth="1" 
            className="drop-shadow-sm" 
          />
          <circle 
            cx="50" 
            cy="42" 
            r="6.5" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="0.8" 
            opacity="0.6" 
          />
        </svg>

        {/* Lock Icon embedded in Wax Seal */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white">
          <Lock size={9} strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1 mt-1">
        <p className="text-3xl font-light text-[var(--color-foreground)]">{count}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-brand)] font-medium">Rindu</p>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-[var(--color-muted)]">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Tersegel</span>
      </div>
    </motion.div>
  );
}
