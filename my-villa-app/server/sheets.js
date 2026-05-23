/**
 * server/sheets.js  (versi Apps Script — GRATIS, tanpa googleapis)
 * ─────────────────────────────────────────────────────────────────
 * Kirim data transaksi ke Google Sheets lewat Apps Script Web App.
 * Tidak perlu install package, tidak perlu service account.
 * ─────────────────────────────────────────────────────────────────
 */

// URL Apps Script Web App — set di file .env
// Contoh: APPS_SCRIPT_URL=https://script.google.com/macros/s/ABC.../exec
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxGyjuSGXr1Q6fVnjLQBDaRzy-odMHuOQOzgPlakMI_Z4FKcUpuGqJXrXGnELmJebBP/exec";

// Token rahasia opsional (harus sama dengan yang di Apps Script Properties)
const SECRET_TOKEN = process.env.APPS_SCRIPT_TOKEN || "trv-secret-24";

// ─── Kirim transaksi ke Google Sheets ────────────────────────────────────────

export const syncToSheets = async (transactions) => {
  // Skip jika URL belum dikonfigurasi
  if (!APPS_SCRIPT_URL) return;

  try {
    const payload = {
      transactions,
      token: SECRET_TOKEN || undefined,
    };

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Timeout 10 detik agar tidak blok terlalu lama
      signal: AbortSignal.timeout(10_000),
    });

    const result = await response.json().catch(() => ({}));

    if (result.ok) {
      console.log(`[Sheets] ✓ ${result.message || "Sync berhasil"}`);
    } else {
      console.error(`[Sheets] ✗ ${result.error || "Sync gagal"}`);
    }
  } catch (err) {
    // Jangan crash app — cukup log
    if (err.name === "TimeoutError") {
      console.error("[Sheets] ✗ Timeout — Apps Script tidak merespons dalam 10 detik");
    } else {
      console.error(`[Sheets] ✗ ${err.message}`);
    }
  }
};

// ─── Sync saat server pertama kali jalan ──────────────────────────────────────

export const syncOnStartup = (transactions) => {
  if (!APPS_SCRIPT_URL) return;
  setTimeout(() => {
    syncToSheets(transactions).catch(() => {});
  }, 3000);
};