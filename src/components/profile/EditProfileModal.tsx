"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Camera, Loader2, Check, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  city: string | null;
  avatarUrl?: string | null;
}

interface Props {
  user: UserData;
  onClose: () => void;
}

// Client-side image compress to square max 400x400
async function compressAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        const canvas = document.createElement("canvas");
        const targetDim = 400;
        canvas.width = targetDim;
        canvas.height = targetDim;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, startX, startY, size, size, 0, 0, targetDim, targetDim);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditProfileModal({ user, onClose }: Props) {
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressAvatar(file);
      setAvatarPreview(compressed);
    } catch (err) {
      console.error("Avatar compression error:", err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim() || null,
          avatarUrl: avatarPreview,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      onClose();
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]/60 mb-5">
          <h3 className="text-sm font-medium tracking-wide uppercase text-[var(--color-foreground)]">
            Pengaturan Profil
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--color-background)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] flex items-center justify-center transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] text-center">
              {errorMsg}
            </div>
          )}

          {/* Avatar Upload Area */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-full border-2 border-[var(--color-border)] overflow-hidden bg-[var(--color-background)] flex items-center justify-center shadow-inner">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon size={32} className="text-[var(--color-muted)]/60" />
                )}
              </div>

              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                {isCompressing ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
              </div>

              <button
                type="button"
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[var(--color-brand)] text-stone-950 flex items-center justify-center shadow-md"
              >
                <Camera size={11} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />

            <span className="text-[10px] text-[var(--color-muted)] tracking-wider uppercase">
              {isCompressing ? "Memproses foto..." : "Ganti Foto Profil"}
            </span>
          </div>

          {/* Name Field */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              Nama Kamu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
              required
            />
          </div>

          {/* City Field */}
          <div>
            <label className="text-[9px] uppercase tracking-widest text-[var(--color-muted)] block mb-1.5 font-medium">
              Kota Domisili
            </label>
            <input
              type="text"
              value={city}
              placeholder="Contoh: Bandung"
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-foreground)] outline-none focus:border-[var(--color-brand)] transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] text-[10px] font-medium tracking-wider uppercase transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving || isCompressing || !name.trim()}
              className="flex-1 py-3 rounded-full bg-[var(--color-foreground)] text-white hover:bg-[var(--color-brand)] text-[10px] font-medium tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={12} />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
