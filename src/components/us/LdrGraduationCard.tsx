"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Heart, MapPin, Mail, Calendar, Milestone, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface Props {
  nameA: string;
  nameB: string;
  daysTogether: number;
  startDateStr: string;
  endDateStr: string;
  meetingsDone: number;
  uniquePlaces: number;
  totalKm: number;
  totalRindu: number;
  userACity: string;
  userBCity: string;
}

// Generates a contextual romantic closing sentence based on their LDR data
function generateRomanticNarrative(
  nameA: string,
  nameB: string,
  daysTogether: number,
  totalKm: number,
  totalRindu: number,
  meetingsDone: number
): string {
  if (daysTogether >= 365 * 3 && totalKm >= 5000) {
    return `Setelah ${daysTogether} hari bertahan, ${totalKm.toLocaleString("id-ID")} km jarak tak pernah berhasil memisahkan hati kalian. Ini bukan akhir — ini adalah awal dari selamanya.`;
  }
  if (totalRindu >= 50) {
    return `${totalRindu} surat rindu, ${meetingsDone} pertemuan yang selalu terasa terlalu singkat, dan ${daysTogether} hari yang membuktikan bahwa cinta sejati tidak mengenal jarak.`;
  }
  if (meetingsDone >= 10) {
    return `Setiap dari ${meetingsDone} pertemuan itu adalah hadiah. Setiap perpisahan adalah janji untuk kembali. Dan hari ini, janji itu menjadi selamanya.`;
  }
  if (totalKm >= 1000) {
    return `${totalKm.toLocaleString("id-ID")} km di antara kalian bukan hambatan — itu adalah bukti seberapa jauh kalian rela menempuh demi satu sama lain.`;
  }
  return `${daysTogether} hari yang mengajarkan bahwa rindu adalah cara cinta bertahan dari jarak. Dan hari ini, jarak itu resmi tamat.`;
}

export default function LdrGraduationCard({
  nameA,
  nameB,
  daysTogether,
  startDateStr,
  endDateStr,
  meetingsDone,
  uniquePlaces,
  totalKm,
  totalRindu,
  userACity,
  userBCity,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const narrative = generateRomanticNarrative(nameA, nameB, daysTogether, totalKm, totalRindu, meetingsDone);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#fffbf5",
      });
      const link = document.createElement("a");
      link.download = `titik-temu-ldr-selesai-${nameA}-${nameB}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, backgroundColor: "#fffbf5" });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "titik-temu-ldr-selesai.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${nameA} & ${nameB} — LDR Selesai`,
          text: "Kami berhasil melewati jarak. 💍",
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center w-full"
    >
      {/* ─── THE CARD ITSELF (this gets exported) ─── */}
      <div
        ref={cardRef}
        className="w-full max-w-sm bg-[#fffbf5] rounded-none p-8 flex flex-col gap-6 font-sans"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        {/* Top label */}
        <div className="flex items-center justify-between text-[9px] tracking-[0.3em] text-stone-400 uppercase font-medium">
          <span>Titik Temu</span>
          <span>LDR Selesai 💍</span>
        </div>

        {/* Names */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-2xl font-light tracking-wide text-stone-900">
            {nameA}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-[1px] bg-stone-200" />
            <Heart size={12} className="text-rose-400 fill-rose-400" />
            <div className="flex-1 h-[1px] bg-stone-200" />
          </div>
          <h2 className="text-2xl font-light tracking-wide text-stone-900">
            {nameB}
          </h2>
        </div>

        {/* LDR Route (Cities) */}
        <div className="flex items-center gap-2 text-[10px] text-stone-400 tracking-wider">
          <MapPin size={10} className="text-stone-400 shrink-0" />
          <span>{userACity}</span>
          <span className="text-stone-300">→</span>
          <span>{userBCity}</span>
        </div>

        {/* Stats Row 1 — Main Hero Stat */}
        <div className="flex flex-col">
          <span className="text-5xl font-extralight text-stone-900 tracking-tight leading-none">
            {daysTogether}
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 mt-1.5 font-medium">
            Hari Bertahan
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 border-t border-b border-stone-100 py-5">
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-light text-stone-800">{totalKm.toLocaleString("id-ID")}</span>
            <span className="text-[8px] uppercase tracking-wider text-stone-400">KM Terlalui</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-light text-stone-800">{meetingsDone}</span>
            <span className="text-[8px] uppercase tracking-wider text-stone-400">Pertemuan</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-light text-stone-800">{totalRindu}</span>
            <span className="text-[8px] uppercase tracking-wider text-stone-400">Surat Rindu</span>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-[9px] text-stone-400 tracking-wider">
          <Calendar size={9} className="shrink-0" />
          <span>{startDateStr} — {endDateStr}</span>
        </div>

        {/* Romantic Narrative */}
        <p className="text-[11px] text-stone-500 leading-relaxed font-light italic border-l-2 border-rose-200 pl-3">
          "{narrative}"
        </p>

        {/* Bottom watermark */}
        <div className="flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.3em] text-stone-300 font-medium">
            titik-temu.vercel.app
          </span>
          <div className="flex items-center gap-1 text-[8px] text-stone-300">
            <Heart size={8} className="fill-rose-200 text-rose-200" />
            <span>We made it.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-sm px-2">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-2.5 rounded-full bg-stone-900 text-white text-[10px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 hover:bg-stone-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isDownloading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Download size={12} />
          )}
          <span>Unduh HD</span>
        </button>
        <button
          onClick={handleShare}
          className="py-2.5 px-4 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] text-[10px] tracking-wider uppercase font-medium flex items-center gap-1.5 hover:bg-rose-50 transition-colors"
        >
          <Share2 size={12} />
          <span>Bagikan</span>
        </button>
      </div>

      <p className="text-[9px] text-[var(--color-muted)] italic mt-2 text-center">
        Tersimpan dalam resolusi HD, siap diposting di semua media sosial 📸
      </p>
    </motion.div>
  );
}
