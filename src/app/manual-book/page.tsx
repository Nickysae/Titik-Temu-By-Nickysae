"use client";
import React from "react";
import { Printer, Sparkles, Heart, MapPin, QrCode, Lock, Globe, ExternalLink } from "lucide-react";

export default function ManualBookPage() {
  const qrDataUrl = "data:image/png;base64,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";

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800 font-sans p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Print Trigger Button */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-lg transition-all"
        >
          <Printer size={15} />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-stone-200 rounded-3xl p-6 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* Header Hero */}
        <div className="text-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/60 border border-orange-200 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 bg-white border border-orange-300 px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-[0.2em] text-[#ea580c] uppercase mb-3 shadow-xs">
            <Sparkles size={11} />
            <span>TITIK • TEMU</span>
            <Sparkles size={11} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
            Buku Panduan Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Jarak Menjadi Cerita, Rindu Menjadi Makna — Panduan Lengkap Ruang Privat Pasangan LDR
          </p>
        </div>

        {/* 1. Memulai & Menghubungkan */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Memulai & Menghubungkan Ruang Pasangan
            </h2>
          </div>
          <p className="text-xs text-stone-600 mb-3">
            Titik Temu beroperasi sebagai <strong>Private Space 2 Orang</strong> yang dilindungi oleh Kode Ruang Eksklusif dan 4-Digit PIN Rahasia.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3">
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4">
              <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-2">
                Langkah A: Pembuat Ruang (Creator)
              </h4>
              <ol className="list-decimal pl-4 text-xs text-stone-700 space-y-1.5 leading-relaxed">
                <li>Buka website Titik Temu di browser.</li>
                <li>Ketik <strong>Nama</strong> & <strong>Lokasi/Kota</strong> (contoh: <em>Desa Brengkok, Brondong, Lamongan</em>).</li>
                <li>Buat <strong>4-Digit PIN Rahasia</strong> (contoh: <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">1234</code>).</li>
                <li>Klik <strong>"Buat Ruang Kita"</strong>.</li>
                <li>Salin <strong>Kode Ruang</strong> (misal <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px]">TEMU-8821</code>) & bagikan ke pasangan beserta PIN.</li>
              </ol>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4">
              <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-2">
                Langkah B: Pasangan (Partner)
              </h4>
              <ol className="list-decimal pl-4 text-xs text-stone-700 space-y-1.5 leading-relaxed">
                <li>Buka website Titik Temu di HP pasangan.</li>
                <li>Ketik <strong>Nama</strong> & <strong>Lokasi/Kota</strong> kamu.</li>
                <li>Masukkan <strong>Kode Ruang</strong> dari pasangan & <strong>4-Digit PIN</strong>.</li>
                <li>Klik <strong>"Sambungkan Dua Keping"</strong>.</li>
                <li>🎉 Ruang cinta kalian resmi tersambung dan aktif seketika!</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 2. Menu Home */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Fitur Utama di Menu Beranda (Home)
            </h2>
          </div>

          <div className="space-y-2.5">
            <div className="bg-white border-l-4 border-l-[#ea580c] border border-stone-200 rounded-lg p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                ⏳ Days Together & Countdown Pertemuan
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menghitung hari kebersamaan secara otomatis sejak tanggal jadian serta menampilkan hitung mundur menuju jadwal kencan berikutnya.
              </p>
            </div>

            <div className="bg-white border-l-4 border-l-[#ea580c] border border-stone-200 rounded-lg p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                📍 Distance Between You Two & Pindah Kota
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menghitung jarak KM nyata antar desa/kecamatan kalian secara otomatis. Tekan tombol <strong>"Ganti Lokasiku"</strong> kapan saja jika berpindah domisili.
              </p>
            </div>

            <div className="bg-white border-l-4 border-l-[#ea580c] border border-stone-200 rounded-lg p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                💬 Daily Connection Question
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Satu pertanyaan romantis mendalam setiap hari. Jawaban pasangan baru akan terbuka setelah kalian berdua sama-sama mengisi!
              </p>
            </div>
          </div>
        </section>

        {/* 3. Menu Rindu & Barcode */}
        <section className="mb-8 print:break-before-page">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Amplop Rindu & Kunci Fisik Barcode
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3">
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4">
              <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-1.5">
                💌 Menulis Surat & Foto Rindu
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Tulis pesan atau lampirkan foto kenangan. Klik <strong>"Segel Surat"</strong>. Pesan tersimpan rahasia di cloud dan <em>tidak bisa dibaca siapapun</em> sebelum kalian bertemu di dunia nyata.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4">
              <h4 className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider mb-1.5">
                🔑 Buka Segel Saat Bertemu (Two Halves)
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Saat bertemu fisik, klik <strong>"Verify Meeting"</strong>. Pasangan A memilih <em>Belahan Kiri</em> dan Pasangan B memilih <em>Belahan Kanan</em>, satukan layar kedua HP lalu scan untuk membuka amplop serentak!
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="bg-white border-l-4 border-l-[#ea580c] border border-stone-200 rounded-lg p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                🏷️ Desain Kunci Fisik (Vintage Retail Tag)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Di tab <em>Tag Estetik</em>, unduh desain label eksklusif berisi watermark Titik Temu, tanggal jadian, dan barcode unik. Desain siap dicetak untuk gantungan kunci akrilik atau stiker casing HP yang bisa dipindai berulang kali pada setiap pertemuan.
              </p>
            </div>

            <div className="bg-white border-l-4 border-l-[#ea580c] border border-stone-200 rounded-lg p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                🖼️ Kolase Kenangan & Perpanjang Masa Kunci (+30 Hari)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Setelah surat terbuka, tekan <strong>"Buat & Unduh Kolase Kenangan"</strong> untuk mengabadikan seluruh surat & foto ke dalam satu poster kenangan. Jika belum sempat bertemu, tekan <strong>"Perpanjang Masa Kunci"</strong> agar kunci fisik tetap aktif tanpa harus mencetak ulang.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Menu Journey */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
              4
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Peta Petualangan & Strava LDR (Journey)
            </h2>
          </div>

          <div className="space-y-2.5">
            <div className="bg-white border-l-4 border-l-[#ea580c] border border-stone-200 rounded-lg p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                🏃 Poster Strava LDR (Tab Strava)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menghitung total kilometer LDR, ritme pertemuan (<em>Pace</em>), dan menggambar rute oranye khas Strava di antara kedua kota. Klik <strong>"Simpan Gambar"</strong> atau <strong>"Pamerkan / Bagikan"</strong> untuk diunggah ke Instagram Story atau WhatsApp Status.
              </p>
            </div>

            <div className="bg-white border-l-4 border-l-[#ea580c] border border-stone-200 rounded-lg p-3.5">
              <h4 className="text-xs font-bold text-stone-900 mb-0.5">
                🗺️ Peta Interaktif & Rencana Pertemuan (+ Plan)
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menampilkan titik pin pulau dan rute jalan raya. Tekan tombol <strong>"+ Plan"</strong> di pojok kanan atas untuk menjadwalkan kencan baru lengkap dengan perhitungan jarak otomatis.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Keamanan & Re-Login */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold">
              5
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Keamanan, Privasi & Masuk Kembali
            </h2>
          </div>
          <div className="bg-amber-50/80 border border-dashed border-amber-300 rounded-xl p-4 flex items-start gap-3">
            <span className="text-lg">🔒</span>
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Ganti Perangkat atau Browser Baru?</strong><br />
              Data kalian tidak akan pernah hilang. Pada halaman depan, pilih menu <strong>"Masuk Kembali ke Ruang"</strong>, masukkan Kode Ruang (<code className="bg-amber-100 px-1 rounded">TEMU-XXXX</code>), Nama terdaftar, dan 4-Digit PIN untuk membuka kembali ruang cinta kalian.
            </div>
          </div>
        </section>

        {/* 6. Tentang Pembuat Aplikasi & Portofolio */}
        <section className="mb-8">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-2.5 mb-4">
            <div className="w-6 h-6 rounded-lg bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
              6
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Tentang Pembuat Aplikasi (About The Developer)
            </h2>
          </div>

          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-orange-300 uppercase mb-2">
                ✦ Developer & Creator ✦
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Abdur Rosyid
              </h3>
              <p className="text-[11.5px] text-stone-300 leading-relaxed mb-3">
                Aplikasi <strong>Titik Temu</strong> dirancang dan dikembangkan dengan cinta sebagai karya portofolio digital yang memadukan teknologi web modern, geolokasi presisi, dan pengalaman emosional bermakna untuk pasangan LDR.
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

            {/* QR Code Block */}
            <div className="bg-white p-2.5 rounded-xl flex flex-col items-center justify-center text-center shrink-0 shadow-md">
              <img
                src={qrDataUrl}
                alt="Abdur Rosyid Portfolio QR"
                className="w-24 h-24 object-contain block"
              />
              <span className="text-[8px] font-bold text-stone-900 uppercase tracking-wider mt-1 block">
                Scan Portfolio
              </span>
            </div>
          </div>
        </section>

        {/* Footer Quote */}
        <footer className="text-center pt-6 border-t border-stone-200 font-serif italic text-xs text-stone-500">
          "Jarak hanyalah jeda geografis, cinta kalian adalah garis yang tak pernah putus."<br />
          <strong className="not-italic font-sans text-[11px] text-stone-700 font-semibold mt-1 inline-block">
            Titik Temu App — Created by Abdur Rosyid
          </strong>
        </footer>
      </div>
    </div>
  );
}
