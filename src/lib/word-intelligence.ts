// Word Intelligence Library - 100% offline, rule-based CV enhancement

export const WEAK_TO_STRONG: Record<string, string> = {
  "bertanggung jawab atas": "Mengelola",
  "bertanggung jawab untuk": "Mengelola",
  "bertanggung jawab dalam": "Mengelola",
  "membantu dalam": "Mendukung",
  "membantu proses": "Memfasilitasi",
  "ikut serta dalam": "Berpartisipasi dalam",
  "ikut membantu": "Berkontribusi dalam",
  "terlibat dalam": "Mengkoordinasikan",
  "melakukan tugas": "Mengeksekusi",
  "mengerjakan": "Menyelesaikan",
  "ngurusin": "Mengelola",
  "handle": "Menangani",
  "maintain": "Memelihara",
  "nge-manage": "Mengelola",
  "bikin": "Membuat",
  "ngedesain": "Mendesain",
  "follow up": "Menindaklanjuti",
  "dealing with": "Menangani",
  "in charge of": "Memimpin",
  "membantu": "Mendukung",
  "kerja sama": "Berkolaborasi dengan",
  "ngajar": "Melatih",
};

export const REMOVE_PHRASES: string[] = [
  "pekerja keras",
  "kerja keras",
  "jujur dan disiplin",
  "saya orangnya",
  "dapat bekerja di bawah tekanan",
  "mampu bekerja dalam tim",
  "good looking",
  "siap ditempatkan di mana saja",
];

export const POWER_VERBS: string[] = [
  "Memimpin", "Mengelola", "Mengembangkan", "Merancang",
  "Mengimplementasikan", "Meningkatkan", "Mengoptimalkan",
  "Mengkoordinasikan", "Membangun", "Meluncurkan",
  "Menganalisis", "Memproduksi", "Menegosiasikan",
  "Mengawasi", "Menyusun", "Melatih", "Mengamankan",
  "Mempercepat", "Menghemat", "Mengurangi",
];

export interface Change {
  type: 'replace' | 'remove' | 'suggest';
  original: string;
  replacement: string;
  reason: string;
}

export interface EnhanceResult {
  original: string;
  enhanced: string;
  changes: Change[];
  warnings: string[];
  atsScore: number;
}

export function enhanceDescription(raw: string): EnhanceResult {
  let enhanced = raw;
  const changes: Change[] = [];
  const warnings: string[] = [];

  // 1. REPLACE kata lemah (sort by length desc to match longer phrases first)
  const sortedEntries = Object.entries(WEAK_TO_STRONG).sort((a, b) => b[0].length - a[0].length);
  for (const [weak, strong] of sortedEntries) {
    const regex = new RegExp(weak.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(enhanced)) {
      changes.push({
        type: 'replace',
        original: weak,
        replacement: strong,
        reason: `"${weak}" diganti ke verb aksi yang lebih kuat`,
      });
      enhanced = enhanced.replace(regex, strong);
    }
  }

  // 2. REMOVE frasa kosong
  for (const phrase of REMOVE_PHRASES) {
    const regex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(enhanced)) {
      changes.push({
        type: 'remove',
        original: phrase,
        replacement: '',
        reason: `"${phrase}" bukan achievement terukur — dihapus`,
      });
      enhanced = enhanced.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
    }
  }

  // 3. CHECK: ada angka/metrik?
  const hasNumbers = /\d/.test(enhanced);
  if (!hasNumbers) {
    warnings.push('Belum ada angka/metrik. Tambahkan: berapa orang? berapa project? berapa persen peningkatan? berapa bulan?');
  }

  // 4. CHECK: mulai dengan verb aksi?
  const firstWord = enhanced.split(' ')[0];
  const startsWithVerb = POWER_VERBS.some(v => firstWord.toLowerCase() === v.toLowerCase());
  if (!startsWithVerb && enhanced.length > 0) {
    warnings.push(`Mulai kalimat dengan verb aksi (contoh: ${POWER_VERBS.slice(0, 5).join(', ')})`);
  }

  // 5. CHECK: terlalu panjang?
  if (enhanced.length > 150) {
    warnings.push('Terlalu panjang. Ideal: max 1-2 baris (100-150 karakter).');
  }

  // 6. CAPITALIZE verb pertama
  if (enhanced.length > 0) {
    enhanced = enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
  }

  // 7. HITUNG ATS score sederhana
  let score = 50;
  if (hasNumbers) score += 20;
  if (startsWithVerb) score += 15;
  if (enhanced.length <= 150) score += 10;
  if (changes.filter(c => c.type === 'remove').length === 0) score += 5;

  return { original: raw, enhanced, changes, warnings, atsScore: Math.min(score, 100) };
}

export function splitToBullets(text: string): string[] {
  return text
    .split(/[\n;]|(?<=\.)\s/)
    .map(s => s.replace(/^[•\-\*]\s*/, '').trim())
    .filter(s => s.length > 10)
    .map(s => {
      const result = enhanceDescription(s);
      return result.enhanced;
    });
}

export function enhanceBullets(text: string): { bullets: EnhanceResult[]; overallScore: number } {
  const lines = text
    .split(/[\n;]|(?:^|\n)[•\-\*]\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  const bullets = lines.map(line => enhanceDescription(line));
  const overallScore = bullets.length > 0
    ? Math.round(bullets.reduce((sum, b) => sum + b.atsScore, 0) / bullets.length)
    : 0;

  return { bullets, overallScore };
}
