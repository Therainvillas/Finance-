import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  Database,
  Download,
  Edit2,
  FileText,
  Home,
  KeyRound,
  LockKeyhole,
  LogOut,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import "./App.css";
import logoUrl from "./assets/Logo.svg";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const C = {
  primary: "#006948",
  primaryDark: "#005137",
  primaryBg: "rgba(0,105,72,0.08)",
  surface: "#ffffff",
  text: "#191c1e",
  textMuted: "#6d7a72",
  border: "#e0e3e5",
  rose: "#E11D48",
  roseBg: "rgba(225,29,72,0.08)",
  amber: "#F59E0B",
  amberBg: "rgba(245,158,11,0.08)",
  sapphire: "#2563EB",
  sapphireBg: "rgba(37,99,235,0.08)",
  emerald: "#059669",
  emeraldBg: "rgba(5,150,105,0.08)",
};

const APP_NAME = "Therainvillas";
const APP_SLUG = "therainvillas";
const API_BASE = "/api";

const STORAGE = {
  session: `${APP_SLUG}.session`,
  transactions: `${APP_SLUG}.transactions`,
  settings: `${APP_SLUG}.settings`,
};

const LOGIN_USER = {
  email: "admin@therainvillas.id",
  password: "villa123",
  name: "Riki Bahtiar",
  initials: "RB",
  role: "Finance",
};

const defaultSettings = {
  companyName: APP_NAME,
  email: "admin@therainvillas.id",
  timezone: "WIB (UTC+7)",
  currency: "IDR",
};

const properties = [
  { id: 1, name: "Villa Donkris", location: "Indonesia", rooms: 3, rating: 4.9 },
  { id: 2, name: "Villa Arisyfa", location: "Indonesia", rooms: 5, rating: 4.8 },
  { id: 3, name: "Villa Wanela", location: "Indonesia", rooms: 2, rating: 4.8 },
  { id: 4, name: "Villa Valora", location: "Indonesia", rooms: 2, rating: 4.7 },
  { id: 5, name: "Villa Lembah Singgah", location: "Indonesia", rooms: 3, rating: 4.9 },
  { id: 6, name: "Villa Ranna", location: "Indonesia", rooms: 3, rating: 4.7 },
  { id: 7, name: "Villa Echa", location: "Indonesia", rooms: 4, rating: 4.7 },
  { id: 8, name: "Villa Rayya", location: "Indonesia", rooms: 4, rating: 4.8 },
  { id: 9, name: "Villa Baduo", location: "Indonesia", rooms: 5, rating: 4.7 },
  { id: 10, name: "Villa Calmora", location: "Indonesia", rooms: 4, rating: 4.8 },
  { id: 11, name: "Villa Cempaka", location: "Indonesia", rooms: 3, rating: 4.8 },
  { id: 12, name: "Villa Cemara", location: "Indonesia", rooms: 5, rating: 4.7 },
  { id: 13, name: "Villa Hala", location: "Indonesia", rooms: 5, rating: 4.7 },
  { id: 14, name: "Villa 4D", location: "Indonesia", rooms: 4, rating: 4.8 },
  { id: 15, name: "Villa Aleia", location: "Indonesia", rooms: 3, rating: 4.8 },
  { id: 16, name: "Villa Awan", location: "Indonesia", rooms: 3, rating: 4.8 },
  { id: 17, name: "Villa Albi", location: "Indonesia", rooms: 4, rating: 4.7 },
  { id: 18, name: "Villa Opung", location: "Indonesia", rooms: 3, rating: 4.8 },
  { id: 19, name: "Villa De Summit", location: "Indonesia", rooms: 4, rating: 4.9 },
  { id: 20, name: "Villa RJS Cottage", location: "Indonesia", rooms: 3, rating: 4.8 },
  { id: 21, name: "Villa RJS 2", location: "Indonesia", rooms: 3, rating: 4.7 },
  { id: 22, name: "Villa RJS 3", location: "Indonesia", rooms: 3, rating: 4.7 },
  { id: 23, name: "Villa Arsy", location: "Indonesia", rooms: 4, rating: 4.8 },
  { id: 24, name: "Villa Jhonsky", location: "Indonesia", rooms: 4, rating: 4.8 },
  { id: 25, name: "Villa Thmyi", location: "Indonesia", rooms: 6, rating: 4.7 },
  { id: 26, name: "Villa Twins", location: "Indonesia", rooms: 3, rating: 4.8 },
  { id: 27, name: "Villa Cyrena", location: "Indonesia", rooms: 3, rating: 4.8 },
  { id: 27, name: "Villa Agave", location: "Indonesia", rooms: 7, rating: 4.8 },
  { id: 27, name: "Villa Bodas", location: "Indonesia", rooms: 6, rating: 4.8 },
  { id: 27, name: "Villa The Helina", location: "Indonesia", rooms: 5, rating: 4.8 },

];

const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const incomeCategories = ["Booking","Deposit","Sewa Bulanan","Refund Adjustment","Lainnya"];
const expenseCategories = ["Operasional","Perawatan","Gaji Staf","Utilitas","Marketing","Lainnya"];
const statusOptions = ["Lunas","Tertunda","Jatuh Tempo"];

const initialTransactions = [
  { id: "INC-20260515-A1B2", description: "Booking Hiroshi Tanaka", villa: "Villa Donkris", date: "2026-05-15", amount: 12500000, type: "Pendapatan", status: "Lunas", category: "Booking", note: "Pembayaran transfer", createdAt: "2026-05-15T10:00:00.000Z" },
  { id: "INC-20260514-C3D4", description: "Booking Sarah Mitchell", villa: "Villa Arisyfa", date: "2026-05-14", amount: 8750000, type: "Pendapatan", status: "Lunas", category: "Booking", note: "", createdAt: "2026-05-14T10:00:00.000Z" },
  { id: "EXP-20260513-E5F6", description: "Tagihan listrik", villa: "Villa Donkris", date: "2026-05-13", amount: 2100000, type: "Pengeluaran", status: "Lunas", category: "Utilitas", note: "PLN Mei", createdAt: "2026-05-13T10:00:00.000Z" },
  { id: "INC-20260512-G7H8", description: "Booking Emma van der Berg", villa: "Villa Wanela", date: "2026-05-12", amount: 18200000, type: "Pendapatan", status: "Tertunda", category: "Deposit", note: "Menunggu pelunasan", createdAt: "2026-05-12T10:00:00.000Z" },
  { id: "EXP-20260511-I9J1", description: "Perawatan AC", villa: "Villa Arisyfa", date: "2026-05-11", amount: 3500000, type: "Pengeluaran", status: "Lunas", category: "Perawatan", note: "", createdAt: "2026-05-11T10:00:00.000Z" },
  { id: "INC-20260428-K2L3", description: "Booking David Chen", villa: "Villa Donkris", date: "2026-04-28", amount: 9800000, type: "Pendapatan", status: "Jatuh Tempo", category: "Booking", note: "", createdAt: "2026-04-28T10:00:00.000Z" },
  { id: "EXP-20260425-M4N5", description: "Gaji staf April", villa: "Semua Villa", date: "2026-04-25", amount: 14000000, type: "Pengeluaran", status: "Lunas", category: "Gaji Staf", note: "", createdAt: "2026-04-25T10:00:00.000Z" },
  { id: "INC-20260420-O6P7", description: "Booking Klaus Muller", villa: "Villa Wanela", date: "2026-04-20", amount: 22500000, type: "Pendapatan", status: "Lunas", category: "Booking", note: "", createdAt: "2026-04-20T10:00:00.000Z" },
  { id: "EXP-20260318-Q8R9", description: "Iklan OTA", villa: "Semua Villa", date: "2026-03-18", amount: 4800000, type: "Pengeluaran", status: "Lunas", category: "Marketing", note: "", createdAt: "2026-03-18T10:00:00.000Z" },
  { id: "INC-20260308-S1T2", description: "Sewa bulanan corporate", villa: "Villa Donkris", date: "2026-03-08", amount: 42000000, type: "Pendapatan", status: "Lunas", category: "Sewa Bulanan", note: "", createdAt: "2026-03-08T10:00:00.000Z" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "pendapatan", label: "Pendapatan", icon: TrendingUp },
  { id: "pengeluaran", label: "Pengeluaran", icon: Receipt },
  { id: "laporan", label: "Laporan", icon: FileText },
  { id: "properti", label: "Properti", icon: Building2 },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

const todayISO = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const useStoredState = (key, fallback) => {
  const [value, setValue] = useState(() => readJSON(key, fallback));
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
  }, [key, value]);
  return [value, setValue];
};

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(n || 0));

const fmtShort = (n) => {
  const value = Number(n || 0);
  return fmt(value);
};

const formatDate = (iso) => {
  if (!iso) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${iso}T00:00:00`));
};

// ✅ BARU: Format "2026-05" → "Mei 2026"
const fmtMonthKey = (key) => {
  if (!key || key === "Semua") return "Semua";
  const [year, month] = key.split("-");
  return `${monthNames[Number(month) - 1]} ${year}`;
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const normalizeTransactions = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => {
      const type = item.type || item.tipe || "Pendapatan";
      const amount = Math.abs(Number(item.amount ?? item.jumlah ?? 0));
      return {
        id: item.id || `TRX-${String(index + 1).padStart(3, "0")}`,
        description: item.description || item.tamu || "Transaksi",
        villa: item.villa || properties[0].name,
        date: item.date || item.tanggalIso || todayISO(),
        amount,
        type: type === "Pengeluaran" ? "Pengeluaran" : "Pendapatan",
        status: item.status || "Lunas",
        category: item.category || (type === "Pengeluaran" ? expenseCategories[0] : incomeCategories[0]),
        note: item.note || "",
        createdAt: item.createdAt || new Date().toISOString(),
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => `${b.date}${b.createdAt}`.localeCompare(`${a.date}${a.createdAt}`));
};

const createTransactionId = (type) => {
  const prefix = type === "Pengeluaran" ? "EXP" : "INC";
  const stamp = todayISO().replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
};

const sumByType = (items, type) =>
  items.reduce((total, item) => total + (item.type === type ? item.amount : 0), 0);

const summarize = (items) => {
  const income = sumByType(items, "Pendapatan");
  const expense = sumByType(items, "Pengeluaran");
  return {
    income,
    expense,
    profit: income - expense,
    paid: items.filter((item) => item.status === "Lunas").length,
    pending: items.filter((item) => item.status !== "Lunas").length,
  };
};

const filterByMonth = (items, monthKey) => items.filter((item) => item.date?.startsWith(monthKey));

const previousMonthKey = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  const previous = new Date(year, month - 2, 1);
  return `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, "0")}`;
};

const trendValue = (current, previous) => {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return Math.round(((current - previous) / previous) * 100);
};

const buildMonthlyData = (items, year) =>
  monthNames.map((bulan, index) => {
    const monthKey = `${year}-${String(index + 1).padStart(2, "0")}`;
    const monthItems = filterByMonth(items, monthKey);
    const pendapatan = sumByType(monthItems, "Pendapatan");
    const pengeluaran = sumByType(monthItems, "Pengeluaran");
    return { bulan, pendapatan, pengeluaran, laba: pendapatan - pengeluaran };
  });

const buildExpenseBreakdown = (items) => {
  const expenses = items.filter((item) => item.type === "Pengeluaran");
  const total = sumByType(expenses, "Pengeluaran");
  const colors = [C.sapphire, C.amber, C.primary, C.rose, "#7C3AED", C.emerald];
  return expenseCategories
    .map((category, index) => {
      const value = expenses.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0);
      return { name: category, value, percent: total ? Math.round((value / total) * 100) : 0, color: colors[index] };
    })
    .filter((item) => item.value > 0);
};

const getAvailableYears = (items) => {
  const years = new Set([String(new Date().getFullYear())]);
  items.forEach((item) => { if (item.date) years.add(item.date.slice(0, 4)); });
  return [...years].sort((a, b) => b.localeCompare(a));
};

const downloadExcel = (items, label, settings) => {
  const rows = normalizeTransactions(items);
  const summary = summarize(rows);
  const generatedAt = new Date().toLocaleString("id-ID");
  const fileDate = todayISO();
  const title = `Backup ${APP_NAME} - ${label}`;

  const bodyRows = rows
    .map((item) => `
      <tr>
        <td>${escapeHtml(item.id)}</td>
        <td>${escapeHtml(formatDate(item.date))}</td>
        <td>${escapeHtml(item.villa)}</td>
        <td>${escapeHtml(item.type)}</td>
        <td>${escapeHtml(item.category)}</td>
        <td>${escapeHtml(item.description)}</td>
        <td>${escapeHtml(item.status)}</td>
        <td>${item.type === "Pendapatan" ? item.amount : 0}</td>
        <td>${item.type === "Pengeluaran" ? item.amount : 0}</td>
        <td>${escapeHtml(item.note)}</td>
      </tr>`)
    .join("");

  const html = `<!doctype html><html><head><meta charset="UTF-8"/>
    <style>body{font-family:Arial,sans-serif}h1{font-size:18px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px}th{background:#006948;color:white}.summary td{font-weight:bold;background:#f3f7f5}</style>
    </head><body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(settings.companyName)} | Dibuat ${escapeHtml(generatedAt)}</p>
    <table>
      <tr class="summary"><td>Total Pendapatan</td><td colspan="9">${summary.income}</td></tr>
      <tr class="summary"><td>Total Pengeluaran</td><td colspan="9">${summary.expense}</td></tr>
      <tr class="summary"><td>Laba Bersih</td><td colspan="9">${summary.profit}</td></tr>
    </table><br/>
    <table><thead><tr><th>ID</th><th>Tanggal</th><th>Villa</th><th>Tipe</th><th>Kategori</th><th>Deskripsi</th><th>Status</th><th>Pemasukan</th><th>Pengeluaran</th><th>Catatan</th></tr></thead>
    <tbody>${bodyRows || '<tr><td colspan="10">Belum ada transaksi</td></tr>'}</tbody></table>
    </body></html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${APP_SLUG}-${label.toLowerCase().replace(/\s+/g, "-")}-${fileDate}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// ✅ BARU: Generate HTML untuk cetak / PDF
const generatePrintHtml = (items, summary, label, settings) => {
  const rows = normalizeTransactions(items);
  const generatedAt = new Date().toLocaleString("id-ID");

  const bodyRows = rows.map((item) => `
    <tr>
      <td>${escapeHtml(item.id)}</td>
      <td>${escapeHtml(formatDate(item.date))}</td>
      <td>${escapeHtml(item.villa)}</td>
      <td style="color:${item.type === "Pendapatan" ? "#006948" : "#e11d48"}">${escapeHtml(item.type)}</td>
      <td>${escapeHtml(item.category)}</td>
      <td>${escapeHtml(item.description)}</td>
      <td>${escapeHtml(item.status)}</td>
      <td style="text-align:right;color:#006948">${item.type === "Pendapatan" ? fmt(item.amount) : "-"}</td>
      <td style="text-align:right;color:#e11d48">${item.type === "Pengeluaran" ? fmt(item.amount) : "-"}</td>
      <td>${escapeHtml(item.note)}</td>
    </tr>`).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Laporan ${APP_NAME} - ${label}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #191c1e; margin: 24px; font-size: 13px; }
    h1 { font-size: 20px; margin: 0 0 4px; color: #006948; }
    .meta { color: #6d7a72; font-size: 12px; margin-bottom: 20px; }
    .summary { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .summary-box { padding: 12px 16px; border: 1px solid #e0e3e5; border-radius: 6px; min-width: 140px; }
    .summary-box span { display: block; color: #6d7a72; font-size: 10px; text-transform: uppercase; margin-bottom: 4px; }
    .summary-box strong { font-size: 16px; font-family: 'Plus Jakarta Sans', sans-serif; }
    .income { color: #006948; }
    .expense { color: #e11d48; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #e0e3e5; padding: 7px 8px; text-align: left; vertical-align: middle; }
    th { background: #006948; color: white; font-size: 10px; text-transform: uppercase; }
    tr:nth-child(even) { background: #f7f9fb; }
    @media print {
      body { margin: 0; font-size: 11px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>Laporan Keuangan ${escapeHtml(APP_NAME)}</h1>
  <p class="meta">${escapeHtml(label)} &nbsp;|&nbsp; ${escapeHtml(settings?.companyName || APP_NAME)} &nbsp;|&nbsp; ${escapeHtml(generatedAt)}</p>
  <div class="summary">
    <div class="summary-box">
      <span>Total Pendapatan</span>
      <strong class="income">${fmt(summary.income)}</strong>
    </div>
    <div class="summary-box">
      <span>Total Pengeluaran</span>
      <strong class="expense">${fmt(summary.expense)}</strong>
    </div>
    <div class="summary-box">
      <span>Laba Bersih</span>
      <strong>${fmt(summary.profit)}</strong>
    </div>
    <div class="summary-box">
      <span>Total Transaksi</span>
      <strong>${rows.length}</strong>
    </div>
    <div class="summary-box">
      <span>Transaksi Lunas</span>
      <strong>${summary.paid}</strong>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>ID</th><th>Tanggal</th><th>Villa</th><th>Tipe</th><th>Kategori</th>
        <th>Deskripsi</th><th>Status</th><th>Pendapatan</th><th>Pengeluaran</th><th>Catatan</th>
      </tr>
    </thead>
    <tbody>${bodyRows || '<tr><td colspan="10" style="text-align:center">Belum ada transaksi.</td></tr>'}</tbody>
  </table>
  <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
</body>
</html>`;
};

// ─── Toast System ─────────────────────────────────────────────────────────────

const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="toast-container">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`toast toast-${toast.type}`}
        onClick={() => onDismiss(toast.id)}
      >
        <div className="toast-icon">
          {toast.type === "success" ? <Check size={16} /> : toast.type === "error" ? <X size={16} /> : <Bell size={16} />}
        </div>
        <div className="toast-body">
          <strong>{toast.title}</strong>
          {toast.message && <p>{toast.message}</p>}
        </div>
        <button className="toast-close" onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}>
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((title, message = "", type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, show, dismiss };
};

// ─── Komponen Kecil ───────────────────────────────────────────────────────────

const StatusChip = ({ status }) => {
  const cfg = {
    Lunas: { color: C.emerald, bg: C.emeraldBg, icon: Check },
    Tertunda: { color: C.amber, bg: C.amberBg, icon: Clock },
    "Jatuh Tempo": { color: C.rose, bg: C.roseBg, icon: X },
  }[status] || { color: C.textMuted, bg: "#eef1f0", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className="status-chip" style={{ "--chip-bg": cfg.bg, "--chip-color": cfg.color }}>
      <Icon size={12} />{status}
    </span>
  );
};

const TypeChip = ({ type }) => (
  <span className="type-chip" style={{ "--chip-bg": type === "Pendapatan" ? C.primaryBg : C.roseBg, "--chip-color": type === "Pendapatan" ? C.primary : C.rose }}>
    {type}
  </span>
);

const TrendBadge = ({ value = 0, inverse = false }) => {
  const positive = inverse ? value <= 0 : value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={positive ? "trend-badge positive" : "trend-badge negative"}>
      <Icon size={13} />{Math.abs(value)}%
    </span>
  );
};

const KpiCard = ({ title, value, trend, trendInverse, icon: Icon, accent, bg, sub }) => (
  <section className="kpi-card">
    <div className="kpi-card-top">
      <p>{title}</p>
      <span className="metric-icon" style={{ "--metric-bg": bg, "--metric-color": accent }}>
        <Icon size={18} />
      </span>
    </div>
    <strong>{value}</strong>
    <div className="kpi-card-bottom">
      <TrendBadge value={trend} inverse={trendInverse} />
      <span>{sub}</span>
    </div>
  </section>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color }}>{item.name}: {fmtShort(item.value)}</p>
      ))}
    </div>
  );
};

const PageHeader = ({ title, desc, actions }) => (
  <div className="page-header">
    <div>
      <h1>{title}</h1>
      <p>{desc}</p>
    </div>
    {actions && <div className="page-actions">{actions}</div>}
  </div>
);

// ✅ BARU: Panel Notifikasi Transaksi Tertunda / Jatuh Tempo
const NotifPanel = ({ items, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const overdue = items.filter((t) => t.status === "Jatuh Tempo");
  const pending = items.filter((t) => t.status === "Tertunda");

  return (
    <div className="notif-panel" ref={ref}>
      <div className="notif-panel-header">
        <strong>Notifikasi</strong>
        <span className="notif-count">{items.length} perlu perhatian</span>
      </div>

      {items.length === 0 ? (
        <div className="notif-empty">
          <Check size={20} style={{ color: C.emerald }} />
          <span>Semua transaksi sudah lunas!</span>
        </div>
      ) : (
        <div className="notif-list">
          {overdue.length > 0 && (
            <p className="notif-section-label" style={{ color: C.rose }}>
              Jatuh Tempo ({overdue.length})
            </p>
          )}
          {overdue.map((item) => (
            <div key={item.id} className="notif-item overdue">
              <div className="notif-item-header">
                <X size={13} style={{ color: C.rose, flexShrink: 0 }} />
                <strong>{item.description}</strong>
              </div>
              <span>{item.villa} · {formatDate(item.date)} · {fmtShort(item.amount)}</span>
            </div>
          ))}

          {pending.length > 0 && (
            <p className="notif-section-label" style={{ color: C.amber, marginTop: overdue.length ? 8 : 0 }}>
              Tertunda ({pending.length})
            </p>
          )}
          {pending.map((item) => (
            <div key={item.id} className="notif-item pending">
              <div className="notif-item-header">
                <Clock size={13} style={{ color: C.amber, flexShrink: 0 }} />
                <strong>{item.description}</strong>
              </div>
              <span>{item.villa} · {formatDate(item.date)} · {fmtShort(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar = ({ collapsed, onToggle, activePage, onNav, activeProp, onPropChange, onLogout }) => {
  const [propOpen, setPropOpen] = useState(false);
  const propRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (propRef.current && !propRef.current.contains(event.target)) setPropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>
      <div className="brand">
        <span className="brand-mark" style={{ background: "none", padding: 0 }}>
  <img src={logoUrl} alt="Logo" style={{ width: 36, height: 36, objectFit: "contain" }} />
</span>
        <span className="brand-text">{APP_NAME}</span>
      </div>

      <div className="property-section" ref={propRef}>
        <p>Properti Aktif</p>
        <button className="property-button" onClick={() => setPropOpen((o) => !o)}>
          <span className="property-icon"><Building2 size={15} /></span>
          <span>{properties[activeProp].name}</span>
          <ChevronsUpDown size={14} />
        </button>
        {propOpen && (
          <div className="property-menu">
            {properties.map((property, index) => (
              <button
                key={property.id}
                className={index === activeProp ? "active" : ""}
                onClick={() => { onPropChange(index); setPropOpen(false); }}
              >
                <Building2 size={15} />
                <span>
                  <strong>{property.name}</strong>
                  <small>{property.rooms} kamar | rating {property.rating}</small>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <p className="nav-title">Menu Utama</p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={activePage === id ? "nav-button active" : "nav-button"}
            onClick={() => onNav(id)}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} />
            <span className="nav-label">{label}</span>
            <span className="nav-dot" />
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={17} />
          <span>Keluar</span>
        </button>
      </div>

      <button className="sidebar-toggle" onClick={onToggle}>
        {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
      </button>
    </aside>
  );
};

// ─── Login ────────────────────────────────────────────────────────────────────

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState(LOGIN_USER.email);
  const [password, setPassword] = useState(LOGIN_USER.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const success = await onLogin(email, password);
    setLoading(false);
    if (!success) setError("Email atau password tidak sesuai.");
  };

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-visual">
          <span className="brand-mark large" style={{ background: "none", padding: 0 }}>
          <img src={logoUrl} alt="Logo" style={{ width: 54, height: 54, objectFit: "contain" }} />
          </span>
          <h1>{APP_NAME}</h1>
          <div className="login-metrics">
            <span><strong>{properties.length}</strong>Villa Aktif</span>
            <span><strong>Rp95jt</strong>Target Bulanan</span>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-title">
            <LockKeyhole size={22} />
            <div>
              <h2>Login Keuangan</h2>
              <p>Masuk sebagai admin {APP_NAME}.</p>
            </div>
          </div>
          <label className="form-field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button full" type="submit" disabled={loading}>
            <ShieldCheck size={17} />
            {loading ? "Memeriksa..." : "Masuk Dashboard"}
          </button>
        </form>
      </section>
    </main>
  );
};

// ─── TopBar ───────────────────────────────────────────────────────────────────
// ✅ BARU: Global search berfungsi + Notif dropdown

const TopBar = ({ user, notif, onClearNotif, onExport, transactions, globalSearch, onSearch }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const bellWrapRef = useRef(null);

  // ✅ BARU: Hitung transaksi Tertunda / Jatuh Tempo untuk notifikasi
  const pendingItems = useMemo(
    () => (transactions || []).filter((t) => t.status !== "Lunas"),
    [transactions]
  );

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => {
      if (bellWrapRef.current && !bellWrapRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  return (
    <header className="topbar">
      {/* ✅ BARU: Global search berfungsi */}
      <div className="search-field global-search">
        <Search size={15} />
        <input
          value={globalSearch}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari transaksi, villa, kategori..."
        />
        {globalSearch && (
          <button
            style={{ position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: C.textMuted, display: "flex" }}
            onClick={() => onSearch("")}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="topbar-actions">
        {/* ✅ BARU: Bell buka dropdown notifikasi */}
        <div style={{ position: "relative" }} ref={bellWrapRef}>
          <button
            className="icon-button"
            onClick={() => {
              setNotifOpen((o) => !o);
              onClearNotif();
            }}
            title="Notifikasi"
          >
            <Bell size={17} />
            {pendingItems.length > 0 && <span className="notification-dot" />}
          </button>
          {notifOpen && (
            <NotifPanel items={pendingItems} onClose={() => setNotifOpen(false)} />
          )}
        </div>

        <button className="icon-button" onClick={() => window.location.reload()} title="Muat ulang">
          <RefreshCw size={16} />
        </button>
        <button className="secondary-button compact" onClick={onExport}>
          <Download size={15} />
          Backup
        </button>
        <div className="user-menu">
          <span>{user.initials}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </div>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const RecentActivity = ({ transactions }) => {
  const recent = transactions.slice(0, 6);
  if (!recent.length) return null;
  return (
    <section className="panel recent-activity">
      <div className="panel-header">
        <div>
          <h2>Aktivitas Terakhir</h2>
          <p>Transaksi terbaru</p>
        </div>
      </div>
      <div className="activity-timeline">
        {recent.map((item) => (
          <div key={item.id} className="activity-item">
            <span
              className="activity-dot"
              style={{ background: item.type === "Pendapatan" ? C.primary : C.rose }}
            />
            <div className="activity-content">
              <strong>{item.description}</strong>
              <span>{item.villa} · {formatDate(item.date)}</span>
            </div>
            <span
              className="activity-amount"
              style={{ color: item.type === "Pendapatan" ? C.primary : C.rose }}
            >
              {item.type === "Pendapatan" ? "+" : "-"}{fmtShort(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const DashboardPage = ({ activeProp, transactions, onAddTransaction, onDeleteTransaction, onEditTransaction, onExport, searchQuery }) => {
  const years = useMemo(() => getAvailableYears(transactions), [transactions]);
  const [period, setPeriod] = useState(years[0]);
  const [chartType, setChartType] = useState("area");
  const property = properties[activeProp];
  const activePeriod = years.includes(period) ? period : years[0];

  // ✅ FIX: Dashboard sekarang menampilkan SEMUA transaksi, tidak hanya yang terkait villa aktif
  // Ini memastikan pengeluaran dari villa manapun selalu muncul di dashboard
  const yearTransactions = transactions.filter((item) => item.date?.startsWith(activePeriod));
  const summary = summarize(yearTransactions);
  const currentKey = todayISO().slice(0, 7);
  const previousKey = previousMonthKey(currentKey);
  const currentMonth = filterByMonth(transactions, currentKey);
  const previousMonth = filterByMonth(transactions, previousKey);
  const chartData = buildMonthlyData(transactions, activePeriod);
  const breakdown = buildExpenseBreakdown(yearTransactions);
  const paidRate = yearTransactions.length ? Math.round((summary.paid / yearTransactions.length) * 100) : 0;

  // Pendapatan hari ini — dari SEMUA villa (tidak difilter per villa)
  const todayAllIncome = useMemo(
    () => transactions.filter((item) => item.type === "Pendapatan" && item.date === todayISO()),
    [transactions]
  );
  const todayIncomeTotal = sumByType(todayAllIncome, "Pendapatan");
  const yesterdayISO = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
  const yesterdayAllIncome = useMemo(
    () => transactions.filter((item) => item.type === "Pendapatan" && item.date === yesterdayISO),
    [transactions, yesterdayISO]
  );
  const todayIncomeTrend = trendValue(todayIncomeTotal, sumByType(yesterdayAllIncome, "Pendapatan"));

  const expenseTrend = trendValue(sumByType(currentMonth, "Pengeluaran"), sumByType(previousMonth, "Pengeluaran"));
  const profitTrend = trendValue(summarize(currentMonth).profit, summarize(previousMonth).profit);

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard Keuangan"
        desc={`Semua Villa | Ringkasan ${activePeriod}`}
        actions={
          <>
            <div className="year-selector">
              {years.map((year) => (
                <button key={year} className={activePeriod === year ? "active" : ""} onClick={() => setPeriod(year)}>
                  {year}
                </button>
              ))}
            </div>
            <button className="secondary-button" onClick={() => onExport(yearTransactions, `Dashboard Semua Villa`)}>
              <Download size={15} /> Export
            </button>
          </>
        }
      />

      <div className="kpi-grid">
        <KpiCard title="Pendapatan Hari Ini" value={fmtShort(todayIncomeTotal)} trend={todayIncomeTrend} icon={TrendingUp} accent={C.primary} bg={C.primaryBg} sub={`${todayAllIncome.length} transaksi · semua villa`} />
        <KpiCard title="Laba Bersih" value={fmtShort(summary.profit)} trend={profitTrend} icon={Wallet} accent={C.emerald} bg={C.emeraldBg} sub="vs bulan lalu" />
        <KpiCard title="Total Pengeluaran" value={fmtShort(summary.expense)} trend={expenseTrend} trendInverse icon={Receipt} accent={C.rose} bg={C.roseBg} sub="vs bulan lalu" />
        <KpiCard title="Transaksi Lunas" value={`${paidRate}%`} trend={paidRate >= 80 ? 4 : -6} icon={Check} accent={C.sapphire} bg={C.sapphireBg} sub={`${summary.paid} dari ${yearTransactions.length} transaksi`} />
      </div>

      <div className="chart-grid">
        <section className="panel revenue-panel">
          <div className="panel-header">
            <div>
              <h2>Tren Pendapatan &amp; Pengeluaran</h2>
              <p>Januari sampai Desember {activePeriod}</p>
            </div>
            <div className="segmented">
              <button className={chartType === "area" ? "active" : ""} onClick={() => setChartType("area")}>Area</button>
              <button className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>Batang</button>
            </div>
          </div>
          <div className="legend-row">
            <span style={{ "--legend": C.primary }}>Pendapatan</span>
            <span style={{ "--legend": C.rose }}>Pengeluaran</span>
            <span style={{ "--legend": C.emerald }}>Laba Bersih</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            {chartType === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.16} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.rose} stopOpacity={0.14} />
                    <stop offset="95%" stopColor={C.rose} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v / 1000000}jt`} tick={{ fontSize: 12, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke={C.primary} fill="url(#income)" strokeWidth={2.4} dot={false} />
                <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke={C.rose} fill="url(#expense)" strokeWidth={2.2} dot={false} />
                <Area type="monotone" dataKey="laba" name="Laba Bersih" stroke={C.emerald} fill="none" strokeWidth={2.1} strokeDasharray="5 4" dot={false} />
              </AreaChart>
            ) : (
              <BarChart data={chartData} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v / 1000000}jt`} tick={{ fontSize: 12, fill: C.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pendapatan" name="Pendapatan" fill={C.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill={C.rose} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Distribusi Pengeluaran</h2>
              <p>Tahun {activePeriod}</p>
            </div>
          </div>
          {breakdown.length ? (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={breakdown} cx="50%" cy="50%" innerRadius={54} outerRadius={78} paddingAngle={3} dataKey="value">
                    {breakdown.map((item) => <Cell key={item.name} fill={item.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => fmt(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="expense-list">
                {breakdown.map((item) => (
                  <div key={item.name}>
                    <span style={{ "--dot": item.color }}>{item.name}</span>
                    <strong>{item.percent}%</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state-card">
              <Receipt size={32} style={{ color: C.textMuted, opacity: 0.4 }} />
              <p>Belum ada pengeluaran pada periode ini.</p>
            </div>
          )}
        </section>
      </div>

      {/* Recent Activity Timeline */}
      <RecentActivity transactions={transactions} />

      <TransactionTable
        transactions={transactions}
        onAddTransaction={onAddTransaction}
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
        onExport={onExport}
        compact
        searchQuery={searchQuery}
      />
    </div>
  );
};

// ─── TransactionForm (Tambah + Edit) ─────────────────────────────────────────
// ✅ BARU: Mendukung edit transaksi lewat prop `initialData`

const TransactionForm = ({ defaultType = "Pendapatan", initialData = null, onClose, onSave }) => {
  const isEdit = !!initialData;

  const [form, setForm] = useState(
    isEdit
      ? {
          type: initialData.type,
          description: initialData.description,
          villa: initialData.villa,
          date: initialData.date,
          amount: String(initialData.amount),
          status: initialData.status,
          category: initialData.category,
          note: initialData.note || "",
        }
      : {
          type: defaultType === "Pengeluaran" ? "Pengeluaran" : "Pendapatan",
          description: "",
          villa: properties[0].name,
          date: todayISO(),
          amount: "",
          status: "Lunas",
          category: defaultType === "Pengeluaran" ? expenseCategories[0] : incomeCategories[0],
          note: "",
        }
  );
  const [error, setError] = useState("");

  const categories = form.type === "Pendapatan" ? incomeCategories : expenseCategories;
  const update = (field, value) => setForm((c) => ({ ...c, [field]: value }));
  const setType = (type) =>
    setForm((c) => ({ ...c, type, category: type === "Pendapatan" ? incomeCategories[0] : expenseCategories[0] }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanAmount = Number(String(form.amount).replace(/[^\d]/g, ""));
    if (!form.description.trim()) { setError("Deskripsi wajib diisi."); return; }
    if (!cleanAmount) { setError("Jumlah harus lebih dari 0."); return; }
    onSave({
      ...form,
      amount: cleanAmount,
      description: form.description.trim(),
      id: isEdit ? initialData.id : createTransactionId(form.type),
      createdAt: isEdit ? initialData.createdAt : new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal" onMouseDown={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="modal-header">
          <div>
            <h2>{isEdit ? "Edit Transaksi" : "Tambah Transaksi"}</h2>
            <p>
              {isEdit
                ? `Mengubah: ${initialData.id}`
                : form.type === "Pendapatan" ? "Catat pemasukan villa." : "Catat biaya operasional villa."}
            </p>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            <X size={17} />
          </button>
        </div>

        {/* Tipe hanya bisa diubah saat tambah baru */}
        {!isEdit && (
          <div className="type-switch">
            <button type="button" className={form.type === "Pendapatan" ? "active" : ""} onClick={() => setType("Pendapatan")}>
              <TrendingUp size={16} /> Pendapatan
            </button>
            <button type="button" className={form.type === "Pengeluaran" ? "active danger" : ""} onClick={() => setType("Pengeluaran")}>
              <Receipt size={16} /> Pengeluaran
            </button>
          </div>
        )}
        {isEdit && (
          <div style={{ marginBottom: 4 }}>
            <TypeChip type={form.type} />
          </div>
        )}

        <div className="form-grid">
          <label className="form-field wide">
            <span>Deskripsi</span>
            <input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Contoh: Booking tamu, listrik, laundry" />
          </label>
          <label className="form-field">
            <span>Jumlah (Rp)</span>
            <input value={form.amount} onChange={(e) => update("amount", e.target.value)} inputMode="numeric" placeholder="12500000" />
          </label>
          <label className="form-field">
            <span>Tanggal</span>
            <input value={form.date} onChange={(e) => update("date", e.target.value)} type="date" />
          </label>
          <label className="form-field">
            <span>Villa</span>
            <select value={form.villa} onChange={(e) => update("villa", e.target.value)}>
              {properties.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              <option value="Semua Villa">Semua Villa</option>
            </select>
          </label>
          <label className="form-field">
            <span>Kategori</span>
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => update("status", e.target.value)}>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="form-field wide">
            <span>Catatan</span>
            <textarea value={form.note} onChange={(e) => update("note", e.target.value)} rows={3} />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Batal</button>
          <button type="submit" className="primary-button">
            <Check size={17} />
            {isEdit ? "Simpan Perubahan" : "Simpan Transaksi"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── TransactionTable ─────────────────────────────────────────────────────────
// ✅ BARU: Filter villa + status, edit transaksi, global search prop

const TransactionTable = ({
  transactions,
  filterType,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction,
  onExport,
  compact = false,
  searchQuery = "",
}) => {
  const [search, setSearch] = useState(searchQuery);
  const [filter, setFilter] = useState(filterType || "Semua");
  const [villaFilter, setVillaFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // ✅ BARU: Sinkron dengan global search dari TopBar
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  // ✅ BARU: Daftar villa yang muncul di transaksi
  const villaOptions = useMemo(() => {
    const used = new Set(transactions.map((t) => t.villa));
    const list = properties.map((p) => p.name).filter((n) => used.has(n));
    if (used.has("Semua Villa")) list.push("Semua Villa");
    return ["Semua", ...list];
  }, [transactions]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return transactions.filter((item) => {
      const matchesType = filter === "Semua" || item.type === filter;
      const matchesVilla = villaFilter === "Semua" || item.villa === villaFilter;
      const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
      const matchesSearch =
        !keyword ||
        [item.id, item.description, item.villa, item.category, item.status, item.note]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      return matchesType && matchesVilla && matchesStatus && matchesSearch;
    });
  }, [filter, villaFilter, statusFilter, search, transactions]);

  const defaultType = filter === "Pengeluaran" ? "Pengeluaran" : "Pendapatan";
  const hasActions = onDeleteTransaction || onEditTransaction;

  return (
    <section className="table-card">
      <div className="table-toolbar">
        <div>
          <h2>{compact ? "Transaksi Terbaru" : "Daftar Transaksi"}</h2>
          <p>{filtered.length} data ditampilkan</p>
        </div>
        <div className="toolbar-controls">
          {/* ✅ BARU: Search berfungsi */}
          <div className="search-field">
            <Search size={15} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari..." />
          </div>

          {/* ✅ BARU: Filter Villa */}
          {!compact && (
            <select className="filter-select" value={villaFilter} onChange={(e) => setVillaFilter(e.target.value)}>
              {villaOptions.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          )}

          {/* ✅ BARU: Filter Status */}
          {!compact && (
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Semua">Semua Status</option>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}

          <div className="segmented">
            {["Semua", "Pendapatan", "Pengeluaran"].map((item) => (
              <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                {item}
              </button>
            ))}
          </div>

          <button className="secondary-button compact" onClick={() => onExport(filtered, `Transaksi ${filter}`)}>
            <Download size={15} /> Excel
          </button>
          {onAddTransaction && (
            <button className="primary-button compact" onClick={() => setShowModal(true)}>
              <Plus size={15} /> Tambah
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Deskripsi</th>
              <th>Villa</th>
              <th>Tanggal</th>
              <th>Kategori</th>
              <th>Jumlah</th>
              <th>Tipe</th>
              <th>Status</th>
              {hasActions && <th />}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td style={{ fontSize: 11, color: C.textMuted }}>{item.id}</td>
                <td>
                  <strong>{item.description}</strong>
                  {item.note && <small>{item.note}</small>}
                </td>
                <td>{item.villa}</td>
                <td>{formatDate(item.date)}</td>
                <td>{item.category}</td>
                <td className={item.type === "Pendapatan" ? "amount income" : "amount expense"}>
                  {item.type === "Pengeluaran" ? "-" : "+"}
                  {fmt(item.amount)}
                </td>
                <td><TypeChip type={item.type} /></td>
                <td><StatusChip status={item.status} /></td>
                {hasActions && (
                  <td className="row-actions">
                    {/* ✅ BARU: Tombol edit */}
                    {onEditTransaction && (
                      <button
                        className="icon-button"
                        onClick={() => setEditItem(item)}
                        title="Edit transaksi"
                        style={{ marginRight: 6 }}
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {onDeleteTransaction && (
                      <button
                        className="icon-button danger"
                        onClick={() => { if (window.confirm("Hapus transaksi ini?")) onDeleteTransaction(item.id); }}
                        title="Hapus transaksi"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="empty-state-card">
            <FileText size={32} style={{ color: C.textMuted, opacity: 0.4 }} />
            <p>Belum ada transaksi yang sesuai filter.</p>
            {onAddTransaction && (
              <button className="primary-button compact" style={{ marginTop: 8 }} onClick={() => setShowModal(true)}>
                <Plus size={15} /> Tambah Transaksi
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <TransactionForm defaultType={defaultType} onClose={() => setShowModal(false)} onSave={onAddTransaction} />
      )}

      {/* ✅ BARU: Modal edit transaksi */}
      {editItem && (
        <TransactionForm
          initialData={editItem}
          onClose={() => setEditItem(null)}
          onSave={(updated) => { onEditTransaction(updated); setEditItem(null); }}
        />
      )}
    </section>
  );
};

// ─── Halaman Pendapatan ───────────────────────────────────────────────────────

const PendapatanPage = ({ transactions, onAddTransaction, onDeleteTransaction, onEditTransaction, onExport, searchQuery }) => {
  const rows = transactions.filter((item) => item.type === "Pendapatan");
  const todayRows = rows.filter((item) => item.date === todayISO());
  const activeBookings = rows.filter((item) => item.status !== "Lunas").length;
  const average = rows.length ? sumByType(rows, "Pendapatan") / rows.length : 0;

  return (
    <div className="page-stack">
      <PageHeader title="Pendapatan" desc="Semua pemasukan dari pemesanan villa" />
      <div className="kpi-grid three">
        <KpiCard title="Pendapatan Hari Ini" value={fmtShort(sumByType(todayRows, "Pendapatan"))} trend={todayRows.length > 0 ? 12 : 0} icon={TrendingUp} accent={C.primary} bg={C.primaryBg} sub={`${todayRows.length} transaksi hari ini`} />
        <KpiCard title="Belum Lunas" value={String(activeBookings)} trend={activeBookings ? -2 : 6} trendInverse icon={Clock} accent={C.amber} bg={C.amberBg} sub="perlu dipantau" />
        <KpiCard title="Rata-rata Transaksi" value={fmtShort(average)} trend={8} icon={Star} accent={C.emerald} bg={C.emeraldBg} sub="semua pemasukan" />
      </div>
      <TransactionTable
        transactions={transactions}
        filterType="Pendapatan"
        onAddTransaction={onAddTransaction}
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
        onExport={onExport}
        searchQuery={searchQuery}
      />
    </div>
  );
};

// ─── Halaman Pengeluaran ──────────────────────────────────────────────────────

const PengeluaranPage = ({ transactions, onAddTransaction, onDeleteTransaction, onEditTransaction, onExport, searchQuery }) => {
  const rows = transactions.filter((item) => item.type === "Pengeluaran");
  const currentRows = filterByMonth(rows, todayISO().slice(0, 7));
  const pendingAmount = rows.filter((item) => item.status !== "Lunas").reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = rows.filter((item) => item.status === "Lunas").reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="page-stack">
      <PageHeader title="Pengeluaran" desc="Manajemen biaya operasional dan pemeliharaan" />
      <div className="kpi-grid three">
        <KpiCard title="Total Bulan Ini" value={fmtShort(sumByType(currentRows, "Pengeluaran"))} trend={5} trendInverse icon={Receipt} accent={C.rose} bg={C.roseBg} sub="bulan berjalan" />
        <KpiCard title="Tertunda" value={fmtShort(pendingAmount)} trend={pendingAmount ? -8 : 5} trendInverse icon={Clock} accent={C.amber} bg={C.amberBg} sub="belum selesai" />
        <KpiCard title="Sudah Dibayar" value={fmtShort(paidAmount)} trend={9} icon={Check} accent={C.emerald} bg={C.emeraldBg} sub="semua periode" />
      </div>
      <TransactionTable
        transactions={transactions}
        filterType="Pengeluaran"
        onAddTransaction={onAddTransaction}
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
        onExport={onExport}
        searchQuery={searchQuery}
      />
    </div>
  );
};

// ─── Halaman Laporan ──────────────────────────────────────────────────────────
// ✅ BARU: Filter per bulan + per villa, tombol Cetak / PDF

const LaporanPage = ({ transactions, onExport, settings }) => {
  const [filterMonth, setFilterMonth] = useState("Semua");
  const [filterVilla, setFilterVilla] = useState("Semua");

  // Daftar bulan yang tersedia dari data
  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach((t) => { if (t.date) months.add(t.date.slice(0, 7)); });
    return [...months].sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Transaksi setelah difilter
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchMonth = filterMonth === "Semua" || t.date?.startsWith(filterMonth);
      const matchVilla = filterVilla === "Semua" || t.villa === filterVilla || (filterVilla === "Semua Villa" && t.villa === "Semua Villa");
      return matchMonth && matchVilla;
    });
  }, [transactions, filterMonth, filterVilla]);

  const summary = summarize(filtered);

  const filterLabel = [
    filterMonth !== "Semua" ? fmtMonthKey(filterMonth) : "",
    filterVilla !== "Semua" ? filterVilla : "",
  ].filter(Boolean).join(" · ") || "Semua Data";

  const hasFilter = filterMonth !== "Semua" || filterVilla !== "Semua";

  // ✅ BARU: Cetak / PDF
  const printReport = () => {
    const w = window.open("", "_blank");
    if (!w) { alert("Popup diblokir browser. Aktifkan popup untuk fitur cetak."); return; }
    w.document.write(generatePrintHtml(filtered, summary, filterLabel, settings));
    w.document.close();
  };

  const reports = [
    { title: "Semua Transaksi", meta: `${filtered.length} baris data`, rows: filtered, label: `Semua Transaksi - ${filterLabel}` },
    { title: "Pendapatan", meta: `${filtered.filter((t) => t.type === "Pendapatan").length} pemasukan`, rows: filtered.filter((t) => t.type === "Pendapatan"), label: `Pendapatan - ${filterLabel}` },
    { title: "Pengeluaran", meta: `${filtered.filter((t) => t.type === "Pengeluaran").length} pengeluaran`, rows: filtered.filter((t) => t.type === "Pengeluaran"), label: `Pengeluaran - ${filterLabel}` },
  ];

  return (
    <div className="page-stack">
      <PageHeader
        title="Laporan Keuangan"
        desc="Filter, cetak, dan export laporan keuangan villa"
        actions={
          <button className="secondary-button" onClick={printReport}>
            <Printer size={15} /> Cetak / PDF
          </button>
        }
      />

      {/* ✅ BARU: Filter bar bulan + villa */}
      <div className="report-filters">
        <div className="filter-group">
          <label>Bulan</label>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="Semua">Semua Bulan</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>{fmtMonthKey(m)}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Villa</label>
          <select value={filterVilla} onChange={(e) => setFilterVilla(e.target.value)}>
            <option value="Semua">Semua Villa</option>
            {properties.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        {hasFilter && (
          <button
            className="secondary-button compact"
            onClick={() => { setFilterMonth("Semua"); setFilterVilla("Semua"); }}
          >
            <X size={13} /> Reset Filter
          </button>
        )}
        {hasFilter && (
          <span className="filter-active-badge">
            {filterLabel}
          </span>
        )}
      </div>

      {/* Summary berdasarkan filter */}
      <div className="report-summary">
        <div>
          <span>Total Pendapatan</span>
          <strong style={{ color: C.primary }}>{fmt(summary.income)}</strong>
        </div>
        <div>
          <span>Total Pengeluaran</span>
          <strong style={{ color: C.rose }}>{fmt(summary.expense)}</strong>
        </div>
        <div>
          <span>Laba Bersih</span>
          <strong>{fmt(summary.profit)}</strong>
        </div>
      </div>

      <div className="report-list">
        {reports.map((report) => (
          <article className="report-row" key={report.title}>
            <div>
              <span className="report-icon"><FileText size={18} /></span>
              <div>
                <h2>{report.title}</h2>
                <p>{report.meta} | format .xls{hasFilter ? ` · ${filterLabel}` : ""}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="secondary-button" onClick={() => onExport(report.rows, report.label)}>
                <Download size={15} /> Unduh Excel
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  const w = window.open("", "_blank");
                  if (!w) return;
                  w.document.write(generatePrintHtml(report.rows, summarize(report.rows), `${report.title} - ${filterLabel}`, settings));
                  w.document.close();
                }}
              >
                <Printer size={15} /> Cetak
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

// ─── Halaman Properti ─────────────────────────────────────────────────────────

const PropertiPage = ({ transactions, onPropChange }) => (
  <div className="page-stack">
    <PageHeader title="Manajemen Properti" desc="Ringkasan performa setiap villa" />
    <div className="property-grid">
      {properties.map((property, index) => {
        const rows = transactions.filter((item) => item.villa === property.name || item.villa === "Semua Villa");
        const summary = summarize(rows);
        return (
          <button className="property-card" key={property.id} onClick={() => onPropChange(index)}>
            <span className="property-card-icon"><Building2 size={22} /></span>
            <h2>{property.name}</h2>
            <p>{property.location}</p>
            <div className="property-stats">
              <span><strong>{property.rooms}</strong>Kamar</span>
              <span><strong>{property.rating}</strong>Rating</span>
              <span><strong>{fmtShort(summary.profit)}</strong>Laba</span>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

// ─── Halaman Pengaturan ───────────────────────────────────────────────────────
// ✅ BARU: Form ganti password

const PengaturanPage = ({ settings, setSettings, transactions, onExport, backendStatus, session }) => {
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  // State form ganti password
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  const update = (field, value) => {
    setSaved(false);
    setDraft((c) => ({ ...c, [field]: value }));
  };

  const updatePw = (field, value) => {
    setPwMsg(null);
    setPwForm((c) => ({ ...c, [field]: value }));
  };

  // ✅ BARU: Ganti password
  const changePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.current) { setPwMsg({ type: "error", text: "Isi password lama terlebih dahulu." }); return; }
    if (pwForm.next.length < 4) { setPwMsg({ type: "error", text: "Password baru minimal 4 karakter." }); return; }
    if (pwForm.next !== pwForm.confirm) { setPwMsg({ type: "error", text: "Konfirmasi password baru tidak cocok." }); return; }

    setPwLoading(true);
    try {
      await apiRequest("/users/password", {
        method: "PUT",
        body: JSON.stringify({
          email: session?.email || settings.email,
          currentPassword: pwForm.current,
          newPassword: pwForm.next,
        }),
      });
      setPwMsg({ type: "success", text: "Password berhasil diubah." });
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      const msg = err.message || "";
      setPwMsg({
        type: "error",
        text: msg.includes("lama") || msg.includes("401") ? "Password lama tidak sesuai." : "Gagal mengubah password. Pastikan backend aktif.",
      });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader title="Pengaturan" desc="Konfigurasi akun, password, backend, dan database" />

      <div className="settings-grid">
        {/* Kolom kiri: info perusahaan + ganti password */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Form info perusahaan */}
          <form
            className="settings-panel"
            onSubmit={(e) => {
              e.preventDefault();
              setSettings(draft);
              setSaved(true);
            }}
          >
            <label className="form-field">
              <span>Nama Perusahaan</span>
              <input value={draft.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </label>
            <label className="form-field">
              <span>Email</span>
              <input value={draft.email} onChange={(e) => update("email", e.target.value)} />
            </label>
            <label className="form-field">
              <span>Mata Uang</span>
              <input value={draft.currency} onChange={(e) => update("currency", e.target.value)} />
            </label>
            <label className="form-field">
              <span>Zona Waktu</span>
              <input value={draft.timezone} onChange={(e) => update("timezone", e.target.value)} />
            </label>
            <div className="form-actions left">
              <button className="primary-button" type="submit">
                <Check size={17} /> Simpan
              </button>
              {saved && <span className="saved-note">Tersimpan</span>}
            </div>
          </form>

          {/* ✅ BARU: Form ganti password */}
          <form className="pw-panel" onSubmit={changePassword}>
            <div className="pw-panel-header">
              <span className="pw-icon"><KeyRound size={17} /></span>
              <div>
                <h2>Ganti Password</h2>
                <p>Ubah password login akun admin</p>
              </div>
            </div>
            <div className="pw-fields">
              <label className="form-field">
                <span>Password Lama</span>
                <input type="password" value={pwForm.current} onChange={(e) => updatePw("current", e.target.value)} autoComplete="current-password" />
              </label>
              <label className="form-field">
                <span>Password Baru</span>
                <input type="password" value={pwForm.next} onChange={(e) => updatePw("next", e.target.value)} placeholder="Minimal 4 karakter" autoComplete="new-password" />
              </label>
              <label className="form-field">
                <span>Konfirmasi Password Baru</span>
                <input type="password" value={pwForm.confirm} onChange={(e) => updatePw("confirm", e.target.value)} autoComplete="new-password" />
              </label>
            </div>
            {pwMsg && (
              <p className={pwMsg.type === "error" ? "form-error" : "pw-success"}>
                {pwMsg.text}
              </p>
            )}
            <div className="form-actions left" style={{ marginTop: 14 }}>
              <button className="primary-button" type="submit" disabled={pwLoading}>
                <KeyRound size={15} />
                {pwLoading ? "Menyimpan..." : "Ubah Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Kolom kanan: database panel */}
        <section className="database-panel">
          <div className="database-icon"><Database size={22} /></div>
          <h2>Database Backend</h2>
          <span className={`backend-status ${backendStatus}`}>
            {backendStatus === "online" ? "Backend online" : backendStatus === "checking" ? "Mengecek backend" : "Mode offline lokal"}
          </span>
          <p>{transactions.length} transaksi tersimpan dan siap dibackup.</p>
          <button className="secondary-button" onClick={() => onExport(transactions, "Backup Database")}>
            <Download size={15} /> Download Backup Excel
          </button>
        </section>
      </div>
    </div>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [activeProp, setActiveProp] = useState(0);
  const [notif, setNotif] = useState(3);
  const toast = useToast();
  const [backendStatus, setBackendStatus] = useState("checking");
  const [globalSearch, setGlobalSearch] = useState(""); // ✅ BARU: global search

  const [session, setSession] = useStoredState(STORAGE.session, null);
  const [storedTransactions, setStoredTransactions] = useStoredState(STORAGE.transactions, initialTransactions);
  const [settings, setSettings] = useStoredState(STORAGE.settings, defaultSettings);

  const transactions = useMemo(() => normalizeTransactions(storedTransactions), [storedTransactions]);
  const appSettings = { ...defaultSettings, ...settings };

  useEffect(() => {
    let active = true;
    apiRequest("/bootstrap")
      .then((data) => {
        if (!active) return;
        setStoredTransactions(normalizeTransactions(data.transactions || initialTransactions));
        setSettings({ ...defaultSettings, ...(data.settings || {}) });
        setBackendStatus("online");
      })
      .catch(() => { if (active) setBackendStatus("offline"); });
    return () => { active = false; };
  }, [setSettings, setStoredTransactions]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await apiRequest("/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setSession(data.user);
      setBackendStatus("online");
      return true;
    } catch {
      const valid = email.trim().toLowerCase() === LOGIN_USER.email && password === LOGIN_USER.password;
      if (!valid) return false;
      setSession({ email: LOGIN_USER.email, name: LOGIN_USER.name, role: LOGIN_USER.role, initials: LOGIN_USER.initials, loginAt: new Date().toISOString() });
      setBackendStatus((s) => (s === "checking" ? "offline" : s));
      return true;
    }
  };

  const addTransaction = async (transaction) => {
    setStoredTransactions((current) => [transaction, ...normalizeTransactions(current)]);
    setNotif((c) => c + 1);
    toast.show(
      "Transaksi Ditambahkan",
      `${transaction.type}: ${transaction.description} — ${fmt(transaction.amount)}`,
      "success"
    );
    try {
      const data = await apiRequest("/transactions", { method: "POST", body: JSON.stringify(transaction) });
      setStoredTransactions(normalizeTransactions(data.transactions));
      setBackendStatus("online");
    } catch { setBackendStatus("offline"); }
  };

  const editTransaction = async (transaction) => {
    setStoredTransactions((current) => [
      transaction,
      ...normalizeTransactions(current).filter((item) => item.id !== transaction.id),
    ]);
    toast.show(
      "Transaksi Diperbarui",
      `${transaction.description} berhasil diubah.`,
      "success"
    );
    try {
      const data = await apiRequest("/transactions", { method: "POST", body: JSON.stringify(transaction) });
      setStoredTransactions(normalizeTransactions(data.transactions));
      setBackendStatus("online");
    } catch { setBackendStatus("offline"); }
  };

  const deleteTransaction = async (id) => {
    setStoredTransactions((current) => normalizeTransactions(current).filter((item) => item.id !== id));
    toast.show("Transaksi Dihapus", "Data transaksi telah dihapus.", "info");
    try {
      const data = await apiRequest(`/transactions/${encodeURIComponent(id)}`, { method: "DELETE" });
      setStoredTransactions(normalizeTransactions(data.transactions));
      setBackendStatus("online");
    } catch { setBackendStatus("offline"); }
  };

  const saveSettings = async (nextSettings) => {
    setSettings(nextSettings);
    try {
      const data = await apiRequest("/settings", { method: "PUT", body: JSON.stringify(nextSettings) });
      setSettings({ ...defaultSettings, ...(data.settings || nextSettings) });
      setBackendStatus("online");
    } catch { setBackendStatus("offline"); }
  };

  const exportRows = (rows = transactions, label = "Semua Transaksi") => {
    downloadExcel(rows, label, appSettings);
  };

  const renderPage = () => {
    const commonProps = {
      transactions,
      onAddTransaction: addTransaction,
      onDeleteTransaction: deleteTransaction,
      onEditTransaction: editTransaction,
      onExport: exportRows,
      searchQuery: globalSearch,
    };

    switch (page) {
      case "dashboard":
        return <DashboardPage {...commonProps} activeProp={activeProp} />;
      case "pendapatan":
        return <PendapatanPage {...commonProps} />;
      case "pengeluaran":
        return <PengeluaranPage {...commonProps} />;
      case "laporan":
        return <LaporanPage transactions={transactions} onExport={exportRows} settings={appSettings} />;
      case "properti":
        return <PropertiPage transactions={transactions} onPropChange={setActiveProp} />;
      case "pengaturan":
        return (
          <PengaturanPage
            settings={appSettings}
            setSettings={saveSettings}
            transactions={transactions}
            onExport={exportRows}
            backendStatus={backendStatus}
            session={session}
          />
        );
      default:
        return <DashboardPage {...commonProps} activeProp={activeProp} />;
    }
  };

  if (!session?.email) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        activePage={page}
        onNav={(p) => { setPage(p); setGlobalSearch(""); }}
        activeProp={activeProp}
        onPropChange={setActiveProp}
        onLogout={() => setSession(null)}
      />

      <div className="main-area">
        <TopBar
          user={session}
          notif={notif}
          onClearNotif={() => setNotif(0)}
          onExport={() => exportRows(transactions, "Backup Semua Transaksi")}
          transactions={transactions}
          globalSearch={globalSearch}
          onSearch={setGlobalSearch}
        />
        <main className="content">{renderPage()}</main>
      </div>

      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </div>
  );
}
