"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AbstractMap from "./AbstractMap";
import JourneyTimeline, { MeetingItem } from "./JourneyTimeline";
import AddMeetingModal from "./AddMeetingModal";
import { Plus } from "lucide-react";

interface Props {
  meetings: MeetingItem[];
}

export default function JourneyView({ meetings }: Props) {
  const [view, setView] = useState<"map" | "story">("map");
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Tabs & Add Meeting Button */}
      <div className="flex items-center justify-between px-8 mt-6 mb-2">
        <div className="flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full p-1 shadow-sm">
          <button
            onClick={() => setView("map")}
            className={`px-5 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
              view === "map"
                ? "bg-[var(--color-foreground)] text-white font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setView("story")}
            className={`px-5 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
              view === "story"
                ? "bg-[var(--color-foreground)] text-white font-medium"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Story
          </button>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-[var(--color-brand)] bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-1.5 rounded-full hover:shadow-sm transition-all"
        >
          <Plus size={11} />
          <span>Plan</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 w-full relative min-h-[360px]">
        <AnimatePresence mode="wait">
          {view === "map" ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <AbstractMap meetings={meetings} />
            </motion.div>
          ) : (
            <motion.div
              key="story"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 overflow-y-auto pb-8"
            >
              <JourneyTimeline meetings={meetings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddMeetingModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
