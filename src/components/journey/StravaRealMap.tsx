"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MeetingItem } from "./JourneyTimeline";
import { getCityCoordinates } from "@/lib/geo";
import { Navigation, MapPin, Zap } from "lucide-react";

interface Props {
  meetings: MeetingItem[];
}

export default function StravaRealMap({ meetings }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null);

  // Sort chronological for route
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet on client side
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center: East/Central Java
      const defaultCenter: [number, number] = [-7.5, 112.0];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 7.5,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Minimalist Aesthetic Tile Layer (CartoDB Voyager)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 18,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Extract points
      const routePoints: [number, number][] = [];
      const markers: any[] = [];

      sortedMeetings.forEach((m, index) => {
        const coords = getCityCoordinates(m.locationName, index);
        routePoints.push(coords);

        const isUpcoming = m.status === "PLANNED";
        const isLast = index === sortedMeetings.length - 1;

        // Custom Minimalist Strava Marker Icon
        const markerHtml = `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            ${
              isUpcoming || isLast
                ? '<div class="absolute w-8 h-8 rounded-full bg-orange-500/25 animate-ping"></div>'
                : ""
            }
            <div class="w-6 h-6 rounded-full border-2 ${
              isUpcoming
                ? "bg-orange-500 border-white text-white shadow-lg"
                : "bg-white border-[#36312d] text-[#36312d] shadow-sm"
            } flex items-center justify-center text-[9px] font-bold tracking-tighter">
              ${index + 1}
            </div>
            <div class="absolute -bottom-5 px-1.5 py-0.5 rounded bg-black/75 text-white text-[8px] tracking-wider uppercase font-medium whitespace-nowrap opacity-90 pointer-events-none">
              ${m.locationName}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: "custom-strava-marker",
          html: markerHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(coords, { icon: customIcon }).addTo(map);

        marker.on("click", () => {
          setSelectedMeeting(m);
        });

        markers.push(marker);
      });

      // Draw Glowing Strava-style Polyline
      if (routePoints.length > 1) {
        // 1. Glow shadow line
        L.polyline(routePoints, {
          color: "#ea580c",
          weight: 7,
          opacity: 0.25,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        // 2. Core glowing orange Strava track
        const mainPolyline = L.polyline(routePoints, {
          color: "#ea580c",
          weight: 3.5,
          opacity: 0.95,
          dashArray: "4, 8",
          lineCap: "round",
          lineJoin: "round",
        }).addTo(map);

        // Fit map view to encompass all coordinates
        const bounds = L.latLngBounds(routePoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [meetings]);

  const totalKm = sortedMeetings.reduce((acc, m) => acc + (m.distance || 0), 0);

  return (
    <div className="w-full flex flex-col items-center relative mt-4 px-4 pb-6">
      {/* Strava Activity Stats Floating Banner */}
      <div className="w-full bg-[#1c1917] text-white rounded-2xl p-4 shadow-lg mb-3 flex items-center justify-between z-10 border border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-orange-400 font-medium">Strava Journey Route</p>
            <h4 className="text-[14px] font-semibold tracking-wide text-white">
              {totalKm.toLocaleString("id-ID")} KM Total Tracked
            </h4>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-stone-300 font-medium">
            {sortedMeetings.length} Checkpoints
          </span>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-[var(--color-border)] relative bg-[var(--color-surface)]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Checkpoint Card Overlay */}
        {selectedMeeting && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-md border border-[var(--color-border)] z-20 flex justify-between items-center">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-orange-600 font-medium">
                {selectedMeeting.status === "PLANNED" ? "Upcoming Destination" : "Completed Meeting"}
              </span>
              <h5 className="text-[13px] font-medium text-[var(--color-foreground)] mt-0.5">
                {selectedMeeting.title} · {selectedMeeting.locationName}
              </h5>
              <p className="text-[10px] text-[var(--color-muted)]">
                {new Date(selectedMeeting.scheduledAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })} · {selectedMeeting.distance} KM
              </p>
            </div>
            <button
              onClick={() => setSelectedMeeting(null)}
              className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] px-2 py-1"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      <p className="text-[10px] text-[var(--color-muted)] italic font-light text-center mt-3">
        Ketuk nomor checkpoint di peta untuk melihat detail pertemuan.
      </p>
    </div>
  );
}
