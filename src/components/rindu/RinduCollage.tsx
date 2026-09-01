"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Sparkles, Heart, X, Check } from "lucide-react";
import { toPng } from "html-to-image";
import { RinduItem } from "./UnlockedJarView";

interface RinduCollageProps {
  rindus: RinduItem[];
  coupleTitle?: string;
  onClose: () => void;
}

export default function RinduCollage({
  rindus,
  coupleTitle = "Kisah Rindu Kita",
  onClose,
}: RinduCollageProps) {
  const collageRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDownload = async () => {
    if (!collageRef.current) return;
    setIsExporting(true);
    try {
      // Allow slight wait for full DOM render
      await new Promise((r) => setTimeout(r, 100));
      const dataUrl = await toPng(collageRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High-res for Instagram Story / Social feed
        backgroundColor: "#0d0f12",
      });

      const link = document.createElement("a");
      link.download = `kolase-rindu-titiktemu-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengekspor kolase:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!collageRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(collageRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0d0f12",
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error("Gagal menyalin gambar:", err);
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#14171d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#191d24]">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#e2b77a]" />
            <h3 className="text-sm font-medium tracking-wider uppercase text-white">
              Kolase Kenangan Rindu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-black/30">
          {/* THE CAPTURE ELEMENT (Canvas for HTML-to-Image) */}
          <div
            ref={collageRef}
            className="w-full max-w-[400px] bg-gradient-to-b from-[#181a20] via-[#121418] to-[#0c0d10] p-6 rounded-2xl border border-white/15 shadow-2xl relative overflow-hidden text-stone-200"
          >
            {/* Background glowing aura */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#e2b77a]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#d9534f]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Collage Brand Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.25em] text-[#e2b77a] mb-2 font-medium">
                <Heart size={10} className="fill-[#e2b77a]" />
                Titik Temu • Rindu Terbalas
              </div>
              <h2 className="text-lg font-serif font-light text-white tracking-wide">
                {coupleTitle}
              </h2>
              <p className="text-[10px] text-white/50 tracking-widest uppercase mt-1">
                {rindus.length} Surat Cinta & Rindu Tersimpan
              </p>
            </div>

            {/* Photos & Notes Grid */}
            <div className="grid grid-cols-2 gap-3 relative z-10 mb-6">
              {rindus.slice(0, 6).map((r, i) => (
                <div
                  key={r.id || i}
                  className={`flex flex-col bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm ${
                    !r.photoUrl && rindus.length === 1 ? "col-span-2" : ""
                  }`}
                >
                  {r.photoUrl ? (
                    <div className="relative aspect-square w-full bg-black/40 overflow-hidden group">
                      <img
                        src={r.photoUrl}
                        alt="Kenangan"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-1.5 left-2 right-2 text-[9px] text-white/90 font-light truncate">
                        {r.author?.name || "Pasangan"}
                      </div>
                    </div>
                  ) : null}

                  <div className="p-2.5 flex flex-col justify-between flex-1">
                    <p
                      className={`text-white/90 leading-snug font-light italic ${
                        r.photoUrl
                          ? "text-[10px] line-clamp-2"
                          : "text-[11px] line-clamp-4"
                      }`}
                    >
                      "{r.content}"
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[8px] text-white/40">
                      <span>{r.author?.name}</span>
                      <span>
                        {new Date(r.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer stamp */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[9px] text-white/40 font-mono tracking-wider relative z-10">
              <span>titiktemu.app</span>
              <span>TERKUNCI & TERBUKA BERSAMA</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:px-6 border-t border-white/10 bg-[#191d24] flex items-center justify-between gap-3">
          <button
            onClick={handleCopyImage}
            disabled={isExporting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCopied ? (
              <>
                <Check size={14} className="text-green-400" />
                <span className="text-green-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Salin Gambar</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#e2b77a] hover:bg-[#cfa569] text-stone-950 text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#e2b77a]/20 disabled:opacity-50"
          >
            <Download size={14} />
            <span>{isExporting ? "Menyiapkan..." : "Unduh Kolase PNG"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
