"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Heart, Sparkles, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMomentModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"MOMENT" | "ANNIVERSARY" | "MEETING">("MOMENT");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/milestone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          description,
          type,
        }),
      });

      if (!res.ok) throw new Error("Failed to create moment");

      onClose();
      setTitle("");
      setDate("");
      setDescription("");
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
          Record a Moment
        </h3>
        <p className="text-[11px] text-[var(--color-muted)] text-center mb-6">
          Add a milestone to your relationship story.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              Moment Title
            </label>
            <input
              type="text"
              placeholder="e.g. First call that lasted until 3 AM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              Type of Moment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "MOMENT", label: "Special", icon: Sparkles },
                { id: "ANNIVERSARY", label: "Milestone", icon: Heart },
                { id: "MEETING", label: "Meetup", icon: MapPin },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as any)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-[9px] uppercase tracking-wider transition-all ${
                    type === t.id
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-medium"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
                  }`}
                >
                  <t.icon size={13} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              A Short Note (Optional)
            </label>
            <textarea
              placeholder="What made this moment unforgettable?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors resize-none min-h-[60px]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Add to Our Story"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
