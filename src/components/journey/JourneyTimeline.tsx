"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export interface MeetingItem {
  id: string;
  title: string;
  scheduledAt: Date | string;
  locationName: string;
  distance: number;
  status: string;
}

interface Props {
  meetings: MeetingItem[];
}

export default function JourneyTimeline({ meetings }: Props) {
  // Sort descending by date
  const sorted = [...meetings].sort(
    (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
  );

  return (
    <div className="w-full flex flex-col items-center mt-8 px-6 pb-12">
      <div className="w-full max-w-[280px] relative">
        {/* Timeline Line */}
        <div className="absolute left-[11px] top-4 bottom-0 w-[1px] bg-gradient-to-b from-[var(--color-brand)] via-[var(--color-border)] to-transparent" />

        <div className="flex flex-col gap-8 relative z-10">
          {sorted.map((meeting, i) => {
            const isUpcoming = meeting.status === "PLANNED";
            const dateObj = new Date(meeting.scheduledAt);
            const dateStr = dateObj.toLocaleDateString("id-ID", {
              month: "short",
              year: "numeric",
            });

            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className={`flex gap-6 items-start ${isUpcoming ? "opacity-100" : "opacity-75"}`}
              >
                <div className="bg-[var(--color-background)] py-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      isUpcoming
                        ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
                    }`}
                  >
                    <MapPin size={10} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="flex flex-col pt-1">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--color-muted)] font-medium">
                    {dateStr}
                  </p>
                  <h4 className="text-[15px] font-medium text-[var(--color-foreground)] tracking-wide mt-0.5">
                    {meeting.title}
                  </h4>
                  <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
                    📍 {meeting.locationName} · {meeting.distance} km
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
