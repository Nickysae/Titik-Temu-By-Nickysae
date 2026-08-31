"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, HeartHandshake, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
}

export default function TwoHalvesModal({ isOpen, onClose, partnerName }: Props) {
  const [step, setStep] = useState<"ready" | "connecting" | "success">("ready");
  const [partnerCode, setPartnerCode] = useState("TEMU-2026");
  const router = useRouter();

  const myCode = "TITIK-2026";

  const handleVerify = async () => {
    setStep("connecting");

    try {
      const res = await fetch("/api/meeting/verify", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to verify");

      // Give 2 seconds for the connection animation
      setTimeout(() => {
        setStep("success");
        setTimeout(() => {
          onClose();
          setStep("ready");
          router.refresh();
        }, 2200);
      }, 1500);
    } catch (err) {
      console.error(err);
      setStep("ready");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <X size={18} />
        </button>

        {step === "ready" && (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-brand)] mb-4">
              <HeartHandshake size={22} strokeWidth={1.5} />
            </div>

            <h3 className="text-base font-medium tracking-wide text-[var(--color-foreground)]">
              Two Halves Verification
            </h3>
            <p className="text-[11px] text-[var(--color-muted)] mt-1.5 leading-relaxed max-w-[240px]">
              Bring your two phones together. Verify this meeting to open your Rindu Jar.
            </p>

            {/* Visual Two Halves Token Cards */}
            <div className="flex items-center justify-center gap-3 my-6 w-full">
              <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-2xl flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">Your Half</span>
                <span className="text-[12px] font-mono font-medium text-[var(--color-foreground)] mt-1">{myCode}</span>
              </div>
              <div className="text-[var(--color-brand)] text-xs font-light">✕</div>
              <div className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] p-3 rounded-2xl flex flex-col items-center">
                <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)]">{partnerName}'s Half</span>
                <span className="text-[12px] font-mono font-medium text-[var(--color-brand)] mt-1">{partnerCode}</span>
              </div>
            </div>

            <button
              onClick={handleVerify}
              className="w-full py-3.5 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[11px] font-medium tracking-[0.15em] uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              <span>Unite Halves & Unlock Jar</span>
            </button>
          </div>
        )}

        {step === "connecting" && (
          <div className="flex flex-col items-center text-center py-8">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-brand)]"
              />
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-2xl"
              >
                🌓
              </motion.div>
            </div>

            <p className="text-[12px] font-medium text-[var(--color-foreground)] tracking-wide mt-6">
              Connecting two halves...
            </p>
            <p className="text-[10px] text-[var(--color-muted)] mt-1">
              Closing the distance between you two
            </p>
          </div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center py-6"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} />
            </div>

            <h3 className="text-lg font-light tracking-tight text-[var(--color-foreground)]">
              The Distance Has Disappeared
            </h3>
            <p className="text-[12px] text-[var(--color-brand)] italic mt-2">
              "Your Rindu Jar is now open."
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
