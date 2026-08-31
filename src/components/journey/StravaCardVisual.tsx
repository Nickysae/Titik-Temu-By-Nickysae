"use client";
import { useEffect, useRef, useState } from "react";
import { MeetingItem } from "./JourneyTimeline";
import { getCityCoordinates } from "@/lib/geo";
import { Loader2, Navigation, Download, Share2, Check } from "lucide-react";
import { toPng } from "html-to-image";

interface Props {
  meetings: MeetingItem[];
}

export default function StravaCardVisual({ meetings }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [totalKm, setTotalKm] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [svgPath, setSvgPath] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchAndComputeRoute() {
      setIsLoading(true);
      if (sortedMeetings.length === 0) {
        setIsLoading(false);
        return;
      }

      // Default fallback distance directly from registered meetings
      const fallbackKm = sortedMeetings.reduce((acc, m) => acc + (m.distance || 0), 0);
      
      // If there is only 1 meeting, calculate real route from origin city to meeting city
      const locations = sortedMeetings.length === 1
        ? ["Surabaya", sortedMeetings[0].locationName]
        : sortedMeetings.map((m) => m.locationName);
      
      let rawPoints: [number, number][] = locations.map((loc, i) =>
        getCityCoordinates(loc, i)
      );

      if (locations.length >= 2) {
        try {
          const res = await fetch("/api/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locations }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.coordinates && data.coordinates.length > 0) {
              rawPoints = data.coordinates;
              // If single meeting, respect the meeting's stored distance or ORS calculated distance
              if (sortedMeetings.length === 1 && fallbackKm > 0) {
                setTotalKm(fallbackKm);
              } else if (data.distanceKm) {
                setTotalKm(data.distanceKm);
              } else {
                setTotalKm(fallbackKm);
              }
            } else {
              setTotalKm(fallbackKm);
            }
          } else {
            setTotalKm(fallbackKm);
          }
        } catch (e) {
          console.error("Error fetching road route for Strava card:", e);
          setTotalKm(fallbackKm);
        }
      } else {
        setTotalKm(fallbackKm);
      }

      if (!isMounted) return;

      // Project GPS coords ([lat, lng]) into SVG Coordinate Box (width 320, height 200)
      if (rawPoints.length > 0) {
        const lats = rawPoints.map((p) => p[0]);
        const lngs = rawPoints.map((p) => p[1]);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const latSpan = maxLat - minLat || 0.01;
        const lngSpan = maxLng - minLng || 0.01;

        const pad = 30;
        const w = 320 - pad * 2;
        const h = 200 - pad * 2;

        const projected = rawPoints.map(([lat, lng]) => {
          const x = pad + ((lng - minLng) / lngSpan) * w;
          const y = pad + (1 - (lat - minLat) / latSpan) * h;
          return [x, y];
        });

        if (projected.length === 1) {
          setSvgPath(`M ${projected[0][0]} ${projected[0][1]} l 0.1 0.1`);
        } else {
          const pathD = projected.reduce(
            (acc, [x, y], idx) => (idx === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : `${acc} L ${x.toFixed(1)} ${y.toFixed(1)}`),
            ""
          );
          setSvgPath(pathD);
        }
      }

      setIsLoading(false);
    }

    fetchAndComputeRoute();

    return () => {
      isMounted = false;
    };
  }, [meetings]);

  const displayKm = totalKm > 0 ? (totalKm).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : "0";
  
  const firstDate = sortedMeetings[0] ? new Date(sortedMeetings[0].scheduledAt).getTime() : Date.now();
  const lastDate = sortedMeetings[sortedMeetings.length - 1] ? new Date(sortedMeetings[sortedMeetings.length - 1].scheduledAt).getTime() : Date.now();
  const diffDays = Math.max(1, Math.round(Math.abs(lastDate - firstDate) / (1000 * 60 * 60 * 24)));

  // Download Card as PNG
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Ultra-sharp 3x retina resolution for IG Story
      });

      const link = document.createElement("a");
      link.download = `titik-temu-strava-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export image error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Web Share API (native share on mobile browsers for IG Story / WhatsApp)
  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "titik-temu-journey.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Our Journey - Titik Temu",
          text: `Perjalanan jarak dan rindu kami di Titik Temu (${displayKm} km)`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Our Journey - Titik Temu",
          text: `Perjalanan jarak dan rindu kami di Titik Temu (${displayKm} km)`,
          url: window.location.href,
        });
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 pb-6">
      {/* Clean White Strava Poster Card with ref for high-res export */}
      <div
        ref={cardRef}
        className="w-full max-w-sm bg-white text-stone-900 rounded-3xl p-8 shadow-sm border border-[var(--color-border)] flex flex-col items-center select-none relative overflow-hidden"
      >
        {/* 1. Jarak */}
        <div className="flex flex-col items-center mb-7">
          <span className="text-[14px] text-stone-900 font-semibold tracking-normal mb-1">
            Jarak
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight font-sans text-stone-900">
            {isLoading ? (
              <span className="flex items-center gap-2 text-2xl text-stone-400">
                <Loader2 size={20} className="animate-spin text-[#fc4c02]" /> ...
              </span>
            ) : (
              `${displayKm} km`
            )}
          </h2>
        </div>

        {/* 2. Pace */}
        <div className="flex flex-col items-center mb-7">
          <span className="text-[14px] text-stone-900 font-semibold tracking-normal mb-1">
            Pace
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight font-sans text-stone-900">
            {sortedMeetings.length > 0
              ? `${(totalKm / Math.max(1, sortedMeetings.length)).toFixed(0)} km / temu`
              : "0 km / temu"}
          </h3>
        </div>

        {/* 3. Waktu */}
        <div className="flex flex-col items-center mb-7">
          <span className="text-[14px] text-stone-900 font-semibold tracking-normal mb-1">
            Waktu
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight font-sans text-stone-900">
            {`${diffDays}h ${sortedMeetings.length * 12}m`}
          </h3>
        </div>

        {/* 4. Strava GPS Route Line (Pure Orange Line on White) */}
        <div className="w-full h-44 my-2 flex items-center justify-center relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-stone-400">
              <Loader2 size={24} className="animate-spin text-[#fc4c02]" />
              <span className="text-[10px] tracking-widest uppercase">Rendering Track...</span>
            </div>
          ) : svgPath ? (
            <svg
              viewBox="0 0 320 200"
              className="w-full h-full filter drop-shadow-[0_1px_4px_rgba(252,76,2,0.25)]"
            >
              {/* Outer light glow */}
              <path
                d={svgPath}
                fill="none"
                stroke="#fc4c02"
                strokeWidth="6"
                strokeOpacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main crisp Strava orange route line */}
              <path
                d={svgPath}
                fill="none"
                stroke="#fc4c02"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-400 gap-1">
              <Navigation size={20} />
              <span className="text-[10px] tracking-widest uppercase">Belum ada rute</span>
            </div>
          )}
        </div>

        {/* Checkpoint Location Pills */}
        <div className="w-full flex flex-wrap justify-center gap-1.5 mt-3 mb-8">
          {sortedMeetings.map((m, i) => (
            <span
              key={m.id || i}
              className="bg-stone-50 text-stone-600 text-[10px] px-3 py-1 rounded-full border border-stone-200 tracking-wider flex items-center gap-1.5 font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#fc4c02]"></span>
              {m.locationName}
            </span>
          ))}
        </div>

        {/* 5. Official Bold STRAVA Logo */}
        <div className="mt-auto pt-2 flex flex-col items-center">
          <span className="text-xl font-black italic tracking-[0.25em] text-stone-900 font-sans uppercase">
            STRAVA
          </span>
          <span className="text-[8px] tracking-[0.3em] text-stone-400 uppercase mt-0.5">
            Titik Temu Edition
          </span>
        </div>
      </div>

      {/* Social Media Share & Download Action Bar */}
      <div className="w-full max-w-sm mt-4 flex items-center justify-center gap-3">
        <button
          onClick={handleDownload}
          disabled={isExporting || isLoading}
          className="flex-1 py-3 px-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl text-[11px] font-medium tracking-wider text-[var(--color-foreground)] hover:bg-stone-100 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 size={14} className="animate-spin text-[var(--color-brand)]" />
          ) : (
            <Download size={14} className="text-[var(--color-brand)]" />
          )}
          <span>Simpan Gambar</span>
        </button>

        <button
          onClick={handleShare}
          disabled={isExporting || isLoading}
          className="flex-1 py-3 px-4 bg-[#fc4c02] text-white rounded-2xl text-[11px] font-semibold tracking-wider hover:bg-[#e04300] transition-all flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Share2 size={14} />
          )}
          <span>Pamerkan / Bagikan</span>
        </button>
      </div>

      <p className="text-[10px] text-[var(--color-muted)] italic font-light text-center mt-3">
        Bagikan Kisah LDR Mu
      </p>
    </div>
  );
}
