"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, QrCode, Camera, X, Smartphone, RefreshCw } from "lucide-react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
}

export default function TwoHalvesModal({ isOpen, onClose, partnerName }: Props) {
  const [tab, setTab] = useState<"my-half" | "scan-unite">("my-half");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [role, setRole] = useState<"LEFT" | "RIGHT">("LEFT");
  const [verifyState, setVerifyState] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [cameraActive, setCameraActive] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  // Generate QR Code data for this couple's lock
  useEffect(() => {
    if (!isOpen) return;

    async function generateKey() {
      try {
        // Fetch current session info
        const res = await fetch("/api/daily"); // session ping
        // Create verification payload
        const payload = JSON.stringify({
          app: "titik-temu",
          action: "UNLOCK_RINDU_JAR",
          timestamp: Date.now(),
        });

        const url = await QRCode.toDataURL(payload, {
          width: 320,
          margin: 1,
          color: {
            dark: "#1c1917",
            light: "#ffffff",
          },
          errorCorrectionLevel: "H", // High redundancy allows split rendering
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error("QR Generate error:", err);
      }
    }

    generateKey();
  }, [isOpen]);

  // Video scanner loop
  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    async function startCamera() {
      if (tab !== "scan-unite" || !cameraActive) return;
      try {
        setStreamError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play();
          scanFrame();
        }
      } catch (err: any) {
        console.error("Camera error:", err);
        setStreamError("Tidak dapat mengakses kamera. Pastikan izin kamera aktif.");
      }
    }

    function scanFrame() {
      if (
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data) {
            try {
              const parsed = JSON.parse(code.data);
              if (parsed.app === "titik-temu" && parsed.action === "UNLOCK_RINDU_JAR") {
                triggerSuccess();
                return; // Stop scanning
              }
            } catch (e) {
              // Not JSON, continue scanning
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(scanFrame);
    }

    if (cameraActive && tab === "scan-unite") {
      startCamera();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraActive, tab]);

  const triggerSuccess = async () => {
    setVerifyState("success");
    setCameraActive(false);

    // Fire romantic gold & orange confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ea580c", "#c9a27e", "#f59e0b", "#ec4899"],
    });

    try {
      await fetch("/api/meeting/verify", { method: "POST" });
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      onClose();
      router.refresh();
    }, 2800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center mb-2">
            <QrCode size={20} />
          </div>
          <h3 className="text-base font-semibold tracking-wide text-[var(--color-foreground)]">
            The Two-Halves QR Seal
          </h3>
          <p className="text-[11px] text-[var(--color-muted)] mt-0.5 leading-relaxed">
            Satukan dua belahan kunci untuk membuka Amplop Rindu.
          </p>
        </div>

        {/* Tab Selector: My Half vs Scan Unite */}
        <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-1 rounded-full mb-5">
          <button
            onClick={() => {
              setTab("my-half");
              setCameraActive(false);
            }}
            className={`flex-1 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-medium transition-all ${
              tab === "my-half"
                ? "bg-[var(--color-foreground)] text-white shadow-sm"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Belahan Kuncimu
          </button>
          <button
            onClick={() => {
              setTab("scan-unite");
              setCameraActive(true);
            }}
            className={`flex-1 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-medium transition-all ${
              tab === "scan-unite"
                ? "bg-[#ea580c] text-white shadow-sm"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Scan & Satukan
          </button>
        </div>

        {/* TAB 1: Display Split Half QR Code */}
        {tab === "my-half" && (
          <div className="flex flex-col items-center">
            {/* Split Selector (Left Half vs Right Half) */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-medium">
                Pilih Sisi Layarmu:
              </span>
              <button
                onClick={() => setRole("LEFT")}
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider transition-all ${
                  role === "LEFT"
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                Kiri
              </button>
              <button
                onClick={() => setRole("RIGHT")}
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wider transition-all ${
                  role === "RIGHT"
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                Kanan
              </button>
            </div>

            {/* Split QR Visual Container */}
            <div className="w-52 h-52 bg-white rounded-3xl p-3 shadow-md border-2 border-stone-200 relative overflow-hidden flex items-center justify-center">
              {qrDataUrl ? (
                <div
                  className="w-full h-full relative overflow-hidden"
                  style={{
                    clipPath:
                      role === "LEFT"
                        ? "inset(0 50% 0 0 round 16px 0 0 16px)"
                        : "inset(0 0 0 50% round 0 16px 16px 0)",
                  }}
                >
                  <img
                    src={qrDataUrl}
                    alt="Split QR Seal"
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle jagged glowing edge along the cut */}
                  <div
                    className={`absolute top-0 bottom-0 w-[2px] bg-orange-500 shadow-[0_0_8px_#ea580c] ${
                      role === "LEFT" ? "right-[50%]" : "left-[50%]"
                    }`}
                  />
                </div>
              ) : (
                <div className="animate-spin text-[var(--color-brand)]">
                  <RefreshCw size={24} />
                </div>
              )}
            </div>

            {/* Instruction Card */}
            <div className="mt-4 p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                <Smartphone size={16} />
              </div>
              <p className="text-[10px] text-[var(--color-muted)] leading-relaxed text-left">
                Minta <strong className="text-[var(--color-foreground)]">{partnerName}</strong> memilih sisi berlawanan, lalu tempelkan kedua HP sejajar di atas meja!
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Camera Scanner to Detect United QR */}
        {tab === "scan-unite" && (
          <div className="flex flex-col items-center">
            <div className="w-full h-56 rounded-3xl bg-black relative overflow-hidden flex items-center justify-center border border-stone-800">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Target */}
              {verifyState === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 border-2 border-dashed border-orange-400/80 rounded-2xl animate-pulse relative">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-500" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-500" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-orange-500" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-orange-500" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-white/80 bg-black/50 px-2 py-0.5 rounded-full mt-2">
                    Arahkan ke Dua HP yang Bersatu
                  </span>
                </div>
              )}

              {/* Success Overlay */}
              {verifyState === "success" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-white p-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-sm font-semibold tracking-wide">Dua Belahan Bersatu!</h4>
                  <p className="text-[11px] text-emerald-200 mt-1 italic">
                    "Segel terpecah, surat rindu terbuka."
                  </p>
                </motion.div>
              )}

              {streamError && (
                <div className="absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-[11px] text-rose-400 mb-3">{streamError}</p>
                  <button
                    onClick={triggerSuccess}
                    className="text-[10px] bg-orange-600 text-white px-3 py-1.5 rounded-full uppercase tracking-wider"
                  >
                    Simulasikan Penyatuan (Bypass)
                  </button>
                </div>
              )}
            </div>

            {/* Quick manual unlock fallback if camera unavailable */}
            <button
              onClick={triggerSuccess}
              className="mt-3 text-[10px] uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Atau klik di sini untuk langsung satukan kunci ⚡
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
