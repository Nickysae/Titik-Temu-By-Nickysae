"use client";
import React from "react";
import { Printer, ExternalLink, Sparkles, Lock, MapPin, Heart, Calendar, MessageCircle, Navigation, ShieldCheck } from "lucide-react";

const QR_DATA_URL = "data:image/png;base64,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";

export default function ManualBookPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-3 sm:px-6 print:p-0 print:bg-white text-stone-800 font-sans">
      {/* Floating Print Button Bar */}
      <div className="fixed top-4 right-4 z-50 print:hidden flex items-center gap-3 bg-white/95 backdrop-blur-md border border-stone-300 px-4 py-2 rounded-full shadow-xl">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Printer size={15} />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Global CSS for Multi-Page Printing Without Clipping */}
      <style>{`
        @page {
          size: auto;
          margin: 12mm 14mm 12mm 14mm;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .manual-page {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            box-sizing: border-box !important;
          }
          .manual-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="max-w-[780px] mx-auto flex flex-col gap-8 print:gap-10">

        {/* ========================================================================= */}
        {/* PAGE 1 : OVERVIEW, PHILOSOPHY & SECTION 1 CONNECTION                      */}
        {/* ========================================================================= */}
        <div className="manual-page bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header Hero */}
            <div className="text-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/60 border border-orange-200 rounded-2xl p-6 sm:p-7 mb-6 relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 bg-white border border-orange-300 px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-[0.2em] text-[#ea580c] uppercase mb-2.5 shadow-2xs">
                <Sparkles size={11} />
                <span>TITIK • TEMU</span>
                <Sparkles size={11} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1.5">
                Buku Panduan Pengguna
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Jarak Menjadi Cerita, Rindu Menjadi Makna — Panduan Lengkap Ruang Privat Pasangan LDR
              </p>
            </div>

            {/* Core Concept Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6 avoid-break">
              <div className="text-[10px] font-extrabold text-[#ea580c] uppercase tracking-wider mb-1">
                Ruang Privat Eksklusif 2 Orang
              </div>
              <p className="text-xs text-stone-700 leading-relaxed mb-3">
                <strong>Titik Temu</strong> adalah web application romantis yang dirancang khusus untuk pasangan pejuang LDR (Long Distance Relationship). Menghubungkan dua insan melalui geolokasi presisi, penghitung hari jadian, amplop rindu berkunci barcode fisik, dan rekapan rute perjalanan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="bg-white border border-stone-200 rounded-lg p-2.5 flex items-start gap-2">
                  <Lock size={14} className="text-[#ea580c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[11px] font-bold text-stone-900 block">100% Privat</strong>
                    <span className="text-[10px] text-stone-600 leading-tight block">Terenkripsi dengan PIN Rahasia.</span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg p-2.5 flex items-start gap-2">
                  <MapPin size={14} className="text-[#ea580c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[11px] font-bold text-stone-900 block">Geolokasi Presisi</strong>
                    <span className="text-[10px] text-stone-600 leading-tight block">Hitung jarak KM riil antar kota.</span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-lg p-2.5 flex items-start gap-2">
                  <Heart size={14} className="text-[#ea580c] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[11px] font-bold text-stone-900 block">Kunci Fisik Barcode</strong>
                    <span className="text-[10px] text-stone-600 leading-tight block">Segel surat dibuka saat bertemu.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Memulai & Menghubungkan */}
            <div className="avoid-break">
              <div className="flex items-center gap-2.5 border-b border-stone-200 pb-2 mb-3.5">
                <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  Memulai & Menghubungkan Ruang Pasangan
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                  <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-1.5">
                    Langkah A: Pembuat Ruang (Creator)
                  </h4>
                  <ol className="list-decimal pl-4 text-xs text-stone-700 space-y-1 leading-snug">
                    <li>Buka website Titik Temu di browser kamu.</li>
                    <li>Ketik <strong>Nama</strong> & <strong>Lokasi/Kota</strong> (contoh: <em>Lamongan</em>).</li>
                    <li>Buat <strong>4-Digit PIN Rahasia</strong> & klik <strong>"Buat Ruang Kita"</strong>.</li>
                    <li>Salin <strong>Kode Ruang</strong> (<code className="bg-stone-200 text-[#ea580c] px-1 rounded font-bold">TEMU-8821</code>) & bagikan ke pasangan beserta PIN.</li>
                  </ol>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                  <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-1.5">
                    Langkah B: Pasangan (Partner)
                  </h4>
                  <ol className="list-decimal pl-4 text-xs text-stone-700 space-y-1 leading-snug">
                    <li>Buka website Titik Temu di HP pasangan kamu.</li>
                    <li>Ketik <strong>Nama</strong> & <strong>Lokasi/Kota</strong> (contoh: <em>Surabaya</em>).</li>
                    <li>Masukkan <strong>Kode Ruang</strong> & <strong>4-Digit PIN</strong>.</li>
                    <li>Klik <strong>"Sambungkan Dua Keping"</strong>. Ruang cinta resmi aktif!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Page 1 */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-3 mt-6 text-[10px] text-stone-400 font-medium">
            <span>Titik Temu User Guide — Halaman 1</span>
            <span>Manual Book</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAGE 2 : SECTIONS 2 & 3 (HOME FEATURES & BARCODE AMPLOP RINDU)            */}
        {/* ========================================================================= */}
        <div className="manual-page bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header Mini */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5 mb-6">
              <span className="text-xs font-black tracking-widest text-[#ea580c] uppercase">
                ✦ FITUR UTAMA & KUNCI FISIK ✦
              </span>
              <span className="text-xs font-bold text-stone-400">
                Halaman 2
              </span>
            </div>

            {/* 2. Menu Home */}
            <div className="mb-6 avoid-break">
              <div className="flex items-center gap-2.5 border-b border-stone-200 pb-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  Fitur Utama di Menu Beranda (Home)
                </h2>
              </div>

              <div className="space-y-2.5">
                <div className="bg-stone-50 border-l-3 border-l-[#ea580c] border border-stone-200 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                    <Calendar size={14} className="text-[#ea580c]" />
                    Days Together & Countdown Pertemuan
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Menghitung hari kebersamaan secara otomatis sejak tanggal jadian serta menampilkan hitung mundur waktu (hari, jam, menit) menuju jadwal kencan berikutnya.
                  </p>
                </div>

                <div className="bg-stone-50 border-l-3 border-l-[#ea580c] border border-stone-200 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                    <MapPin size={14} className="text-[#ea580c]" />
                    Distance Between You Two & Ganti Lokasi
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Menghitung jarak kilometer riil antar kedua domisili. Tekan tombol <strong>"Ganti Lokasiku"</strong> kapan saja jika salah satu pasangan berpindah kota.
                  </p>
                </div>

                <div className="bg-stone-50 border-l-3 border-l-[#ea580c] border border-stone-200 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                    <MessageCircle size={14} className="text-[#ea580c]" />
                    Daily Connection Question
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Satu pertanyaan romantis mendalam setiap hari. Jawaban pasangan baru akan terbuka setelah kalian berdua sama-sama mengisi jawaban hari ini!
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Amplop Rindu & Kunci Fisik Barcode */}
            <div className="avoid-break">
              <div className="flex items-center gap-2.5 border-b border-stone-200 pb-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  Amplop Rindu & Kunci Fisik Barcode
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                  <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-1">
                    💌 Menulis Surat & Segel Cloud
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Tulis pesan atau lampirkan foto kenangan. Klik <strong>"Segel Surat"</strong>. Pesan tersimpan rahasia di cloud dan <em>tidak bisa dibaca siapapun</em> sebelum bertemu nyata.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                  <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-1">
                    🔑 Buka Segel Saat Bertemu (Two Halves)
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Saat bertemu fisik, klik <strong>"Verify Meeting"</strong>. Pasangan A memilih <em>Belahan Kiri</em> dan Pasangan B memilih <em>Belahan Kanan</em>, satukan layar HP lalu scan untuk membuka surat serentak!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-stone-50 border-l-3 border-l-[#ea580c] border border-stone-200 rounded-lg p-2.5">
                  <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                    🏷️ Desain Kunci Fisik (Vintage Tag Gantungan Kunci)
                  </h4>
                  <p className="text-[11.5px] text-stone-600 leading-snug">
                    Di tab <em>Tag Estetik</em>, unduh desain label berisi barcode unik untuk dicetak gantungan kunci akrilik atau casing HP yang bisa dipindai berulang kali setiap kali bertemu.
                  </p>
                </div>

                <div className="bg-stone-50 border-l-3 border-l-[#ea580c] border border-stone-200 rounded-lg p-2.5">
                  <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                    🖼️ Kolase Kenangan & Perpanjang Kunci (+30 Hari)
                  </h4>
                  <p className="text-[11.5px] text-stone-600 leading-snug">
                    Setelah surat terbuka, klik <strong>"Unduh Kolase Kenangan"</strong>. Jika belum sempat bertemu, tekan <strong>"Perpanjang Masa Kunci"</strong> agar kunci fisik tetap aktif tanpa cetak ulang.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Page 2 */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-3 mt-6 text-[10px] text-stone-400 font-medium">
            <span>Titik Temu User Guide — Halaman 2</span>
            <span>Manual Book</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PAGE 3 : SECTIONS 4, 5 & DEVELOPER PROFILE SHOWCASE (SECTION 6)           */}
        {/* ========================================================================= */}
        <div className="manual-page bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header Mini */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2.5 mb-6">
              <span className="text-xs font-black tracking-widest text-[#ea580c] uppercase">
                ✦ JOURNEY, KEAMANAN & PENGEMBANG ✦
              </span>
              <span className="text-xs font-bold text-stone-400">
                Halaman 3
              </span>
            </div>

            {/* 4. Menu Journey */}
            <div className="mb-5 avoid-break">
              <div className="flex items-center gap-2.5 border-b border-stone-200 pb-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  Peta Petualangan & Strava LDR (Journey)
                </h2>
              </div>

              <div className="space-y-2">
                <div className="bg-stone-50 border-l-3 border-l-[#ea580c] border border-stone-200 rounded-lg p-2.5">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                    <Navigation size={13} className="text-[#ea580c]" />
                    🏃 Poster Strava LDR (Tab Strava)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Menghitung total kilometer LDR, ritme pertemuan (<em>Pace</em>), dan menggambar rute oranye khas Strava di antara kedua kota. Klik <strong>"Simpan Gambar"</strong> atau <strong>"Pamerkan / Bagikan"</strong> untuk diunggah ke Instagram Story atau WhatsApp Status.
                  </p>
                </div>

                <div className="bg-stone-50 border-l-3 border-l-[#ea580c] border border-stone-200 rounded-lg p-2.5">
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                    <MapPin size={13} className="text-[#ea580c]" />
                    🗺️ Peta Interaktif & Rencana Pertemuan (+ Plan)
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Menampilkan titik pin pulau dan rute jalan raya. Tekan tombol <strong>"+ Plan"</strong> di pojok kanan atas untuk menjadwalkan kencan baru lengkap dengan perhitungan jarak otomatis.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Keamanan & Re-Login */}
            <div className="mb-6 avoid-break">
              <div className="flex items-center gap-2.5 border-b border-stone-200 pb-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
                  5
                </div>
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  Keamanan, Privasi & Masuk Kembali
                </h2>
              </div>
              <div className="bg-amber-50/90 border border-dashed border-amber-300 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Ganti Perangkat atau Browser Baru?</strong><br />
                  Data kalian tidak akan pernah hilang. Pada halaman depan, pilih menu <strong>"Masuk Kembali ke Ruang"</strong>, masukkan Kode Ruang (<code className="bg-amber-200 text-amber-900 px-1 rounded font-bold">TEMU-XXXX</code>), Nama terdaftar, dan 4-Digit PIN untuk membuka kembali ruang cinta kalian.
                </div>
              </div>
            </div>

            {/* 6. Tentang Pembuat Aplikasi & Portofolio */}
            <div className="avoid-break">
              <div className="flex items-center gap-2.5 border-b border-stone-200 pb-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
                  6
                </div>
                <h2 className="text-sm sm:text-base font-bold text-stone-900">
                  Tentang Pembuat Aplikasi (About The Developer)
                </h2>
              </div>

              <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-stone-700">
                <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-left">
                  <img
                    src="/docs/author-photo.jpg"
                    alt="Abdurrosyid Robbani"
                    className="w-16 h-16 rounded-full border-2 border-[#ea580c] object-cover shrink-0 shadow-lg"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-orange-300 uppercase mb-1.5">
                      ✦ Developer & Creator ✦
                    </div>
                    <h3 className="text-base font-bold text-white mb-0.5">
                      Abdurrosyid Robbani
                    </h3>
                    <p className="text-[11px] text-stone-300 leading-relaxed mb-2 max-w-md">
                      Aplikasi <strong>Titik Temu</strong> dirancang dan dikembangkan dengan cinta sebagai karya portofolio digital yang memadukan teknologi web modern (Next.js, Tailwind CSS, Supabase, Leaflet), geolokasi presisi, dan pengalaman emosional bermakna untuk pasangan LDR.
                    </p>
                    <a
                      href="https://abdurrosyid-portfolio.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-300 hover:text-orange-200 underline decoration-dashed underline-offset-4"
                    >
                      <span>abdurrosyid-portfolio.vercel.app</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                {/* QR Code Block */}
                <div className="bg-white p-2 rounded-xl flex flex-col items-center justify-center text-center shrink-0 shadow-md">
                  <img
                    src={QR_DATA_URL}
                    alt="Abdurrosyid Robbani Portfolio QR"
                    className="w-20 h-20 object-contain block"
                  />
                  <span className="text-[7.5px] font-bold text-stone-900 uppercase tracking-wider mt-1 block">
                    Scan Portfolio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <footer className="text-center pt-5 mt-6 border-t border-stone-200 font-serif italic text-xs text-stone-500">
            "Jarak hanyalah jeda geografis, cinta kalian adalah garis yang tak pernah putus."<br />
            <strong className="not-italic font-sans text-[11px] text-stone-700 font-semibold mt-1 inline-block">
              Titik Temu App — Created by Abdurrosyid Robbani
            </strong>
          </footer>
        </div>

      </div>
    </div>
  );
}
