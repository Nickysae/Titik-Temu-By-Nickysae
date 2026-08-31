"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Heart, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export interface RinduItem {
  id: string;
  content: string;
  createdAt: Date | string;
  author: {
    name: string;
  };
}

interface Props {
  rindus: RinduItem[];
  total: number;
}

export default function UnlockedJarView({ rindus, total }: Props) {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const handleStartNewJar = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/jar/reset", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to reset");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-6 pb-12">
      {/* Header Unlocked Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 text-center shadow-sm mb-8"
      >
        <div className="text-4xl mb-3">✨ 🫙 ✨</div>
        <h2 className="text-xl font-light text-[var(--color-foreground)] tracking-wide">
          Rindu Jar Unlocked
        </h2>
        <p className="text-[11px] text-[var(--color-muted)] mt-1 tracking-wider uppercase">
          {total} secrets revealed from your days apart
        </p>
      </motion.div>

      {/* Rindu Messages Stream */}
      <div className="w-full flex flex-col gap-4">
        {rindus.map((rindu, idx) => (
          <motion.div
            key={rindu.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)]/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[var(--color-brand)] flex items-center gap-1">
                <Heart size={10} className="fill-[var(--color-brand)]" />
                {rindu.author.name}
              </span>
              <span className="text-[9px] text-[var(--color-muted)] flex items-center gap-1 font-light">
                <Calendar size={10} />
                {new Date(rindu.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <p className="text-[13px] leading-relaxed text-[var(--color-foreground)] font-light">
              "{rindu.content}"
            </p>
          </motion.div>
        ))}
      </div>

      {/* Action to Start New Jar */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <button
          onClick={handleStartNewJar}
          disabled={isResetting}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all shadow-md disabled:opacity-50"
        >
          <RefreshCw size={12} className={isResetting ? "animate-spin" : ""} />
          <span>{isResetting ? "Preparing new jar..." : "Start New Jar for Next Meeting"}</span>
        </button>
        <p className="text-[10px] text-[var(--color-muted)] italic">
          This jar's memories are safely stored in your history.
        </p>
      </div>
    </div>
  );
}
