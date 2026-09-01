"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake, Sparkles, Copy, Check, ArrowRight, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingFlow() {
  const [view, setView] = useState<"landing" | "create" | "waiting" | "join" | "login">("landing");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/space/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, pin: pin.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat ruang");

      setGeneratedCode(data.inviteCode);
      setView("waiting");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !inviteCodeInput.trim()) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/space/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, inviteCode: inviteCodeInput, pin: pin.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal bergabung");

      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !inviteCodeInput.trim()) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/space/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, inviteCode: inviteCodeInput, pin: pin.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal masuk kembali");

      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishSetup = async () => {
    if (startDate) {
      await fetch("/api/space/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationshipStart: startDate }),
      });
    }
    router.refresh();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickDemo = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/space/demo", {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        {/* 1. Landing / Welcome Screen */}
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-sm flex flex-col items-center py-8"
          >
            <div className="text-5xl mb-6">💌</div>
            <h1 className="text-2xl font-light tracking-wide text-[var(--color-foreground)]">
              Titik Temu
            </h1>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--color-brand)] font-medium mt-2">
              A little place for two people who are far apart.
            </p>
            <p className="text-[13px] text-[var(--color-muted)] font-light mt-6 leading-relaxed max-w-[260px]">
              Dunia kecil privat milik kalian berdua. Menghitung hari, menabung rindu, dan merayakan setiap pertemuan.
            </p>

            <div className="flex flex-col gap-3 w-full mt-10">
              <button
                onClick={() => setView("create")}
                className="w-full py-3.5 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[11px] font-medium tracking-[0.15em] uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Buat Ruang Baru</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => setView("join")}
                className="w-full py-3.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:border-[var(--color-brand)] text-[11px] font-medium tracking-[0.15em] uppercase transition-all"
              >
                <span>Gabung Ruang Pasangan (Kode Baru)</span>
              </button>

              <button
                onClick={() => setView("login")}
                className="w-full py-3.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-brand)]/40 text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10 text-[11px] font-medium tracking-[0.15em] uppercase transition-all"
              >
                <span>🔑 Masuk Kembali ke Ruang Kami</span>
              </button>

              <button
                onClick={handleQuickDemo}
                disabled={isSubmitting}
                className="mt-3 text-[10px] text-[var(--color-muted)] hover:text-[var(--color-brand)] uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Membuka Demo..." : "⚡ Buka Demo Space: Layla & Majnun"}
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. Create Space Form */}
        {view === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm flex flex-col items-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-brand)] mb-4">
              <Sparkles size={20} />
            </div>

            <h2 className="text-xl font-light text-[var(--color-foreground)]">
              Mulai Ruang Baru
            </h2>
            <p className="text-[11px] text-[var(--color-muted)] mt-1 mb-6">
              Langkah 1 dari 2: Identitas & Keamanan Ruang
            </p>

            <form onSubmit={handleCreateSpace} className="w-full flex flex-col gap-4 text-left">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] text-center">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  Nama Kamu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rosyid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  Lokasi / Domisili Kamu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Desa Paciran, Kec. Paciran, Lamongan"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  🔒 4-Digit PIN Rahasia Ruang
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Contoh: 1204"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-[0.4em] text-center text-[var(--color-brand)] outline-none focus:border-[var(--color-brand)] transition-colors"
                  required
                />
                <p className="text-[9px] text-[var(--color-muted)] mt-1">
                  PIN ini akan digunakan kamu dan pasanganmu untuk masuk ke ruang ini.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Membuat Ruang..." : "Dapatkan Kode Undangan"}
              </button>

              <button
                type="button"
                onClick={() => setView("landing")}
                className="text-[10px] text-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase tracking-wider mt-2"
              >
                Kembali
              </button>
            </form>
          </motion.div>
        )}

        {/* 3. Waiting & Invite Code Screen */}
        {view === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm flex flex-col items-center py-6"
          >
            <div className="text-4xl mb-3">🗝️</div>
            <h2 className="text-xl font-light text-[var(--color-foreground)]">
              Ruang Kalian Dibuat!
            </h2>
            <p className="text-[12px] text-[var(--color-muted)] mt-1.5 leading-relaxed max-w-[240px]">
              Kirimkan kode undangan & PIN 4-digit ke pasanganmu agar ia bisa bergabung.
            </p>

            {/* Invite Code Box */}
            <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 my-6 flex flex-col items-center shadow-sm">
              <span className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] mb-1">
                Kode Undangan Pasangan
              </span>
              <span className="text-3xl font-mono font-medium tracking-wider text-[var(--color-brand)] my-2">
                {generatedCode}
              </span>

              {pin && (
                <span className="text-[10px] text-[var(--color-muted)] mt-1 tracking-wider uppercase">
                  PIN Ruang: <strong className="font-mono text-[var(--color-foreground)]">{pin}</strong>
                </span>
              )}

              <button
                onClick={handleCopyCode}
                className="mt-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-background)] border border-[var(--color-border)] text-[10px] uppercase tracking-wider text-[var(--color-foreground)] hover:bg-[var(--color-surface)] transition-all"
              >
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
              </button>
            </div>

            {/* Optional Setup */}
            <div className="w-full text-left bg-[var(--color-surface)]/50 border border-[var(--color-border)]/50 rounded-2xl p-4 mb-6">
              <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                Tanggal Mulai Hubungan (Jadian)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)]"
              />
            </div>

            <button
              onClick={handleFinishSetup}
              className="w-full py-3.5 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all shadow-md"
            >
              Masuk ke Ruang Kita
            </button>
          </motion.div>
        )}

        {/* 4. Join Space Form */}
        {view === "join" && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-sm flex flex-col items-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-brand)] mb-4">
              <HeartHandshake size={20} />
            </div>

            <h2 className="text-xl font-light text-[var(--color-foreground)]">
              Gabung Ruang Pasangan
            </h2>
            <p className="text-[11px] text-[var(--color-muted)] mt-1 mb-6">
              Masukkan kode undangan & PIN dari pasanganmu
            </p>

            <form onSubmit={handleJoinSpace} className="w-full flex flex-col gap-4 text-left">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] text-center">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  Nama Kamu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Nara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  Lokasi / Domisili Kamu
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surabaya"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  Kode Undangan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TEMU-XXXX"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-widest text-[var(--color-brand)] outline-none focus:border-[var(--color-brand)] transition-colors text-center"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  🔒 PIN Ruang (4 Digit)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-[0.4em] text-center text-[var(--color-brand)] outline-none focus:border-[var(--color-brand)] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Menghubungkan..." : "Sambungkan Dua Keping"}
              </button>

              <button
                type="button"
                onClick={() => setView("landing")}
                className="text-[10px] text-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase tracking-wider mt-2"
              >
                Kembali
              </button>
            </form>
          </motion.div>
        )}

        {/* 5. Re-Login Form */}
        {view === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm flex flex-col items-center py-6"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-brand)] mb-4">
              <span className="text-xl">🔑</span>
            </div>

            <h2 className="text-xl font-light text-[var(--color-foreground)]">
              Masuk Kembali ke Ruang
            </h2>
            <p className="text-[11px] text-[var(--color-muted)] mt-1 mb-6">
              Masukkan kode ruang, nama terdaftar, dan 4-digit PIN
            </p>

            <form onSubmit={handleLoginSpace} className="w-full flex flex-col gap-4 text-left">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] text-center leading-relaxed">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  Kode Undangan Ruang
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TEMU-XXXX"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-widest text-[var(--color-brand)] outline-none focus:border-[var(--color-brand)] transition-colors text-center"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  Nama Kamu (yang terdaftar di ruang)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rosyid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
                  🔒 PIN Ruang (4 Digit)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono tracking-[0.4em] text-center text-[var(--color-brand)] outline-none focus:border-[var(--color-brand)] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-[0.2em] uppercase transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Membuka Pintu..." : "Buka Ruang Kita"}
              </button>

              <button
                type="button"
                onClick={() => setView("landing")}
                className="text-[10px] text-center text-[var(--color-muted)] hover:text-[var(--color-foreground)] uppercase tracking-wider mt-2"
              >
                Kembali
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
