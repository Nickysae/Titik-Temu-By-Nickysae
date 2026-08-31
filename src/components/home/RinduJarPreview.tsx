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
      <div className="text-4xl mb-6 opacity-90 drop-shadow-sm">🫙</div>
      
      <div className="flex flex-col items-center gap-1">
        <p className="text-3xl font-light text-[var(--color-foreground)]">{count}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-brand)] font-medium">Rindu</p>
      </div>

      <div className="mt-8 flex items-center gap-1.5 text-[var(--color-muted)]">
        <Lock size={12} strokeWidth={2} />
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Locked</span>
      </div>
    </motion.div>
  );
}
