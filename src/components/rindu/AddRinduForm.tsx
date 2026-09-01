"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Client-side compress & resize image to max 800px, JPEG 80%
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AddRinduForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [text, setText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      setPhotoPreview(compressed);
    } catch (err) {
      console.error("Image compress error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim() && !photoPreview) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/rindu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text.trim() || "(Foto Kenangan)",
          photoUrl: photoPreview ?? null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setIsOpen(false);
      setText("");
      setPhotoPreview(null);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setText("");
    setPhotoPreview(null);
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
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase">Tulis Pesan Rindu</span>
          </motion.button>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-[320px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm"
          >
            <p className="text-[10px] tracking-widest text-[var(--color-muted)] uppercase mb-4 text-center">
              Apa yang kamu rindukan?
            </p>

            {/* Text Area */}
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Aku rindu suaramu hari ini..."
              className="w-full bg-transparent text-[13px] leading-relaxed text-[var(--color-foreground)] placeholder-[var(--color-muted)]/50 resize-none outline-none min-h-[80px]"
              disabled={isSaving}
            />

            {/* Photo Preview */}
            <AnimatePresence>
              {photoPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 relative rounded-xl overflow-hidden border border-[var(--color-border)]"
                >
                  <img
                    src={photoPreview}
                    alt="Foto Rindu"
                    className="w-full max-h-44 object-cover"
                  />
                  <button
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="mt-4 flex justify-between items-center border-t border-[var(--color-border)]/50 pt-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSaving}
                  className="text-[10px] tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase transition-colors"
                >
                  Batal
                </button>

                {/* Photo Attach Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving || isCompressing}
                  className={`flex items-center gap-1 text-[9px] uppercase tracking-wider transition-colors ${
                    photoPreview
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                  title="Lampirkan foto kenangan"
                >
                  {isCompressing ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <ImageIcon size={11} />
                  )}
                  <span>{photoPreview ? "Foto ✓" : "Foto"}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || (!text.trim() && !photoPreview)}
                className={`text-[10px] tracking-wider font-medium uppercase px-4 py-2 rounded-full transition-all duration-300 ${
                  isSaving || (!text.trim() && !photoPreview)
                    ? "bg-[var(--color-background)] text-[var(--color-muted)] cursor-not-allowed"
                    : "bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)]"
                }`}
              >
                {isSaving ? "Menyegel..." : "Segel Rindu 💌"}
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
