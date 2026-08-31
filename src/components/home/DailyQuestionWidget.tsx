"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, CheckCircle2, Send, Heart, Eye } from "lucide-react";

interface DailyState {
  dateKey: string;
  question: string;
  hasMyAnswer: boolean;
  hasPartnerAnswer: boolean;
  isUnlocked: boolean;
  myAnswer: string | null;
  partnerAnswer: string | null;
  partnerName: string;
}

export default function DailyQuestionWidget() {
  const [data, setData] = useState<DailyState | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDaily = async () => {
    try {
      const res = await fetch("/api/daily");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.myAnswer) setInputAnswer(json.myAnswer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: inputAnswer.trim() }),
      });

      if (res.ok) {
        await fetchDaily();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="w-full max-w-sm mx-auto px-6 my-4">
        <div className="w-full h-36 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4 my-6">
      <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-sm relative overflow-hidden">
        
        {/* Subtle romantic corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand)]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Badge & Date */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[var(--color-brand)]">
            <Sparkles size={13} />
            <span className="text-[9px] uppercase tracking-[0.25em] font-semibold">
              Daily Check-in
            </span>
          </div>
          <span className="text-[10px] text-[var(--color-muted)] font-mono">
            Hari Ini
          </span>
        </div>

        {/* The Daily Question */}
        <h3 className="text-[14px] font-medium text-[var(--color-foreground)] leading-snug mb-5">
          "{data.question}"
        </h3>

        {/* State 1: Both Answered (Unlocked!) */}
        {data.isUnlocked ? (
          <div className="flex flex-col gap-3">
            {/* My Answer */}
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[var(--color-border)]/80">
              <span className="text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-medium block mb-1">
                Jawabanmu:
              </span>
              <p className="text-[12px] text-[var(--color-foreground)] italic leading-relaxed">
                "{data.myAnswer}"
              </p>
            </div>

            {/* Partner's Answer */}
            <div className="p-3.5 rounded-2xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 relative">
              <div className="flex items-center gap-1 mb-1 text-[var(--color-brand)]">
                <Heart size={10} fill="currentColor" />
                <span className="text-[9px] uppercase tracking-wider font-semibold">
                  Jawaban {data.partnerName}:
                </span>
              </div>
              <p className="text-[12px] text-[var(--color-foreground)] italic leading-relaxed">
                "{data.partnerAnswer}"
              </p>
            </div>

            <p className="text-[9px] text-center text-[var(--color-brand)] font-medium mt-1">
              ✨ Jawaban hari ini telah terbuka untuk kalian berdua!
            </p>
          </div>
        ) : data.hasMyAnswer ? (
          /* State 2: I have answered, waiting for partner */
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[var(--color-border)]/80">
              <span className="text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-medium block mb-1">
                Jawabanmu (Tersimpan):
              </span>
              <p className="text-[12px] text-[var(--color-foreground)] italic leading-relaxed">
                "{data.myAnswer}"
              </p>
            </div>

            {/* Locked Partner Card */}
            <div className="p-4 rounded-2xl bg-stone-100/80 border border-dashed border-stone-300 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center">
                  <Lock size={14} />
                </div>
                <div>
                  <h4 className="text-[11px] font-medium text-[var(--color-foreground)] leading-tight">
                    Jawaban {data.partnerName} Terkunci
                  </h4>
                  <p className="text-[9px] text-[var(--color-muted)] mt-0.5">
                    {data.hasPartnerAnswer
                      ? `${data.partnerName} sudah menjawab! Membuka...`
                      : `Menunggu ${data.partnerName} menjawab hari ini...`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* State 3: User hasn't answered yet */
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <textarea
              rows={2}
              placeholder="Tuliskan jawaban tulusmu hari ini..."
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              className="w-full bg-white/90 border border-[var(--color-border)] rounded-2xl p-3 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] resize-none transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !inputAnswer.trim()}
              className="w-full py-2.5 bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Send size={11} />
              <span>{isSubmitting ? "Menyimpan..." : "Kirim Jawaban Hari Ini"}</span>
            </button>
            <p className="text-[8px] text-[var(--color-muted)] text-center italic mt-0.5">
              🔒 Jawaban pasanganmu baru akan terbuka setelah kalian berdua sama-sama menjawab.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
