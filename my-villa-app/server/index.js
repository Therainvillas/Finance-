// ─── Baca .env (taruh di paling atas, sebelum import lain) ───────────────────
import { readFileSync } from "node:fs";
try {
  const envPath = new URL("../.env", import.meta.url);
  const env = readFileSync(envPath, "utf8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = val;
  }
} catch { /* .env tidak wajib ada */ }

// ─── Imports ──────────────────────────────────────────────────────────────────
import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ✅ Import modul Google Sheets (via Apps Script)
import { syncOnStartup, syncToSheets } from "./sheets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir   = path.resolve(__dirname, "..");
const dataDir   = path.join(__dirname, "data");
const dbPath    = path.join(dataDir, "database.json");
const distDir   = path.join(rootDir, "dist");
const host      = process.env.HOST || "0.0.0.0";
const port      = Number(process.env.PORT || 4174);

// ─── Data Villa ───────────────────────────────────────────────────────────────
const properties = [
  "Villa Donkris", "Villa Arisyfa", "Villa Wanela", "Villa Valora",
  "Villa Lembah Singgah", "Villa Ranna", "Villa Echa", "Villa Rayya",
  "Villa Baduo", "Villa Calmora", "Villa Cempaka", "Villa Cemara",
  "Villa Hala", "Villa 4D", "Villa Aleia", "Villa Awan", "Villa Albi",
  "Villa Opung", "Villa De Summit", "Villa RJS Cottage", "Villa RJS 2",
  "Villa RJS 3", "Villa Arsy", "Villa Jhonsky", "Villa Thmyi",
  "Villa Twins", "Villa Cyrena",
].map((name, index) => ({
  id: index + 1,
  name,
  location: "Indonesia",
  rooms:  [4, 3, 4, 3, 5, 3, 2][index % 7],
  rating: [4.9, 4.8, 4.8, 4.7, 4.9, 4.7, 4.7][index % 7],
}));

// ─── Default Database ─────────────────────────────────────────────────────────
const defaultDb = {
  appName: "Therainvillas",
  settings: {
    companyName: "Therainvillas",
    email: "admin@therainvillas.id",
    timezone: "WIB (UTC+7)",
    currency: "IDR",
  },
  users: [
    {
      email: "admin@therainvillas.id",
      password: "trv123",
      name: "Riki Bahtiar",
      initials: "RB",
      role: "Finance",
    },
  ],
  properties,
  transactions: [
    {
      id: "INC-20260515-A1B2",
      description: "Booking Hiroshi Tanaka",
      villa: "Villa Donkris",
      date: "2026-05-15",
      amount: 12500000,
      type: "Pendapatan",
      status: "Lunas",
      category: "Booking",
      note: "Pembayaran transfer",
      createdAt: "2026-05-15T10:00:00.000Z",
    },
    {
      id: "INC-20260514-C3D4",
      description: "Booking Sarah Mitchell",
      villa: "Villa Arisyfa",
      date: "2026-05-14",
      amount: 8750000,
      type: "Pendapatan",
      status: "Lunas",
      category: "Booking",
      note: "",
      createdAt: "2026-05-14T10:00:00.000Z",
    },
    {
      id: "EXP-20260513-E5F6",
      description: "Tagihan listrik",
      villa: "Villa Donkris",
      date: "2026-05-13",
      amount: 2100000,
      type: "Pengeluaran",
      status: "Lunas",
      category: "Utilitas",
      note: "PLN Mei",
      createdAt: "2026-05-13T10:00:00.000Z",
    },
  ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js",   "text/javascript; charset=utf-8"],
  [".css",  "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png",  "image/png"],
  [".svg",  "image/svg+xml"],
  [".ico",  "image/x-icon"],
]);

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, headers);
  res.end(body);
};

const sendJson = (res, status, data) => {
  send(res, status, JSON.stringify(data), {
    "Content-Type": "application/json; charset=utf-8",
  });
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) { reject(new Error("Payload terlalu besar.")); req.destroy(); }
    });
    req.on("end", () => {
      if (!body) { resolve({}); return; }
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error("Body harus JSON valid.")); }
    });
  });

const normalizeTransaction = (input) => {
  const type   = input.type === "Pengeluaran" ? "Pengeluaran" : "Pendapatan";
  const amount = Math.abs(Number(input.amount || 0));
  const knownVilla = new Set([...properties.map((p) => p.name), "Semua Villa"]);

  if (!input.description || !String(input.description).trim())
    throw new Error("Deskripsi wajib diisi.");
  if (!amount)
    throw new Error("Jumlah harus lebih dari 0.");

  return {
    id:          input.id || `${type === "Pengeluaran" ? "EXP" : "INC"}-${Date.now()}`,
    description: String(input.description).trim(),
    villa:       knownVilla.has(input.villa) ? input.villa : properties[0].name,
    date:        input.date || new Date().toISOString().slice(0, 10),
    amount,
    type,
    status:      input.status   || "Lunas",
    category:    input.category || (type === "Pengeluaran" ? "Operasional" : "Booking"),
    note:        input.note     || "",
    createdAt:   input.createdAt || new Date().toISOString(),
  };
};

const sortTransactions = (items) =>
  [...items].sort((a, b) =>
    `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`)
  );

const normalizeDb = (db) => {
  const existingProperties = Array.isArray(db.properties) ? db.properties : [];
  const mergedProperties = properties.map((property) => {
    const existing = existingProperties.find((item) => item.name === property.name);
    return { ...property, ...(existing || {}) };
  });
  return {
    ...defaultDb,
    ...db,
    settings:     { ...defaultDb.settings, ...(db.settings || {}) },
    users:        Array.isArray(db.users) && db.users.length ? db.users : defaultDb.users,
    properties:   mergedProperties,
    transactions: sortTransactions(
      Array.isArray(db.transactions)
        ? db.transactions.map((item) => normalizeTransaction(item))
        : defaultDb.transactions
    ),
  };
};

const readDb = async () => {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(dbPath, "utf8");
    return normalizeDb(JSON.parse(raw));
  } catch {
    await writeDb(defaultDb);
    return normalizeDb(defaultDb);
  }
};

const writeDb = async (db) => {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dbPath, `${JSON.stringify(normalizeDb(db), null, 2)}\n`);
};

const publicDb = (db) => ({
  appName:      db.appName,
  settings:     db.settings,
  properties:   db.properties,
  transactions: db.transactions,
});

// ─── API Handler ──────────────────────────────────────────────────────────────
const handleApi = async (req, res, url) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { send(res, 204, ""); return; }

  const db = await readDb();

  // ── Health ──────────────────────────────────────────────────────────────
  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      appName: db.appName,
      sheetsConfigured: !!process.env.APPS_SCRIPT_URL,
    });
    return;
  }

  // ── Bootstrap ───────────────────────────────────────────────────────────
  if (req.method === "GET" && url.pathname === "/api/bootstrap") {
    sendJson(res, 200, publicDb(db));
    return;
  }

  // ── Login ───────────────────────────────────────────────────────────────
  if (req.method === "POST" && url.pathname === "/api/login") {
    const body = await readBody(req);
    const user = db.users.find(
      (u) =>
        u.email.toLowerCase() === String(body.email || "").trim().toLowerCase() &&
        u.password === body.password
    );
    if (!user) { sendJson(res, 401, { error: "Email atau password tidak sesuai." }); return; }
    sendJson(res, 200, {
      user: {
        email:   user.email,
        name:    user.name,
        initials: user.initials,
        role:    user.role,
        loginAt: new Date().toISOString(),
      },
    });
    return;
  }

  // ── Ganti Password ──────────────────────────────────────────────────────
  if (req.method === "PUT" && url.pathname === "/api/users/password") {
    const body      = await readBody(req);
    const emailInput = String(body.email || "").trim().toLowerCase();
    const userIndex = db.users.findIndex((u) => u.email.toLowerCase() === emailInput);

    if (userIndex === -1) { sendJson(res, 404, { error: "User tidak ditemukan." }); return; }
    if (db.users[userIndex].password !== body.currentPassword) {
      sendJson(res, 401, { error: "Password lama tidak sesuai." }); return;
    }
    const newPassword = String(body.newPassword || "");
    if (newPassword.length < 4) { sendJson(res, 400, { error: "Password baru minimal 4 karakter." }); return; }

    const nextDb = {
      ...db,
      users: db.users.map((u, i) => i === userIndex ? { ...u, password: newPassword } : u),
    };
    await writeDb(nextDb);
    console.log(`[Auth] Password diubah: ${emailInput}`);
    sendJson(res, 200, { ok: true, message: "Password berhasil diubah." });
    return;
  }

  // ── Properties ──────────────────────────────────────────────────────────
  if (req.method === "GET" && url.pathname === "/api/properties") {
    sendJson(res, 200, { properties: db.properties });
    return;
  }

  // ── Transactions GET ────────────────────────────────────────────────────
  if (req.method === "GET" && url.pathname === "/api/transactions") {
    sendJson(res, 200, { transactions: db.transactions });
    return;
  }

  // ── Transactions POST (tambah / edit upsert) ────────────────────────────
  if (req.method === "POST" && url.pathname === "/api/transactions") {
    const transaction = normalizeTransaction(await readBody(req));
    const nextDb = {
      ...db,
      transactions: sortTransactions([
        transaction,
        ...db.transactions.filter((item) => item.id !== transaction.id),
      ]),
    };
    await writeDb(nextDb);

    // ✅ Sync ke Google Sheets via Apps Script (async, tidak blok response)
    syncToSheets(nextDb.transactions).catch(() => {});

    sendJson(res, 201, { transactions: nextDb.transactions, transaction });
    return;
  }

  // ── Transactions DELETE ─────────────────────────────────────────────────
  const deleteMatch = url.pathname.match(/^\/api\/transactions\/([^/]+)$/);
  if (req.method === "DELETE" && deleteMatch) {
    const id = decodeURIComponent(deleteMatch[1]);
    const nextDb = {
      ...db,
      transactions: db.transactions.filter((item) => item.id !== id),
    };
    await writeDb(nextDb);

    // ✅ Sync ke Google Sheets via Apps Script
    syncToSheets(nextDb.transactions).catch(() => {});

    sendJson(res, 200, { transactions: nextDb.transactions });
    return;
  }

  // ── Settings ────────────────────────────────────────────────────────────
  if (req.method === "PUT" && url.pathname === "/api/settings") {
    const body = await readBody(req);
    const nextDb = {
      ...db,
      settings: {
        ...db.settings,
        companyName: String(body.companyName || db.settings.companyName),
        email:       String(body.email       || db.settings.email),
        timezone:    String(body.timezone    || db.settings.timezone),
        currency:    String(body.currency    || db.settings.currency),
      },
    };
    await writeDb(nextDb);
    sendJson(res, 200, { settings: nextDb.settings });
    return;
  }

  // ── Manual Sync Trigger ─────────────────────────────────────────────────
  if (req.method === "POST" && url.pathname === "/api/sync-sheets") {
    if (!process.env.APPS_SCRIPT_URL) {
      sendJson(res, 400, { error: "APPS_SCRIPT_URL belum dikonfigurasi di .env" });
      return;
    }
    syncToSheets(db.transactions).catch(() => {});
    sendJson(res, 200, {
      ok: true,
      message: `Sync ${db.transactions.length} transaksi dimulai ke Google Sheets.`,
    });
    return;
  }

  sendJson(res, 404, { error: "Endpoint tidak ditemukan." });
};

// ─── Static File Server ───────────────────────────────────────────────────────
const serveStatic = async (req, res, url) => {
  if (req.method !== "GET") { send(res, 405, "Method not allowed"); return; }

  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  let filePath = path.normalize(path.join(distDir, pathname));
  if (!filePath.startsWith(distDir)) { send(res, 403, "Forbidden"); return; }

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = path.join(filePath, "index.html");
  } catch {
    filePath = path.join(distDir, "index.html");
  }

  try {
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes.get(ext) || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  } catch {
    send(res, 404, "Build frontend belum ditemukan. Jalankan npm run build dulu.");
  }
};

// ─── Server ───────────────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api")) { await handleApi(req, res, url); return; }
    await serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error." });
  }
});

server.listen(port, host, async () => {
  console.log(`✓ Therainvillas backend: http://${host}:${port}`);

  const sheetsUrl = process.env.APPS_SCRIPT_URL;
  if (sheetsUrl) {
    console.log(`✓ Google Sheets sync aktif → ${sheetsUrl.slice(0, 60)}...`);
  } else {
    console.log(`  Google Sheets: belum dikonfigurasi (opsional — set APPS_SCRIPT_URL di .env)`);
  }

  // ✅ Sync awal saat server jalan
  const db = await readDb().catch(() => null);
  if (db) syncOnStartup(db.transactions);
});