"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, X, Check, Loader2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  distance: number;
  userACity: string;
  userBCity: string;
  myCity: string;
  myName: string;
  partnerName: string;
}

// Helper function to extract clean primary pinpoint label (e.g. "Brengkok, Brondong, Lamongan" -> "Brengkok" or "Lamongan")
function getShortCityName(fullName: string): string {
  if (!fullName) return "";
  const parts = fullName.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return fullName;
  // Return the first distinct pinpoint name (e.g. "Brengkok" or "Lamongan")
  // If first part has "Desa " / "Kel. ", clean it up for the compact pill
  const first = parts[0].replace(/^(desa|kelurahan|kel\.|kecamatan|kec\.)\s+/i, "");
  return first || parts[0];
}

export default function DistancePreview({
  distance,
  userACity,
  userBCity,
  myCity,
  myName,
  partnerName,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCity, setNewCity] = useState(myCity || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const shortCityA = getShortCityName(userACity) || "Kota Kamu";
  const shortCityB = getShortCityName(userBCity) || "Kota Pasangan";
  const shortMyCity = getShortCityName(myCity);

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/space/city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: newCity.trim() }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="flex flex-col items-center justify-center py-10 border-t border-b border-[var(--color-border)]/50 mx-8 relative"
      >
        <h2 className="text-2xl font-light text-[var(--color-foreground)] tracking-wide">
          {distance} KM
        </h2>
        <p className="text-[10px] text-[var(--color-muted)] tracking-widest mt-1.5 mb-7 uppercase">
          between you two
        </p>

        {/* Minimalist Connecting Line */}
        <div className="w-full flex items-center justify-between relative max-w-[220px]">
          <div className="w-2 h-2 rounded-full bg-[var(--color-foreground)] z-10 shadow-xs" />
          <div className="absolute left-0 right-0 h-[1px] bg-[var(--color-border)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-brand)] z-10 shadow-xs" />
        </div>

        {/* Dynamic Clean Pinpoint Names */}
        <div className="w-full flex items-center justify-between mt-3 px-1 max-w-[240px]">
          <span
            className="text-[11px] font-medium text-[var(--color-foreground)] tracking-wide truncate max-w-[110px]"
            title={userACity}
          >
            {shortCityA}
          </span>
          <span
            className="text-[11px] font-medium text-[var(--color-brand)] tracking-wide truncate max-w-[110px] text-right"
            title={userBCity}
          >
            {shortCityB}
          </span>
        </div>

        {/* Edit City Location Trigger */}
        <button
          onClick={() => {
            setNewCity(myCity);
            setIsModalOpen(true);
          }}
          className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[9px] uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-brand)] transition-all shadow-xs"
        >
          <MapPin size={10} className="text-[var(--color-brand)]" />
          <span>Ganti Lokasiku ({shortMyCity || "Atur"})</span>
        </button>
      </motion.div>

      {/* Modal Update Location */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xs bg-[var(--color-background)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 text-[var(--color-brand)] mb-1">
                <MapPin size={16} />
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">
                  Pindah / Ganti Kota
                </h3>
              </div>
              <p className="text-[10px] text-[var(--color-muted)] mb-4 leading-relaxed">
                Jarak LDR dan rute temu kalian akan otomatis disesuaikan secara presisi hingga tingkat desa & kecamatan.
              </p>

              <form onSubmit={handleUpdateCity} className="flex flex-col gap-3">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1 font-medium">
                    Lokasi / Domisili {myName} Sekarang
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Desa Paciran, Kec. Paciran, Lamongan"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
                    required
                    autoFocus
                  />
                  <p className="text-[9px] text-[var(--color-muted)] mt-1.5 leading-normal">
                    💡 <span className="font-medium">Tips:</span> Kamu bisa memasukkan format lengkap <span className="font-mono text-[var(--color-brand)]">Desa, Kecamatan, Kota/Kab</span> agar titik peta tidak tertukar.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newCity.trim()}
                  className="w-full mt-2 py-2.5 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Check size={12} />
                  )}
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan Kota Baru"}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
