// lib/sheet.ts
// ดึง FAQ จาก Google Sheet (CSV) + cache ใน memory 60 วินาที

interface FaqCache {
  content: string;
  fetchedAt: number;
}

let cache: FaqCache | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 วินาที

export async function getFaqCsv(): Promise<string> {
  const now = Date.now();

  // ถ้า cache ยังไม่หมดอายุ → ใช้ cache เลย
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    console.log("[sheet] cache hit");
    return cache.content;
  }

  const url = process.env.SHEET_CSV_URL;
  if (!url) {
    console.error("[sheet] SHEET_CSV_URL is not set");
    return "";
  }

  try {
    console.log("[sheet] fetching fresh FAQ from Google Sheet...");
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const text = await res.text();

    // อัปเดต cache
    cache = { content: text, fetchedAt: now };
    console.log(`[sheet] fetched OK — ${text.length} chars`);
    return text;
  } catch (err) {
    console.error("[sheet] fetch failed:", err);
    // ถ้าดึงไม่ได้ แต่มี cache เก่าอยู่ → ใช้ cache เก่าดีกว่าว่างเปล่า
    if (cache) {
      console.warn("[sheet] using stale cache as fallback");
      return cache.content;
    }
    return "";
  }
}
