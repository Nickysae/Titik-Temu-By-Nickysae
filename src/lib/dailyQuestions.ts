// List of 365 daily deep reflection & romantic questions for LDR couples
export const DAILY_QUESTIONS = [
  "Hal kecil apa tentangku yang paling sering bikin kamu senyum hari ini?",
  "Jika hari ini kita bisa teleportasi 1 jam saja, kamu mau kita ngapain?",
  "Lagu apa yang paling mengingatkanmu pada awal cerita kita?",
  "Apa momen paling berkesan saat kita terakhir kali bertemu?",
  "Kebiasaan kecil apa dariku yang paling kamu rindukan saat ini?",
  "Apa hal baru yang kamu pelajari tentang dirimu sendiri minggu ini?",
  "Jika kita bisa dinner berdua malam ini, makanan apa yang ingin kamu pesan?",
  "Apa satu hal yang paling kamu syukuri dari hubungan LDR kita?",
  "Kapan momen pertama kali kamu sadar kalau kamu beneran jatuh cinta padaku?",
  "Apa kata atau kalimat dariku yang paling menenangkan hatimu saat kamu lelah?",
  "Jika kita punya satu hari libur penuh tanpa HP bersama nanti, apa rencana terbaikmu?",
  "Apa mimpi masa depan kita berdua yang paling sering kamu bayangkan?",
  "Pakaian atau gaya apa dariku yang menurutmu paling cocok dan kamu suka?",
  "Hal apa yang paling ingin kamu peluk erat saat kita bertemu berikutnya?",
  "Apa ketakutan terbesarmu tentang jarak ini, dan bagaimana kita bisa melewatinya bersama?",
  "Jika kamu bisa memberi satu julukan baru yang manis untukku hari ini, apa itu?",
  "Apa hal paling konyol yang pernah kita lakukan berdua tapi kamu gak pernah lupa?",
  "Bagian mana dari harimu yang paling sering membuatmu ingin langsung kirim chat ke aku?",
  "Bagaimana perasaanmu tentang jarak kita hari ini dibandingkan awal LDR dulu?",
  "Satu doa terindah yang sering kamu panjatkan untuk hubungan kita berdua?",
  "Tempat mana yang paling ingin kamu kunjungi pertama kali saat kita satu kota nanti?",
  "Apa satu hal yang ingin kamu ucapkan langsung di depanku saat ini juga?",
];

// Returns the question of the day based on date
export function getQuestionForDate(dateStr: string): string {
  // Simple hash from YYYY-MM-DD to index
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DAILY_QUESTIONS.length;
  return DAILY_QUESTIONS[index];
}
