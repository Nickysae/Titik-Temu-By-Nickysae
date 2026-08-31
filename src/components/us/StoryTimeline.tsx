"use client";
import { motion } from "framer-motion";
import { Heart, MapPin, Sparkles } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  date: Date | string;
  type: string;
}

interface Props {
  milestones: Milestone[];
}

export default function StoryTimeline({ milestones }: Props) {
  const getIcon = (type: string) => {
    switch (type) {
      case "START":
      case "ANNIVERSARY":
        return <Heart size={12} strokeWidth={2.5} className="text-[var(--color-brand)]" />;
      case "MEETING":
        return <MapPin size={12} strokeWidth={2.5} className="text-[var(--color-muted)]" />;
      default:
        return <Sparkles size={12} strokeWidth={2.5} className="text-[var(--color-foreground)]" />;
    }
  };

  const sorted = [...milestones].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="w-full flex flex-col items-center mt-6 px-6">
      <div className="w-full max-w-[280px] relative">
        {/* Timeline Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[var(--color-foreground)]/20 via-[var(--color-border)] to-[var(--color-brand)]/50" />

        <div className="flex flex-col gap-10 relative z-10 py-2">
          {sorted.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              className="flex gap-6 items-start"
            >
              <div className="bg-[var(--color-background)] py-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                  {getIcon(event.type)}
                </div>
              </div>

              <div className="flex flex-col pt-2">
                <p className="text-[9px] tracking-[0.25em] uppercase text-[var(--color-brand)] font-medium mb-1">
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h4 className="text-[16px] font-medium text-[var(--color-foreground)] tracking-wide">
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-[12px] text-[var(--color-muted)] font-light mt-1.5 leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
