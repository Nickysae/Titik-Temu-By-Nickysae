"use client";
import { useEffect, useState } from "react";
import { MeetingItem } from "./JourneyTimeline";
import { getCityCoordinates } from "@/lib/geo";
import { MapPin, Loader2, Sparkles, Navigation } from "lucide-react";

interface Props {
  meetings: MeetingItem[];
}

export default function StravaCardVisual({ meetings }: Props) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [totalKm, setTotalKm] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [svgPath, setSvgPath] = useState<string>("");

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

      // Default straight fallback distance
      const fallbackKm = sortedMeetings.reduce((acc, m) => acc + (m.distance || 0), 0);

      // Coordinates list
      const locations = sortedMeetings.map((m) => m.locationName);
      
      let rawPoints: [number, number][] = sortedMeetings.map((m, i) =>
        getCityCoordinates(m.locationName, i)
      );

      if (sortedMeetings.length >= 2) {
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
              if (data.distanceKm) {
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

        const pad = 35;
        const w = 320 - pad * 2;
        const h = 200 - pad * 2;

        const projected = rawPoints.map(([lat, lng]) => {
          // Normalize (lng -> x, lat -> y inverted)
          const x = pad + ((lng - minLng) / lngSpan) * w;
          const y = pad + (1 - (lat - minLat) / latSpan) * h;
          return [x, y];
        });

        // Build SVG path
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

  // Calculate simulated romantic LDR "Pace" & "Waktu"
  // Pace: e.g. "Rindu / Hari" or average tempo
  // Waktu: total days or elapsed relationship time
  const displayKm = totalKm > 0 ? (totalKm).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 2 }) : "0";
  
  // Calculate total days from meetings span
  const firstDate = sortedMeetings[0] ? new Date(sortedMeetings[0].scheduledAt).getTime() : Date.now();
  const lastDate = sortedMeetings[sortedMeetings.length - 1] ? new Date(sortedMeetings[sortedMeetings.length - 1].scheduledAt).getTime() : Date.now();
  const diffDays = Math.max(1, Math.round(Math.abs(lastDate - firstDate) / (1000 * 60 * 60 * 24)));

  return (
    <div className="w-full flex flex-col items-center px-4 pb-6">
      {/* Strava Pure Minimalist Black Card */}
      <div className="w-full max-w-sm bg-black text-white rounded-3xl p-7 shadow-2xl border border-stone-900 flex flex-col items-center select-none relative overflow-hidden">
        
        {/* Top Minimal Header / Badge */}
        <div className="flex items-center gap-1.5 mb-6 text-stone-400 text-[10px] tracking-[0.3em] uppercase">
          <Sparkles size={11} className="text-[#fc4c02]" />
          <span>Our Journey Activity</span>
        </div>

        {/* 1. Jarak */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-[13px] text-stone-300 font-medium tracking-wide mb-1">
            Jarak
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight font-sans text-white">
            {isLoading ? (
              <span className="flex items-center gap-2 text-2xl text-stone-400">
                <Loader2 size={20} className="animate-spin text-[#fc4c02]" /> ...
              </span>
            ) : (
              `${displayKm} km`
            )}
          </h2>
        </div>

        {/* 2. Pace / Frekuensi */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-[13px] text-stone-300 font-medium tracking-wide mb-1">
            Pace
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight font-sans text-white">
            {sortedMeetings.length > 0
              ? `${(totalKm / Math.max(1, sortedMeetings.length)).toFixed(0)} km / temu`
              : "0 km / temu"}
          </h3>
        </div>

        {/* 3. Waktu */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-[13px] text-stone-300 font-medium tracking-wide mb-1">
            Waktu
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight font-sans text-white">
            {`${diffDays}h ${sortedMeetings.length * 12}m`}
          </h3>
        </div>

        {/* 4. Strava GPS GPS Track Shape (Pure Orange Line on Black) */}
        <div className="w-full h-44 my-2 flex items-center justify-center relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-stone-500">
              <Loader2 size={24} className="animate-spin text-[#fc4c02]" />
              <span className="text-[10px] tracking-widest uppercase">Rendering Track...</span>
            </div>
          ) : svgPath ? (
            <svg
              viewBox="0 0 320 200"
              className="w-full h-full filter drop-shadow-[0_0_8px_rgba(252,76,2,0.4)]"
            >
              {/* Outer soft glow line */}
              <path
                d={svgPath}
                fill="none"
                stroke="#fc4c02"
                strokeWidth="7"
                strokeOpacity="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Main crisp Strava orange line */}
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
            <div className="flex flex-col items-center justify-center text-stone-600 gap-1">
              <Navigation size={20} />
              <span className="text-[10px] tracking-widest uppercase">Belum ada rute</span>
            </div>
          )}
        </div>

        {/* Checkpoints list pills */}
        <div className="w-full flex flex-wrap justify-center gap-1.5 mt-2 mb-6">
          {sortedMeetings.map((m, i) => (
            <span
              key={m.id || i}
              className="bg-stone-900 text-stone-300 text-[9px] px-2.5 py-1 rounded-full border border-stone-800 tracking-wider flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#fc4c02]"></span>
              {m.locationName}
            </span>
          ))}
        </div>

        {/* 5. Official Bold STRAVA Logo */}
        <div className="mt-auto pt-2 flex flex-col items-center">
          <span className="text-xl font-black italic tracking-[0.25em] text-white font-sans uppercase">
            STRAVA
          </span>
          <span className="text-[7px] tracking-[0.4em] text-stone-500 uppercase mt-0.5">
            Titik Temu Edition
          </span>
        </div>
      </div>
    </div>
  );
}
