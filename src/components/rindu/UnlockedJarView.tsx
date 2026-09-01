"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Heart, Calendar, Sparkles, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import RinduCollage from "./RinduCollage";

export interface RinduItem {
  id: string;
  content: string;
  photoUrl?: string | null;
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
  const [isCollageOpen, setIsCollageOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
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
      {/* Header Unlocked Banner with Open Envelope Illustration */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 text-center shadow-sm mb-6 flex flex-col items-center"
      >
        {/* Open Envelope Vector Art */}
        <div className="mb-4">
          <svg viewBox="0 0 100 80" className="w-20 h-16 overflow-visible drop-shadow-sm">
            <rect x="10" y="25" width="80" height="50" rx="4" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
            
            {/* Letter Paper with warm glow */}
            <motion.g
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <rect x="18" y="8" width="64" height="44" rx="3" fill="#ffffff" stroke="var(--color-border)" strokeWidth="1" />
              <line x1="26" y1="18" x2="52" y2="18" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="26" y1="26" x2="68" y2="26" stroke="var(--color-border)" strokeWidth="1" strokeLinecap="round" />
              <line x1="26" y1="33" x2="58" y2="33" stroke="var(--color-border)" strokeWidth="1" strokeLinecap="round" />
            </motion.g>

            {/* Open Top Flap (pointing upward) */}
            <path d="M 10 25 L 50 6 L 90 25" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />

            {/* Front Envelope folds */}
            <path d="M 10 75 L 50 48 L 90 75" fill="var(--color-background)" stroke="var(--color-border)" strokeWidth="1.5" />
            <path d="M 10 25 L 45 52 L 10 75" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
            <path d="M 90 25 L 55 52 L 90 75" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
          </svg>
        </div>

        <h2 className="text-xl font-light text-[var(--color-foreground)] tracking-wide">
          Segel Surat Terbuka
        </h2>
        <p className="text-[11px] text-[var(--color-muted)] mt-1 tracking-wider uppercase">
          {total} surat rindu kini telah sampai dan terbaca
        </p>

        {/* Collage generator CTA button */}
        {rindus.length > 0 && (
          <button
            onClick={() => setIsCollageOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e2b77a]/20 to-[#d9534f]/20 border border-[var(--color-brand)]/40 text-[var(--color-foreground)] hover:border-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all shadow-sm group hover:scale-[1.02]"
          >
            <Sparkles size={13} className="text-[var(--color-brand)] group-hover:rotate-12 transition-transform" />
            <span>Buat & Unduh Kolase Kenangan</span>
          </button>
        )}
      </motion.div>

      {/* Rindu Messages Cards (Styled like Parchment Letters) */}
      <div className="w-full flex flex-col gap-4">
        {rindus.map((rindu, idx) => (
          <motion.div
            key={rindu.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
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

            {/* Photo Attachment if available */}
            {rindu.photoUrl && (
              <div 
                className="w-full h-48 rounded-xl overflow-hidden border border-[var(--color-border)] cursor-pointer group relative bg-black/20"
                onClick={() => setSelectedPhoto(rindu.photoUrl!)}
              >
                <img
                  src={rindu.photoUrl}
                  alt="Foto Rindu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-white bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                    <ImageIcon size={10} /> Lihat Foto
                  </span>
                </div>
              </div>
            )}

            <p className="text-[13px] leading-relaxed text-[var(--color-foreground)] font-light italic">
              "{rindu.content}"
            </p>
          </motion.div>
        ))}
      </div>

      {/* Action to Start New Jar / New Sealed Envelope */}
      <div className="mt-12 flex flex-col items-center gap-3">
        <button
          onClick={handleStartNewJar}
          disabled={isResetting}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all shadow-md disabled:opacity-50"
        >
          <RefreshCw size={12} className={isResetting ? "animate-spin" : ""} />
          <span>{isResetting ? "Menyegel surat baru..." : "Segel Surat Baru untuk Pertemuan Berikutnya"}</span>
        </button>
        <p className="text-[10px] text-[var(--color-muted)] italic text-center">
          Surat-surat lama akan tersimpan abadi di riwayat cerita kalian.
        </p>
      </div>

      {/* Collage Modal */}
      {isCollageOpen && (
        <RinduCollage
          rindus={rindus}
          onClose={() => setIsCollageOpen(false)}
        />
      )}

      {/* Single Photo Zoom Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedPhoto}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

