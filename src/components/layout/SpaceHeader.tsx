"use client";
import { useState } from "react";
import { Copy, Check, LogOut, Users, User, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import EditProfileModal from "@/components/profile/EditProfileModal";

interface UserProfile {
  id: string;
  name: string;
  city: string | null;
  avatarUrl?: string | null;
}

interface Props {
  inviteCode: string;
  isWaiting?: boolean;
  currentUser?: UserProfile | null;
}

export default function SpaceHeader({ inviteCode, isWaiting, currentUser }: Props) {
  const [copied, setCopied] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (
      confirm(
        "Ingin keluar dari sesi ruang ini? Kamu bisa masuk kembali kapan saja dengan memasukkan kode undangan dan namamu."
      )
    ) {
      await fetch("/api/space/leave", { method: "POST" });
      router.refresh();
    }
  };

  return (
    <div className="w-full px-6 pt-5 flex items-center justify-between text-[10px]">
      {/* Left: Invite Code Pill */}
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
          isWaiting
            ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-medium animate-pulse"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] shadow-xs"
        }`}
        title="Klik untuk salin kode pasangan"
      >
        <Users size={11} />
        <span className="tracking-wider uppercase font-mono">{inviteCode}</span>
        {copied ? (
          <Check size={11} className="text-emerald-600 ml-0.5" />
        ) : (
          <Copy size={11} className="ml-0.5 opacity-60" />
        )}
      </button>

      {/* Right: Profile Avatar & Leave Room */}
      <div className="flex items-center gap-2">
        {currentUser && (
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:border-[var(--color-brand)] transition-all shadow-xs"
            title="Edit Profil & Foto"
          >
            <div className="w-4 h-4 rounded-full overflow-hidden bg-[var(--color-brand)]/20 flex items-center justify-center">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={10} className="text-[var(--color-brand)]" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide max-w-[80px] truncate">
              {currentUser.name}
            </span>
          </button>
        )}

        {/* Switch / Leave Space */}
        <button
          onClick={handleLeave}
          className="p-1.5 rounded-full border border-transparent hover:border-[var(--color-border)] bg-transparent hover:bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all"
          title="Keluar / Ganti Ruang"
        >
          <LogOut size={13} />
        </button>
      </div>

      {/* Profile Modal */}
      {isEditProfileOpen && currentUser && (
        <EditProfileModal
          user={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}
    </div>
  );
}

