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
    <div className="min-h-screen bg-stone-200 py-6 px-3 sm:px-6 print:p-0 print:bg-white text-stone-900 font-sans">
      {/* Print Trigger Button Bar */}
      <div className="fixed top-4 right-4 z-50 print:hidden flex items-center gap-3 bg-white/90 backdrop-blur-md border border-stone-300 px-4 py-2 rounded-full shadow-lg">
        <span className="text-[11px] font-semibold text-stone-600 hidden sm:inline">
          💡 Tips: Pilih <strong>Landscape</strong> & Margins <strong>None/Default</strong> saat menyimpan PDF
        </span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-full text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Printer size={15} />
          <span>Cetak / Simpan PDF (A4 Landscape)</span>
        </button>
      </div>

      {/* Global Style for Perfect A4 Landscape Booklet Printing */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .a4-print-sheet {
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 11mm 15mm !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div className="max-w-[297mm] mx-auto flex flex-col gap-8 print:gap-0">

        {/* ========================================================================= */}
        {/* SHEET 1 : ONBOARDING & SETUP                                              */}
        {/* ========================================================================= */}
        <div className="a4-print-sheet bg-white border border-stone-300 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col justify-between w-full lg:w-[297mm] lg:min-h-[210mm] box-border relative overflow-hidden">
          <div>
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#ea580c] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-xs">
                  <Sparkles size={11} />
                  TITIK • TEMU
                </span>
                <span className="text-sm font-extrabold text-stone-900 tracking-tight">
                  Buku Panduan Pengguna (Manual Book)
                </span>
              </div>
              <span className="font-mono text-[11px] font-black text-stone-500 bg-stone-100 px-3 py-1 rounded-md border border-stone-200">
                /// 01 — MEMULAI
              </span>
            </div>

            {/* 2-Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Concept & Highlights */}
              <div className="bg-gradient-to-br from-orange-50 via-amber-50/60 to-orange-100/50 border border-orange-200/90 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-[#ea580c] uppercase tracking-wider mb-1">
                    Ruang Privat Eksklusif 2 Orang
                  </div>
                  <h2 className="text-lg font-serif font-bold text-stone-900 leading-tight mb-2">
                    Jarak Menjadi Cerita,<br />Rindu Menjadi Makna
                  </h2>
                  <p className="text-[11px] text-stone-700 leading-relaxed mb-3">
                    <strong>Titik Temu</strong> adalah web application romantis yang dirancang khusus untuk pasangan pejuang LDR (Long Distance Relationship). Menghubungkan dua insan melalui geolokasi presisi, penghitung hari jadian, amplop rindu berkunci barcode fisik, dan rekapan rute perjalanan.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 bg-white/90 border border-orange-200 rounded-lg p-2.5 shadow-2xs">
                    <Lock size={15} className="text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-stone-900">100% Privat & Terenkripsi</h4>
                      <p className="text-[10px] text-stone-600 leading-snug">Hanya dapat diakses berdua dengan Kode Ruang dan 4-Digit PIN Rahasia.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-white/90 border border-orange-200 rounded-lg p-2.5 shadow-2xs">
                    <MapPin size={15} className="text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-stone-900">Geolokasi Presisi Antar Kota/Desa</h4>
                      <p className="text-[10px] text-stone-600 leading-snug">Kalkulasi kilometer riil antar kedua domisili pasangan secara dinamis.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 bg-white/90 border border-orange-200 rounded-lg p-2.5 shadow-2xs">
                    <Heart size={15} className="text-[#ea580c] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-bold text-stone-900">Kunci Fisik & Amplop Rindu</h4>
                      <p className="text-[10px] text-stone-600 leading-snug">Surat disegel di cloud dan hanya terbuka saat kedua HP bersatu atau scan barcode fisik.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Connection Flow */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-md bg-[#ea580c] text-white flex items-center justify-center text-[10px] font-bold">
                      1
                    </div>
                    <h3 className="text-xs font-bold text-stone-900">
                      Memulai & Menghubungkan Ruang
                    </h3>
                  </div>
                  <p className="text-[10.5px] text-stone-600 mb-3">
                    Ikuti 2 langkah mudah untuk menyatukan ruang cinta kalian berdua:
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-white border border-stone-200 rounded-lg p-2.5">
                    <div className="text-[10.5px] font-bold text-[#ea580c] uppercase tracking-wider mb-1">
                      👤 Langkah A: Pembuat Ruang (Creator)
                    </div>
                    <ol className="list-decimal pl-4 text-[10.5px] text-stone-700 space-y-0.5 leading-snug">
                      <li>Buka website Titik Temu di browser.</li>
                      <li>Ketik <strong>Nama</strong> & <strong>Lokasi/Kota</strong> (contoh: <em>Lamongan</em>).</li>
                      <li>Buat <strong>4-Digit PIN Rahasia</strong> & klik <strong>"Buat Ruang Kita"</strong>.</li>
                      <li>Salin <strong>Kode Ruang</strong> (<code className="bg-stone-100 text-[#ea580c] font-bold px-1 rounded">TEMU-8821</code>) & bagikan ke pasangan beserta PIN.</li>
                    </ol>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-lg p-2.5">
                    <div className="text-[10.5px] font-bold text-[#ea580c] uppercase tracking-wider mb-1">
                      💑 Langkah B: Pasangan (Partner)
                    </div>
                    <ol className="list-decimal pl-4 text-[10.5px] text-stone-700 space-y-0.5 leading-snug">
                      <li>Buka website Titik Temu di HP pasangan kamu.</li>
                      <li>Ketik <strong>Nama</strong> & <strong>Lokasi/Kota</strong> (contoh: <em>Surabaya</em>).</li>
                      <li>Masukkan <strong>Kode Ruang</strong> & <strong>4-Digit PIN</strong>.</li>
                      <li>Klik <strong>"Sambungkan Dua Keping"</strong>. Ruang cinta resmi aktif!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Sheet 1 */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-2 mt-3 text-[9.5px] text-stone-400 font-medium">
            <span>Titik Temu User Guide & Manual Book</span>
            <span>Halaman 1 dari 3 (A4 Landscape)</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHEET 2 : FITUR UTAMA BERANDA & AMPLOP RINDU BARCODE                      */}
        {/* ========================================================================= */}
        <div className="a4-print-sheet bg-white border border-stone-300 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col justify-between w-full lg:w-[297mm] lg:min-h-[210mm] box-border relative overflow-hidden">
          <div>
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#ea580c] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                  ✦ FITUR UTAMA ✦
                </span>
                <span className="text-sm font-extrabold text-stone-900 tracking-tight">
                  2. Menu Beranda (Home) & 3. Amplop Rindu Barcode
                </span>
              </div>
              <span className="font-mono text-[11px] font-black text-stone-500 bg-stone-100 px-3 py-1 rounded-md border border-stone-200">
                /// 02 — FITUR UTAMA
              </span>
            </div>

            {/* 2-Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Home Dashboard Features */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-[#ea580c] text-white flex items-center justify-center text-[10px] font-bold">
                    2
                  </div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Fitur Utama di Menu Beranda (Home)
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="bg-white border-l-3 border-l-[#ea580c] border border-stone-200 rounded-md p-2">
                    <h4 className="text-[11px] font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                      <Calendar size={13} className="text-[#ea580c]" />
                      Days Together & Countdown Pertemuan
                    </h4>
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Menghitung hari kebersamaan secara otomatis sejak tanggal jadian serta menampilkan hitung mundur waktu (hari, jam, menit) menuju jadwal kencan berikutnya.
                    </p>
                  </div>

                  <div className="bg-white border-l-3 border-l-[#ea580c] border border-stone-200 rounded-md p-2">
                    <h4 className="text-[11px] font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                      <MapPin size={13} className="text-[#ea580c]" />
                      Distance Between You Two & Ganti Lokasi
                    </h4>
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Menghitung jarak kilometer riil antar kedua domisili. Tekan tombol <strong>"Ganti Lokasiku"</strong> kapan saja jika salah satu pasangan berpindah kota.
                    </p>
                  </div>

                  <div className="bg-white border-l-3 border-l-[#ea580c] border border-stone-200 rounded-md p-2">
                    <h4 className="text-[11px] font-bold text-stone-900 flex items-center gap-1.5 mb-0.5">
                      <MessageCircle size={13} className="text-[#ea580c]" />
                      Daily Connection Question
                    </h4>
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Satu pertanyaan romantis mendalam setiap hari. Jawaban pasangan baru akan terbuka setelah kalian berdua sama-sama mengisi jawaban hari ini!
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Amplop Rindu & Barcode Physical Lock */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md bg-[#ea580c] text-white flex items-center justify-center text-[10px] font-bold">
                    3
                  </div>
                  <h3 className="text-xs font-bold text-stone-900">
                    Amplop Rindu & Kunci Fisik Barcode
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="bg-white border-l-3 border-l-[#ea580c] border border-stone-200 rounded-md p-2">
                    <h4 className="text-[11px] font-bold text-stone-900 mb-0.5">
                      💌 Menulis Surat & Segel Rahasia Cloud
                    </h4>
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Tulis pesan rindu atau lampirkan foto kenangan. Klik <strong>"Segel Surat"</strong>. Pesan tersimpan rahasia di cloud dan <em>tidak bisa dibaca siapapun</em> sebelum bertemu nyata.
                    </p>
                  </div>

                  <div className="bg-white border-l-3 border-l-[#ea580c] border border-stone-200 rounded-md p-2">
                    <h4 className="text-[11px] font-bold text-stone-900 mb-0.5">
                      🔑 Buka Segel Saat Bertemu (Two Halves)
                    </h4>
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Saat bertemu fisik, klik <strong>"Verify Meeting"</strong>. Pasangan A memilih <em>Belahan Kiri</em> dan Pasangan B memilih <em>Belahan Kanan</em>, satukan layar HP lalu scan untuk membuka surat serentak!
                    </p>
                  </div>

                  <div className="bg-white border-l-3 border-l-[#ea580c] border border-stone-200 rounded-md p-2">
                    <h4 className="text-[11px] font-bold text-stone-900 mb-0.5">
                      🏷️ Desain Kunci Fisik (Vintage Tag & Gantungan Kunci)
                    </h4>
                    <p className="text-[10px] text-stone-600 leading-snug">
                      Di tab <em>Tag Estetik</em>, unduh desain label berisi barcode unik untuk dicetak gantungan kunci akrilik atau casing HP yang bisa dipindai berulang kali setiap kali bertemu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Sheet 2 */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-2 mt-3 text-[9.5px] text-stone-400 font-medium">
            <span>Titik Temu User Guide & Manual Book</span>
            <span>Halaman 2 dari 3 (A4 Landscape)</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHEET 3 : JOURNEY, SECURITY & DEVELOPER SHOWCASE                          */}
        {/* ========================================================================= */}
        <div className="a4-print-sheet bg-white border border-stone-300 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col justify-between w-full lg:w-[297mm] lg:min-h-[210mm] box-border relative overflow-hidden">
          <div>
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b-2 border-stone-100 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#ea580c] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                  ✦ PETUALANGAN & PROFIL ✦
                </span>
                <span className="text-sm font-extrabold text-stone-900 tracking-tight">
                  4. Journey Strava • 5. Keamanan • 6. Tentang Pengembang
                </span>
              </div>
              <span className="font-mono text-[11px] font-black text-stone-500 bg-stone-100 px-3 py-1 rounded-md border border-stone-200">
                /// 03 — CREATOR SPACE
              </span>
            </div>

            {/* Top Row: Journey & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Journey & Strava */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#ea580c] text-white flex items-center justify-center text-[10px] font-bold">
                    4
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Navigation size={13} className="text-[#ea580c]" />
                    Peta Petualangan & Strava LDR (Journey)
                  </h3>
                </div>
                <ul className="text-[10.5px] text-stone-700 space-y-1 pl-4 list-disc leading-snug">
                  <li><strong>Poster Strava LDR:</strong> Menghitung total KM LDR, kecepatan (<em>Pace</em>), dan rute oranye khas Strava. Klik <strong>"Pamerkan / Bagikan"</strong> untuk IG Story & WA.</li>
                  <li><strong>Peta Interaktif & + Plan:</strong> Menampilkan pin rute jalan raya dan jadwalkan tanggal kencan baru dengan jarak otomatis.</li>
                </ul>
              </div>

              {/* Security & Re-Login */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#ea580c] text-white flex items-center justify-center text-[10px] font-bold">
                    5
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#ea580c]" />
                    Keamanan, Privasi & Masuk Kembali
                  </h3>
                </div>
                <ul className="text-[10.5px] text-stone-700 space-y-1 pl-4 list-disc leading-snug">
                  <li><strong>Ganti HP / Browser Baru?</strong> Data kalian aman di database. Pilih menu <strong>"Masuk Kembali ke Ruang"</strong>, masukkan Kode Ruang (<code className="bg-stone-200 text-[#ea580c] px-1 rounded font-bold">TEMU-XXXX</code>), Nama, dan PIN.</li>
                  <li><strong>100% Aman & Terenkripsi:</strong> Surat rindu terkunci aman.</li>
                </ul>
              </div>
            </div>

            {/* Bottom Row: Developer Showcase Card */}
            <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-stone-700 shadow-md">
              <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <img
                  src="/docs/author-photo.jpg"
                  alt="Abdurrosyid Robbani"
                  className="w-16 h-16 rounded-full border-3 border-[#ea580c] object-cover shrink-0 shadow-lg"
                />
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-widest text-orange-300 uppercase mb-1.5">
                    ✦ Developer & Creator ✦
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">
                    Abdurrosyid Robbani
                  </h3>
                  <p className="text-[10.5px] text-stone-300 leading-snug mb-2 max-w-xl">
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
              <div className="bg-white p-2 rounded-lg flex flex-col items-center justify-center text-center shrink-0 shadow-md">
                <img
                  src={QR_DATA_URL}
                  alt="Abdurrosyid Robbani Portfolio QR"
                  className="w-18 h-18 object-contain block"
                />
                <span className="text-[7.5px] font-bold text-stone-900 uppercase tracking-wider mt-1 block">
                  Scan Portfolio
                </span>
              </div>
            </div>
          </div>

          {/* Footer Sheet 3 */}
          <div className="flex items-center justify-between border-t border-stone-200 pt-2 mt-3 text-[9.5px] text-stone-400 font-medium">
            <span>"Jarak hanyalah jeda geografis, cinta kalian adalah garis yang tak pernah putus." — Abdurrosyid Robbani</span>
            <span>Halaman 3 dari 3 (A4 Landscape)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
