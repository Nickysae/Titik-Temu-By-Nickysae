"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddRinduForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [text, setText] = useState("");
  const [showSavedToast, setShowSavedToast] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!text.trim()) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/rindu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setIsOpen(false);
      setText("");
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pb-8 relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <Plus size={16} className="text-[var(--color-brand)] group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase">Add a Rindu</span>
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-[320px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm"
          >
            <p className="text-[11px] tracking-widest text-[var(--color-muted)] uppercase mb-4 text-center">
              What are you missing?
            </p>

            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I missed your voice today..."
              className="w-full bg-transparent text-[13px] leading-relaxed text-[var(--color-foreground)] placeholder-[var(--color-muted)]/50 resize-none outline-none min-h-[100px]"
              disabled={isSaving}
            />

            <div className="mt-4 flex justify-between items-center border-t border-[var(--color-border)]/50 pt-4">
              <button
                onClick={() => { setIsOpen(false); setText(""); }}
                disabled={isSaving}
                className="text-[10px] tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !text.trim()}
                className={`text-[10px] tracking-wider font-medium uppercase px-4 py-2 rounded-full transition-all duration-300 ${
                  isSaving || !text.trim()
                    ? "bg-[var(--color-background)] text-[var(--color-muted)] cursor-not-allowed"
                    : "bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)]"
                }`}
              >
                {isSaving ? "Saving..." : "Save Rindu"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[var(--color-surface)] border border-[var(--color-border)] px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <span className="text-sm">💌</span>
            <span className="text-[11px] tracking-wider text-[var(--color-foreground)] uppercase">
              Surat rindumu telah tersegel rapi.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
