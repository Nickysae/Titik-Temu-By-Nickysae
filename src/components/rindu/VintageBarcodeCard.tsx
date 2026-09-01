"use client";
import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  coupleName: string;
  relationshipStart?: string | null;
  spaceCode: string;
  distanceKm?: number;
  cities?: string;
  onRefresh?: () => void;
}

export default function VintageBarcodeCard({
  coupleName,
  relationshipStart,
  spaceCode,
  distanceKm = 450,
  cities = "LDR Space",
  onRefresh,
}: Props) {
  const [styleMode, setStyleMode] = useState<"tag-classic" | "tag-duo" | "tag-compact">("tag-classic");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Formatted date
  const estDate = relationshipStart
    ? new Date(relationshipStart).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "14 Feb 2024";

  // Generate QR Code for physical key
  useEffect(() => {
    async function genQR() {
      try {
        const payload = JSON.stringify({
          app: "titik-temu",
          space: spaceCode,
          action: "UNLOCK_RINDU_JAR",
          ts: Date.now(),
        });
        const url = await QRCode.toDataURL(payload, {
          width: 600,
          margin: 1,
          color: { dark: "#1c1917", light: "#ffffff" },
          errorCorrectionLevel: "H",
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error(err);
      }
    }
    genQR();
  }, [spaceCode]);

  // Export card as high-res PNG for physical keychain / sticker
  const handleExportPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 4, // 4x Retina/HD resolution for physical print
        backgroundColor: "transparent",
      });
      const link = document.createElement("a");
      link.download = `titik-temu-barcode-tag-${spaceCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export tag error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Layout Style Switcher */}
      <div className="flex items-center bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-1 rounded-full text-[9px] font-medium">
        <button
          onClick={() => setStyleMode("tag-classic")}
          className={`px-3 py-1 rounded-full uppercase tracking-wider transition-all ${
            styleMode === "tag-classic" ? "bg-stone-900 text-white shadow-sm" : "text-stone-500"
          }`}
        >
          🏷️ Retail Tag
        </button>
        <button
          onClick={() => setStyleMode("tag-duo")}
          className={`px-3 py-1 rounded-full uppercase tracking-wider transition-all ${
            styleMode === "tag-duo" ? "bg-stone-900 text-white shadow-sm" : "text-stone-500"
          }`}
        >
          📦 Dual Code
        </button>
        <button
          onClick={() => setStyleMode("tag-compact")}
          className={`px-3 py-1 rounded-full uppercase tracking-wider transition-all ${
            styleMode === "tag-compact" ? "bg-stone-900 text-white shadow-sm" : "text-stone-500"
          }`}
        >
          🎟️ Slim Ticket
        </button>
      </div>

      {/* The Printable Tag Canvas */}
      <div className="p-3 bg-stone-100/60 dark:bg-stone-900/40 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center">
        <div
          ref={cardRef}
          className="w-[320px] bg-white text-stone-900 rounded-2xl p-4 shadow-xl border border-stone-200 relative overflow-hidden font-sans select-none"
        >
          {/* Subtle Watermark BG */}
          <div className="absolute -right-6 -bottom-6 text-[48px] font-black text-stone-100 pointer-events-none select-none tracking-tighter uppercase">
            TEMU
          </div>

          {/* Top Brand Header */}
          <div className="flex justify-between items-center border-b border-stone-100 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-stone-900">
                TITIK • TEMU
              </span>
            </div>
            <span className="text-[8px] font-mono font-semibold tracking-wider text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
              KEY #{spaceCode}
            </span>
          </div>

          {/* STYLE 1: Classic Retail Price Tag (Large Yellow/Amber Block) */}
          {styleMode === "tag-classic" && (
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2.5 items-stretch">
                {/* QR Code Container */}
                <div className="w-24 h-24 bg-stone-50 border border-stone-200 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Key QR" className="w-full h-full object-contain" />
                  ) : (
                    <RefreshCw size={16} className="animate-spin text-stone-400" />
                  )}
                </div>

                {/* Info Block with Yellow Accent Box */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="text-left">
                    <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block">
                      Official Key Of
                    </span>
                    <span className="text-[12px] font-bold text-stone-900 truncate block leading-tight">
                      {coupleName}
                    </span>
                    <span className="text-[8px] text-stone-500 font-medium">
                      {cities} ({distanceKm} km)
                    </span>
                  </div>

                  {/* Yellow Accent Badge */}
                  <div className="bg-[#facc15] text-stone-950 p-2 rounded-xl border border-amber-300 shadow-sm flex flex-col items-start">
                    <span className="text-[7px] uppercase tracking-wider font-extrabold text-stone-800">
                      Since Date
                    </span>
                    <span className="text-[14px] font-black tracking-tight leading-none mt-0.5">
                      {estDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Faux Barcode Strip at Bottom */}
              <div className="pt-2 border-t border-dashed border-stone-200 flex flex-col items-center">
                <svg className="w-full h-7 overflow-visible" viewBox="0 0 280 28" preserveAspectRatio="none">
                  <g fill="#1c1917">
                    <rect x="0" y="0" width="3" height="22" />
                    <rect x="5" y="0" width="1.5" height="22" />
                    <rect x="9" y="0" width="4" height="22" />
                    <rect x="16" y="0" width="2" height="22" />
                    <rect x="21" y="0" width="5" height="22" />
                    <rect x="29" y="0" width="1.5" height="22" />
                    <rect x="33" y="0" width="3" height="22" />
                    <rect x="39" y="0" width="6" height="22" />
                    <rect x="48" y="0" width="2" height="22" />
                    <rect x="53" y="0" width="4" height="22" />
                    <rect x="60" y="0" width="1.5" height="22" />
                    <rect x="64" y="0" width="3" height="22" />
                    <rect x="70" y="0" width="5" height="22" />
                    <rect x="78" y="0" width="2" height="22" />
                    <rect x="83" y="0" width="3.5" height="22" />
                    <rect x="90" y="0" width="1" height="22" />
                    <rect x="94" y="0" width="4.5" height="22" />
                    <rect x="102" y="0" width="2" height="22" />
                    <rect x="107" y="0" width="6" height="22" />
                    <rect x="116" y="0" width="1.5" height="22" />
                    <rect x="120" y="0" width="3" height="22" />
                    <rect x="126" y="0" width="5" height="22" />
                    <rect x="134" y="0" width="2" height="22" />
                    <rect x="139" y="0" width="4" height="22" />
                    <rect x="146" y="0" width="1.5" height="22" />
                    <rect x="150" y="0" width="3" height="22" />
                    <rect x="156" y="0" width="5.5" height="22" />
                    <rect x="164" y="0" width="2" height="22" />
                    <rect x="169" y="0" width="4" height="22" />
                    <rect x="176" y="0" width="1" height="22" />
                    <rect x="180" y="0" width="3.5" height="22" />
                    <rect x="186" y="0" width="5" height="22" />
                    <rect x="194" y="0" width="2" height="22" />
                    <rect x="199" y="0" width="4" height="22" />
                    <rect x="206" y="0" width="1.5" height="22" />
                    <rect x="210" y="0" width="3" height="22" />
                    <rect x="216" y="0" width="5" height="22" />
                    <rect x="224" y="0" width="2" height="22" />
                    <rect x="229" y="0" width="4.5" height="22" />
                    <rect x="236" y="0" width="1.5" height="22" />
                    <rect x="240" y="0" width="3" height="22" />
                    <rect x="246" y="0" width="6" height="22" />
                    <rect x="255" y="0" width="2" height="22" />
                    <rect x="260" y="0" width="4" height="22" />
                    <rect x="267" y="0" width="2" height="22" />
                    <rect x="272" y="0" width="5" height="22" />
                  </g>
                </svg>
                <span className="text-[8px] font-mono tracking-[0.3em] text-stone-500 mt-1">
                  * TEMU-{spaceCode}-LDR *
                </span>
              </div>
            </div>
          )}

          {/* STYLE 2: Dual Code (Side-by-Side Barcode & QR) */}
          {styleMode === "tag-duo" && (
            <div className="flex flex-col gap-2">
              {/* Yellow Highlight Banner */}
              <div className="bg-[#facc15] text-stone-950 px-3 py-2 rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <span className="text-[7px] uppercase tracking-wider font-extrabold text-stone-800 block">
                    Special Edition
                  </span>
                  <span className="text-[11px] font-bold text-stone-900 truncate">
                    {coupleName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[7px] uppercase tracking-wider font-extrabold text-stone-800 block">
                    ESTABLISHED
                  </span>
                  <span className="text-[13px] font-black tracking-tight">
                    {estDate}
                  </span>
                </div>
              </div>

              {/* Dual Visuals */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-20 h-20 bg-stone-50 border border-stone-200 rounded-xl p-1 flex items-center justify-center shrink-0 shadow-inner">
                  {qrDataUrl && <img src={qrDataUrl} alt="QR" className="w-full h-full object-contain" />}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                  <svg className="w-full h-12" viewBox="0 0 160 30" preserveAspectRatio="none">
                    <g fill="#1c1917">
                      <rect x="0" y="0" width="2.5" height="26" />
                      <rect x="5" y="0" width="1" height="26" />
                      <rect x="8" y="0" width="3" height="26" />
                      <rect x="13" y="0" width="1.5" height="26" />
                      <rect x="17" y="0" width="4" height="26" />
                      <rect x="23" y="0" width="1" height="26" />
                      <rect x="26" y="0" width="2.5" height="26" />
                      <rect x="31" y="0" width="5" height="26" />
                      <rect x="38" y="0" width="1.5" height="26" />
                      <rect x="42" y="0" width="3" height="26" />
                      <rect x="47" y="0" width="1" height="26" />
                      <rect x="50" y="0" width="2.5" height="26" />
                      <rect x="55" y="0" width="4" height="26" />
                      <rect x="61" y="0" width="1.5" height="26" />
                      <rect x="65" y="0" width="3" height="26" />
                      <rect x="70" y="0" width="1" height="26" />
                      <rect x="73" y="0" width="3.5" height="26" />
                      <rect x="79" y="0" width="1.5" height="26" />
                      <rect x="83" y="0" width="4.5" height="26" />
                      <rect x="90" y="0" width="1" height="26" />
                      <rect x="93" y="0" width="2.5" height="26" />
                      <rect x="98" y="0" width="4" height="26" />
                      <rect x="104" y="0" width="1.5" height="26" />
                      <rect x="108" y="0" width="3" height="26" />
                      <rect x="113" y="0" width="1" height="26" />
                      <rect x="116" y="0" width="2.5" height="26" />
                      <rect x="121" y="0" width="4.5" height="26" />
                      <rect x="128" y="0" width="1.5" height="26" />
                      <rect x="132" y="0" width="3" height="26" />
                      <rect x="137" y="0" width="1" height="26" />
                      <rect x="140" y="0" width="2.5" height="26" />
                      <rect x="145" y="0" width="4" height="26" />
                      <rect x="151" y="0" width="1.5" height="26" />
                      <rect x="155" y="0" width="3" height="26" />
                    </g>
                  </svg>
                  <span className="text-[7.5px] font-mono tracking-widest text-stone-500 mt-1">
                    {cities}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STYLE 3: Slim Ticket */}
          {styleMode === "tag-compact" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-extrabold text-stone-900 block leading-tight">
                    {coupleName}
                  </span>
                  <span className="text-[8px] text-stone-500">
                    {cities} • {distanceKm} KM
                  </span>
                </div>
                <div className="bg-[#facc15] px-2.5 py-1 rounded-lg border border-amber-300">
                  <span className="text-[11px] font-black text-stone-950">
                    {estDate}
                  </span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center p-2 bg-stone-50 rounded-xl border border-stone-100">
                {qrDataUrl && <img src={qrDataUrl} alt="QR" className="w-24 h-24 object-contain" />}
              </div>
            </div>
          )}

          {/* Bottom Cut Notch Decoration (Sticker / Tag look) */}
          <div className="mt-2.5 pt-2 border-t border-stone-100 flex justify-between items-center text-[7.5px] text-stone-400 font-mono">
            <span>NON-TRANSFERABLE</span>
            <span>TITIK-TEMU.APP</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 w-full max-w-[320px]">
        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          className="flex-1 py-2.5 px-3 bg-stone-900 text-white hover:bg-stone-800 rounded-xl text-[10px] font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
        >
          <Download size={13} />
          <span>{isExporting ? "Menyimpan..." : "Unduh Tag Kunci (HD PNG)"}</span>
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Perpanjang Masa Token"
            className="p-2.5 bg-stone-100 border border-stone-200 hover:bg-stone-200 rounded-xl text-stone-600 hover:text-stone-900 transition-all shadow-sm"
          >
            <RefreshCw size={13} />
          </button>
        )}
      </div>

      <p className="text-[9px] text-stone-500 italic text-center max-w-[280px] leading-relaxed">
        ✨ Desain label estetik transparan, siap dicetak untuk gantungan kunci akrilik, stiker casing, atau disisipkan di dompet!
      </p>
    </div>
  );
}