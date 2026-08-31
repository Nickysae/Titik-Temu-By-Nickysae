"use client";
import { useState } from "react";
import { Copy, Check, LogOut, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  inviteCode: string;
  isWaiting?: boolean;
}

export default function SpaceHeader({ inviteCode, isWaiting }: Props) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (confirm("Ingin keluar dari ruang ini? Kamu bisa masuk kembali kapan saja dengan kode undangan.")) {
      await fetch("/api/space/leave", { method: "POST" });
      router.refresh();
    }
  };

  return (
    <div className="w-full px-6 pt-5 flex items-center justify-between text-[10px]">
      {/* Invite Code Pill */}
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all ${
          isWaiting
            ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-medium animate-pulse"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
        }`}
        title="Klik untuk salin kode pasangan"
      >
        <Users size={11} />
        <span className="tracking-wider uppercase font-mono">{inviteCode}</span>
        {copied ? <Check size={11} className="text-emerald-600 ml-0.5" /> : <Copy size={11} className="ml-0.5 opacity-60" />}
      </button>

      {/* Switch / Leave Space */}
      <button
        onClick={handleLeave}
        className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
        title="Keluar / Ganti Ruang"
      >
        <LogOut size={12} />
      </button>
    </div>
  );
}
