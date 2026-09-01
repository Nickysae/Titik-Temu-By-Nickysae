"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MeetingItem } from "./JourneyTimeline";
import { getCityCoordinates } from "@/lib/geo";
import { Zap, Navigation2, Loader2 } from "lucide-react";

interface Props {
  meetings: MeetingItem[];
  userACity?: string | null;
  userBCity?: string | null;
}

export default function StravaRealMap({ meetings, userACity, userBCity }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null);
  const [routeType, setRouteType] = useState<"road" | "straight" | "loading">("loading");
  const [totalKm, setTotalKm] = useState(0);

  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [-7.5, 112.0],
        zoom: 7.5,
        zoomControl: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Minimalist CartoDB Voyager tile
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 18, subdomains: "abcd" }
      ).addTo(map);

      const markerCoords: [number, number][] = [];

      const cityA = userACity || "Jakarta";
      const cityB = userBCity || "Surabaya";

      // If no meetings, render markers for the two cities
      if (sortedMeetings.length === 0) {
        const pinLocations = [
          { name: cityA, label: "Rumah Kamu" },
          { name: cityB, label: "Rumah Pasangan" },
        ];

        pinLocations.forEach((loc, index) => {
          const coords = getCityCoordinates(loc.name, index);
          markerCoords.push(coords);

          const markerHtml = `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);">
              <div style="width:28px;height:28px;border-radius:50%;border:2.5px solid #ea580c;background:#ea580c;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.18);">
                ${index === 0 ? "A" : "B"}
              </div>
              <div style="position:absolute;top:32px;background:rgba(0,0,0,0.85);color:white;padding:2px 8px;border-radius:20px;font-size:9px;font-family:sans-serif;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;pointer-events:none;">
                ${loc.name}
              </div>
            </div>`;

          const icon = L.divIcon({
            className: "ors-strava-marker",
            html: markerHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          L.marker(coords, { icon }).addTo(map);
        });
      } else {
        // Add markers for each meeting
        sortedMeetings.forEach((m, index) => {
          const coords = getCityCoordinates(m.locationName, index);
          markerCoords.push(coords);

          const isUpcoming = m.status === "PLANNED";
          const shortPinLabel = m.locationName.split(",")[0].replace(/^(desa|kelurahan|kel\.|kecamatan|kec\.)\s+/i, "").trim() || m.locationName;

          const markerHtml = `
            <div style="position:relative;display:flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);">
              ${isUpcoming ? `<div style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(234,88,12,0.2);animation:ping 1.5s cubic-bezier(0,0,.2,1) infinite;"></div>` : ""}
              <div style="width:28px;height:28px;border-radius:50%;border:2.5px solid ${isUpcoming ? "#ea580c" : "#36312d"};background:${isUpcoming ? "#ea580c" : "white"};color:${isUpcoming ? "white" : "#36312d"};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.18);cursor:pointer;transition:all .2s;">
                ${index + 1}
              </div>
              <div style="position:absolute;top:32px;background:rgba(0,0,0,0.78);color:white;padding:2px 7px;border-radius:20px;font-size:8px;font-family:sans-serif;text-transform:uppercase;letter-spacing:0.1em;white-space:nowrap;pointer-events:none;">
                ${shortPinLabel}
              </div>
            </div>`;

          const icon = L.divIcon({
            className: "ors-strava-marker",
            html: markerHtml,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          L.marker(coords, { icon })
            .addTo(map)
            .on("click", () => setSelectedMeeting(m));
        });
      }

      // Fit bounds first
      if (markerCoords.length > 1) {
        map.fitBounds(L.latLngBounds(markerCoords), { padding: [50, 50], maxZoom: 10 });
      }

      // Determine locations to fetch road route
      let locations: string[] = [];
      if (sortedMeetings.length === 0) {
        locations = [cityA, cityB];
      } else if (sortedMeetings.length === 1) {
        locations = [cityA, sortedMeetings[0].locationName, cityB];
      } else {
        locations = sortedMeetings.map((m) => m.locationName);
      }

      if (locations.length >= 2) {
        try {
          const res = await fetch("/api/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locations }),
          });

          const data = await res.json();
          if (!isMounted) return;

          const routeCoords: [number, number][] = data.coordinates || markerCoords;

          if (data.type === "road" && data.distanceKm) {
            setTotalKm(data.distanceKm);
            setRouteType("road");
          } else {
            const fallback = sortedMeetings.reduce((total, m) => total + (m.distance || 0), 0);
            setTotalKm(fallback);
            setRouteType("straight");
          }

          // Glow shadow
          L.polyline(routeCoords, {
            color: "#ea580c",
            weight: 10,
            opacity: 0.15,
            lineCap: "round",
            lineJoin: "round",
          }).addTo(map);

          // Main Strava orange track
          L.polyline(routeCoords, {
            color: "#ea580c",
            weight: 3.5,
            opacity: 0.9,
            dashArray: data.type === "road" ? undefined : "6, 10",
            lineCap: "round",
            lineJoin: "round",
          }).addTo(map);

          // Refit to route
          if (routeCoords.length > 1) {
            map.fitBounds(L.latLngBounds(routeCoords), { padding: [40, 40], maxZoom: 10 });
          }
        } catch (err) {
          console.error("Route fetch error:", err);
          if (!isMounted) return;
          const fallback = sortedMeetings.reduce((total, m) => total + (m.distance || 0), 0);
          setTotalKm(fallback);
          setRouteType("straight");
        }
      } else {
        const fallback = sortedMeetings.reduce((total, m) => total + (m.distance || 0), 0);
        setTotalKm(fallback);
        setRouteType("straight");
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [meetings]);

  return (
    <div className="w-full flex flex-col items-center px-4 pb-6">
      {/* Strava Activity Stats Banner */}
      <div className="w-full bg-[#1c1917] text-white rounded-2xl p-4 shadow-lg mb-3 flex items-center justify-between border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-orange-400 font-medium mb-0.5">
              Our Shared Distance
            </p>
            <h4 className="text-[15px] font-semibold tracking-wide text-white leading-none">
              {routeType === "loading" ? (
                <span className="flex items-center gap-1.5 text-stone-400">
                  <Loader2 size={13} className="animate-spin" /> Kalkulasi Rute...
                </span>
              ) : (
                `${totalKm.toLocaleString("id-ID")} KM`
              )}
            </h4>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] font-mono text-stone-300">
            {sortedMeetings.length} Checkpoint{sortedMeetings.length > 1 ? "s" : ""}
          </span>
          {routeType === "road" && (
            <span className="flex items-center gap-1 text-[8px] uppercase tracking-wider text-emerald-400 font-medium">
              <Navigation2 size={9} />
              Road Route
            </span>
          )}
          {routeType === "straight" && (
            <span className="text-[8px] uppercase tracking-wider text-stone-500 font-medium">
              Jarak Linear
            </span>
          )}
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-[var(--color-border)] relative bg-[var(--color-surface)]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Loading Overlay */}
        {routeType === "loading" && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10 pointer-events-none">
            <Loader2 size={24} className="animate-spin text-orange-500" />
            <p className="text-[11px] uppercase tracking-widest text-[var(--color-muted)]">
              Menemukan Rute Jalan...
            </p>
          </div>
        )}

        {/* Checkpoint Detail Card */}
        {selectedMeeting && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/96 backdrop-blur-sm p-3.5 rounded-2xl shadow-lg border border-[var(--color-border)] z-20 flex justify-between items-start">
            <div>
              <span className={`text-[9px] uppercase tracking-widest font-semibold ${selectedMeeting.status === "PLANNED" ? "text-orange-500" : "text-[var(--color-brand)]"}`}>
                {selectedMeeting.status === "PLANNED" ? "🧡 Rencana Pertemuan" : "✓ Pertemuan Selesai"}
              </span>
              <h5 className="text-[13px] font-medium text-[var(--color-foreground)] mt-0.5">
                {selectedMeeting.title}
              </h5>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                📍 {selectedMeeting.locationName} ·{" "}
                {new Date(selectedMeeting.scheduledAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="text-[10px] text-orange-500 font-medium mt-1">
                ~{selectedMeeting.distance} KM dari rumah
              </p>
            </div>
            <button
              onClick={() => setSelectedMeeting(null)}
              className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] px-2 py-1 ml-2 shrink-0"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-[var(--color-muted)] italic font-light text-center mt-3">
        {routeType === "road"
          ? "Rute mengikuti jalur jalan nyata via OpenRouteService."
          : "Ketuk checkpoint di peta untuk melihat detail pertemuan."}
      </p>
    </div>
  );
}
