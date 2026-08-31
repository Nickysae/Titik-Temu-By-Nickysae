"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMeetingModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("72");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          scheduledAt: date,
          locationName: location,
          distance: Number(distance) || 0,
        }),
      });

      if (!res.ok) throw new Error("Failed to create meeting");

      onClose();
      setTitle("");
      setDate("");
      setLocation("");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-medium tracking-wide text-[var(--color-foreground)] text-center mb-1">
          Plan Next Meeting
        </h3>
        <p className="text-[11px] text-[var(--color-muted)] text-center mb-6">
          Set a date to make the countdown real.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              Meeting Title
            </label>
            <input
              type="text"
              placeholder="e.g. Meeting #09 / Weekend Getaway"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              Scheduled Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                Location City
              </label>
              <input
                type="text"
                placeholder="e.g. Surabaya"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                Distance (KM)
              </label>
              <input
                type="number"
                placeholder="e.g. 72"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 py-3 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Planned Meeting"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
