import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Home, TrendingUp, FileText, Settings, ChevronLeft,
  ChevronRight, Bell, Search, Download, Plus, ArrowUpRight,
  ArrowDownRight, Building2, Users, RefreshCw, X, Check,
  Clock, LogOut, ChevronsUpDown, Wallet, Receipt,
  ChevronDown, Star
} from "lucide-react";

// ─── Design Tokens ───────────────────────────────────────────────
const T = {
  primary: "#006948",
  primaryDark: "#005137",
  primaryLight: "#00855d",
  primaryBg: "rgba(0,105,72,0.08)",
  bg: "#f7f9fb",
  surface: "#ffffff",
  surfaceLow: "#f2f4f6",
  surfaceContainer: "#eceef0",
  text: "#191c1e",
  textMuted: "#6d7a72",
  textSub: "#3d4a42",
  border: "#e0e3e5",
  borderMid: "#bccac0",
  rose: "#E11D48",
  roseBg: "rgba(225,29,72,0.08)",
  amber: "#F59E0B",
  amberBg: "rgba(245,158,11,0.08)",
  sapphire: "#2563EB",
  sapphireBg: "rgba(37,99,235,0.08)",
  emerald: "#059669",
  emeraldBg: "rgba(5,150,105,0.08)",
  shadow: "0 4px 20px rgba(15,23,42,0.05)",
  shadowHover: "0 8px 30px rgba(15,23,42,0.10)",
};

// ─── Mock Data ───────────────────────────────────────────────────
const properties = [
  { id: 1, name: "Villa Seminyak", location: "Bali", rooms: 5, rating: 4.9 },
  { id: 2, name: "Villa Ubud", location: "Bali", rooms: 3, rating: 4.7 },
  { id: 3, name: "Villa Nusa Dua", location: "Bali", rooms: 7, rating: 4.8 },
];

const revenueData = [
  { bulan: "Jan", pendapatan: 42000000, pengeluaran: 18000000, laba: 24000000 },
  { bulan: "Feb", pendapatan: 38500000, pengeluaran: 16500000, laba: 22000000 },
  { bulan: "Mar", pendapatan: 55000000, pengeluaran: 21000000, laba: 34000000 },
  { bulan: "Apr", pendapatan: 61000000, pengeluaran: 23500000, laba: 37500000 },
  { bulan: "Mei", pendapatan: 72000000, pengeluaran: 28000000, laba: 44000000 },
  { bulan: "Jun", pendapatan: 85000000, pengeluaran: 31000000, laba: 54000000 },
  { bulan: "Jul", pendapatan: 91000000, pengeluaran: 33000000, laba: 58000000 },
  { bulan: "Agu", pendapatan: 88000000, pengeluaran: 30500000, laba: 57500000 },
  { bulan: "Sep", pendapatan: 76000000, pengeluaran: 27000000, laba: 49000000 },
  { bulan: "Okt", pendapatan: 68000000, pengeluaran: 25000000, laba: 43000000 },
  { bulan: "Nov", pendapatan: 79000000, pengeluaran: 29000000, laba: 50000000 },
  { bulan: "Des", pendapatan: 95000000, pengeluaran: 35000000, laba: 60000000 },
];

const expenseCategories = [
  { name: "Operasional", value: 35, color: T.sapphire, bg: T.sapphireBg },
  { name: "Perawatan", value: 25, color: T.amber, bg: T.amberBg },
  { name: "Gaji Staf", value: 22, color: T.primary, bg: T.primaryBg },
  { name: "Utilitas", value: 12, color: T.rose, bg: T.roseBg },
  { name: "Lainnya", value: 6, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
];

const transactions = [
  { id: "TRX-001", tamu: "Hiroshi Tanaka", villa: "Villa Seminyak", tanggal: "15 Jun 2025", jumlah: 12500000, tipe: "Pendapatan", status: "Lunas" },
  { id: "TRX-002", tamu: "Sarah Mitchell", villa: "Villa Ubud", tanggal: "14 Jun 2025", jumlah: 8750000, tipe: "Pendapatan", status: "Lunas" },
  { id: "TRX-003", tamu: "Tagihan Listrik", villa: "Villa Seminyak", tanggal: "13 Jun 2025", jumlah: 2100000, tipe: "Pengeluaran", status: "Lunas" },
  { id: "TRX-004", tamu: "Emma van der Berg", villa: "Villa Nusa Dua", tanggal: "12 Jun 2025", jumlah: 18200000, tipe: "Pendapatan", status: "Tertunda" },
  { id: "TRX-005", tamu: "Biaya Perawatan AC", villa: "Villa Ubud", tanggal: "11 Jun 2025", jumlah: 3500000, tipe: "Pengeluaran", status: "Lunas" },
  { id: "TRX-006", tamu: "David Chen", villa: "Villa Seminyak", tanggal: "10 Jun 2025", jumlah: 9800000, tipe: "Pendapatan", status: "Jatuh Tempo" },
  { id: "TRX-007", tamu: "Gaji Staf Juni", villa: "Semua Villa", tanggal: "05 Jun 2025", jumlah: 14000000, tipe: "Pengeluaran", status: "Lunas" },
  { id: "TRX-008", tamu: "Klaus Müller", villa: "Villa Nusa Dua", tanggal: "03 Jun 2025", jumlah: 22500000, tipe: "Pendapatan", status: "Lunas" },
];

const occupancyData = [
  { bulan: "Jan", seminyak: 65, ubud: 58, nusaDua: 72 },
  { bulan: "Feb", seminyak: 70, ubud: 62, nusaDua: 68 },
  { bulan: "Mar", seminyak: 80, ubud: 75, nusaDua: 82 },
  { bulan: "Apr", seminyak: 85, ubud: 78, nusaDua: 88 },
  { bulan: "Mei", seminyak: 90, ubud: 82, nusaDua: 91 },
  { bulan: "Jun", seminyak: 94, ubud: 88, nusaDua: 95 },
];

// ─── Helpers ──────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 1e9 ? `Rp${(n / 1e9).toFixed(1)}M` : n >= 1e6 ? `Rp${(n / 1e6).toFixed(0)}jt` : `Rp${n}`;

const StatusChip = ({ status }) => {
  const cfg = {
    Lunas: { bg: T.emeraldBg, color: T.emerald, icon: <Check size={11} /> },
    Tertunda: { bg: T.amberBg, color: T.amber, icon: <Clock size={11} /> },
    "Jatuh Tempo": { bg: T.roseBg, color: T.rose, icon: <X size={11} /> },
  }[status] || { bg: T.surfaceLow, color: T.textMuted, icon: null };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: cfg.bg, color: cfg.color, fontFamily: "Inter, sans-serif"
    }}>
      {cfg.icon}{status}
    </span>
  );
};

const TrendBadge = ({ val, inverse }) => {
  const up = inverse ? val < 0 : val >= 0;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 2,
      padding: "2px 8px", borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: up ? T.emeraldBg : T.roseBg,
      color: up ? T.emerald : T.rose, fontFamily: "Inter, sans-serif"
    }}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(val)}%
    </span>
  );
};

// ─── Custom Tooltip ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", boxShadow: T.shadow, fontFamily: "Inter, sans-serif", fontSize: 13 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 600, color: T.text }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "2px 0", color: p.color }}>
          {p.name}: <strong>{fmtShort(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

// ─── Sidebar ─────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "pendapatan", label: "Pendapatan", icon: TrendingUp },
  { id: "pengeluaran", label: "Pengeluaran", icon: Receipt },
  { id: "laporan", label: "Laporan", icon: FileText },
  { id: "properti", label: "Properti", icon: Building2 },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

const Sidebar = ({ collapsed, onToggle, activePage, onNav, activeProp, onPropChange }) => {
  const [propOpen, setPropOpen] = useState(false);
  const propRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (propRef.current && !propRef.current.contains(e.target)) setPropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside style={{
      width: collapsed ? 80 : 280, minWidth: collapsed ? 80 : 280,
      height: "100vh", background: T.surface, borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column", transition: "width 0.25s ease, min-width 0.25s ease",
      position: "relative", zIndex: 10, overflow: "visible"
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "24px 16px" : "24px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Star size={18} color="white" fill="white" />
        </div>
        {!collapsed && (
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: T.text }}>
            Villa<span style={{ color: T.primary }}>Fin</span>
          </span>
        )}
      </div>

      {/* Property Switcher */}
      {!collapsed && (
        <div style={{ padding: "16px", borderBottom: `1px solid ${T.border}`, position: "relative" }} ref={propRef}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Properti Aktif</p>
          <button onClick={() => setPropOpen(!propOpen)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 12px", borderRadius: 10, border: `1px solid ${T.border}`,
            background: T.bg, cursor: "pointer", gap: 8
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: T.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building2 size={14} color={T.primary} />
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{properties[activeProp].name}</span>
            </div>
            <ChevronsUpDown size={14} color={T.textMuted} />
          </button>
          {propOpen && (
            <div style={{
              position: "absolute", top: "100%", left: 16, right: 16, zIndex: 50,
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
              boxShadow: T.shadowHover, overflow: "hidden"
            }}>
              {properties.map((p, i) => (
                <button key={p.id} onClick={() => { onPropChange(i); setPropOpen(false); }} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                  background: i === activeProp ? T.primaryBg : "transparent", cursor: "pointer",
                  borderBottom: i < properties.length - 1 ? `1px solid ${T.border}` : "none"
                }}>
                  <Building2 size={14} color={i === activeProp ? T.primary : T.textMuted} />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: i === activeProp ? T.primary : T.text, margin: 0 }}>{p.name}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: T.textMuted, margin: 0 }}>{p.rooms} kamar · ★ {p.rating}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        {!collapsed && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", padding: "8px 8px 4px" }}>Menu Utama</p>}
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          return (
            <button key={id} onClick={() => onNav(id)} title={collapsed ? label : undefined} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: collapsed ? "12px" : "10px 12px", borderRadius: 10, marginBottom: 2,
              background: active ? T.primaryBg : "transparent", cursor: "pointer",
              justifyContent: collapsed ? "center" : "flex-start",
              transition: "background 0.15s"
            }}>
              <Icon size={18} color={active ? T.primary : T.textMuted} />
              {!collapsed && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: active ? 600 : 400, color: active ? T.primary : T.text }}>{label}</span>}
              {!collapsed && active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: 999, background: T.primary }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px", borderTop: `1px solid ${T.border}` }}>
        <button style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "12px" : "10px 12px",
          borderRadius: 10, background: "transparent", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start"
        }}>
          <LogOut size={16} color={T.rose} />
          {!collapsed && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: T.rose, fontWeight: 500 }}>Keluar</span>}
        </button>
      </div>

      {/* Toggle */}
      <button onClick={onToggle} style={{
        position: "absolute", top: 28, right: -14, width: 28, height: 28,
        borderRadius: 999, background: T.surface, border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        boxShadow: T.shadow, zIndex: 20
      }}>
        {collapsed ? <ChevronRight size={14} color={T.textMuted} /> : <ChevronLeft size={14} color={T.textMuted} />}
      </button>
    </aside>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────
const KpiCard = ({ title, value, trend, trendInverse, icon: Icon, iconColor, iconBg, sub }) => (
  <div style={{
    background: T.surface, borderRadius: 16, padding: 24,
    boxShadow: T.shadow, border: `1px solid ${T.border}`, flex: 1, minWidth: 0,
    transition: "box-shadow 0.2s", cursor: "default"
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowHover}
    onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: T.textMuted, margin: 0, fontWeight: 500 }}>{title}</p>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={18} color={iconColor} />
      </div>
    </div>
    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>{value}</p>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <TrendBadge val={trend} inverse={trendInverse} />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted }}>{sub}</span>
    </div>
  </div>
);

// ─── Dashboard Page ───────────────────────────────────────────────
const DashboardPage = ({ prop }) => {
  const [period, setPeriod] = useState("2025");
  const [chartType, setChartType] = useState("area");

  const currentMonth = revenueData[5];
  const prevMonth = revenueData[4];

  return (
    <div>
      {/* Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Dashboard Keuangan</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: T.textMuted, margin: 0 }}>{properties[prop].name} · {properties[prop].location}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {["2023", "2024", "2025"].map(y => (
            <button key={y} onClick={() => setPeriod(y)} style={{
              padding: "8px 16px", borderRadius: 8, fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
              background: period === y ? T.primary : T.surface, color: period === y ? "white" : T.textMuted,
              border: `1px solid ${period === y ? T.primary : T.border}`, cursor: "pointer"
            }}>{y}</button>
          ))}
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, color: T.text }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <KpiCard title="Total Pendapatan" value="Rp 851jt" trend={12} icon={TrendingUp} iconColor={T.primary} iconBg={T.primaryBg} sub="vs bulan lalu" />
        <KpiCard title="Laba Bersih" value="Rp 533jt" trend={9} icon={Wallet} iconColor={T.emerald} iconBg={T.emeraldBg} sub="vs bulan lalu" />
        <KpiCard title="Total Pengeluaran" value="Rp 318jt" trend={5} trendInverse icon={Receipt} iconColor={T.rose} iconBg={T.roseBg} sub="vs bulan lalu" />
        <KpiCard title="Tingkat Okupansi" value="92%" trend={3} icon={Users} iconColor={T.sapphire} iconBg={T.sapphireBg} sub="vs bulan lalu" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div style={{ flex: 2, background: T.surface, borderRadius: 16, padding: 24, boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 2px" }}>Tren Pendapatan & Pengeluaran</h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted, margin: 0 }}>Januari – Desember {period}</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["area", "bar"].map(t => (
                <button key={t} onClick={() => setChartType(t)} style={{
                  padding: "6px 12px", borderRadius: 6, fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 500,
                  background: chartType === t ? T.primaryBg : "transparent",
                  color: chartType === t ? T.primary : T.textMuted,
                  border: `1px solid ${chartType === t ? T.primary : T.border}`, cursor: "pointer"
                }}>{t === "area" ? "Area" : "Batang"}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {[["Pendapatan", T.primary], ["Pengeluaran", T.rose], ["Laba Bersih", T.emerald]].map(([lbl, clr]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: clr }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted }}>{lbl}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            {chartType === "area" ? (
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="gPend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.primary} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={T.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPeng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.rose} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={T.rose} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${v / 1e6}jt`} tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke={T.primary} fill="url(#gPend)" strokeWidth={2.5} dot={false} />
                <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke={T.rose} fill="url(#gPeng)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="laba" name="Laba Bersih" stroke={T.emerald} fill="none" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              </AreaChart>
            ) : (
              <BarChart data={revenueData} barSize={10} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="bulan" tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${v / 1e6}jt`} tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pendapatan" name="Pendapatan" fill={T.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill={T.rose} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div style={{ flex: 1, background: T.surface, borderRadius: 16, padding: 24, boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 4px" }}>Distribusi Pengeluaran</h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted, marginBottom: 16 }}>Juni {period}</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}` }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {expenseCategories.map((e) => (
              <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textSub }}>{e.name}</span>
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.text }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Occupancy Chart */}
      <div style={{ background: T.surface, borderRadius: 16, padding: 24, boxShadow: T.shadow, border: `1px solid ${T.border}`, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 2px" }}>Tingkat Okupansi per Properti</h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted, margin: 0 }}>Jan–Jun {period} (%)</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[["Villa Seminyak", T.primary], ["Villa Ubud", T.sapphire], ["Villa Nusa Dua", T.amber]].map(([lbl, clr]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: clr }} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={occupancyData} barSize={16} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
            <XAxis dataKey="bulan" tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontFamily: "Inter, sans-serif", fontSize: 11, fill: T.textMuted }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontFamily: "Inter, sans-serif", fontSize: 12, borderRadius: 8 }} formatter={(v) => `${v}%`} />
            <Bar dataKey="seminyak" name="Villa Seminyak" fill={T.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="ubud" name="Villa Ubud" fill={T.sapphire} radius={[4, 4, 0, 0]} />
            <Bar dataKey="nusaDua" name="Villa Nusa Dua" fill={T.amber} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <TransactionTable />
    </div>
  );
};

// ─── Transaction Table ────────────────────────────────────────────
const TransactionTable = ({ filterType }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterType || "Semua");
  const [showModal, setShowModal] = useState(false);

  const filtered = transactions.filter(t =>
    (filter === "Semua" || t.tipe === filter) &&
    (t.tamu.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search))
  );

  return (
    <div style={{ background: T.surface, borderRadius: 16, padding: 24, boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 600, color: T.text, margin: 0 }}>Transaksi Terbaru</h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} color={T.textMuted} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari transaksi..." style={{
              paddingLeft: 32, paddingRight: 12, height: 36, borderRadius: 8, border: `1px solid ${T.border}`,
              fontFamily: "Inter, sans-serif", fontSize: 13, color: T.text, background: T.bg, outline: "none", width: 200
            }} />
          </div>
          {["Semua", "Pendapatan", "Pengeluaran"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 500,
              background: filter === f ? T.primary : T.surface, color: filter === f ? "white" : T.textMuted,
              border: `1px solid ${filter === f ? T.primary : T.border}`, cursor: "pointer"
            }}>{f}</button>
          ))}
          <button onClick={() => setShowModal(true)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8,
            background: T.primary, color: "white", border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500
          }}><Plus size={14} /> Tambah</button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["ID", "Nama / Deskripsi", "Villa", "Tanggal", "Jumlah", "Tipe", "Status"].map(h => (
                <th key={h} style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: T.textMuted, textAlign: "left", padding: "8px 12px", letterSpacing: "0.04em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: `1px solid ${i === filtered.length - 1 ? "transparent" : T.border}`, transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = T.bg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "14px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted }}>{t.id}</td>
                <td style={{ padding: "14px 12px", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: T.text }}>{t.tamu}</td>
                <td style={{ padding: "14px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textSub }}>{t.villa}</td>
                <td style={{ padding: "14px 12px", fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted }}>{t.tanggal}</td>
                <td style={{ padding: "14px 12px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: t.tipe === "Pendapatan" ? T.primary : T.rose }}>
                  {t.tipe === "Pengeluaran" ? "-" : "+"}{fmt(t.jumlah)}
                </td>
                <td style={{ padding: "14px 12px" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: t.tipe === "Pendapatan" ? T.primary : T.rose, background: t.tipe === "Pendapatan" ? T.primaryBg : T.roseBg, padding: "3px 10px", borderRadius: 999, fontWeight: 500 }}>{t.tipe}</span>
                </td>
                <td style={{ padding: "14px 12px" }}><StatusChip status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, fontFamily: "Inter, sans-serif", fontSize: 14, color: T.textMuted }}>Tidak ada transaksi ditemukan.</div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: T.surface, borderRadius: 20, padding: 32, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>Tambah Transaksi</h2>
              <button onClick={() => setShowModal(false)} style={{ background: T.surfaceContainer, border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} color={T.textMuted} /></button>
            </div>
            {["Deskripsi", "Jumlah (Rp)", "Villa", "Tanggal"].map(field => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 6, letterSpacing: "0.04em" }}>{field.toUpperCase()}</label>
                <input placeholder={`Masukkan ${field.toLowerCase()}...`} style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${T.border}`,
                  fontFamily: "Inter, sans-serif", fontSize: 14, color: T.text, background: T.bg, outline: "none", boxSizing: "border-box"
                }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface, fontFamily: "Inter, sans-serif", fontWeight: 500, cursor: "pointer", color: T.textMuted }}>Batal</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 2, padding: 12, borderRadius: 10, border: "none", background: T.primary, color: "white", fontFamily: "Inter, sans-serif", fontWeight: 600, cursor: "pointer" }}>Simpan Transaksi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Placeholder Pages ────────────────────────────────────────────
const PlaceholderPage = ({ title, desc, children }) => (
  <div>
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>{title}</h1>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: T.textMuted, margin: 0 }}>{desc}</p>
    </div>
    {children}
  </div>
);

const PendapatanPage = () => (
  <PlaceholderPage title="Pendapatan" desc="Semua pemasukan dari pemesanan vila">
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      {[["Total Bulan Ini", "Rp 85jt", T.primary, T.primaryBg, TrendingUp], ["Pemesanan Aktif", "24", T.sapphire, T.sapphireBg, Users], ["Rata-rata/Malam", "Rp 3.5jt", T.emerald, T.emeraldBg, Star]].map(([l, v, c, bg, Icon]) => (
        <div key={l} style={{ flex: 1, background: T.surface, borderRadius: 16, padding: 24, boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: T.textMuted }}>{l}</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={16} color={c} /></div>
          </div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>{v}</p>
        </div>
      ))}
    </div>
    <TransactionTable filterType="Pendapatan" />
  </PlaceholderPage>
);

const PengeluaranPage = () => (
  <PlaceholderPage title="Pengeluaran" desc="Manajemen biaya operasional & pemeliharaan">
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      {[["Total Bulan Ini", "Rp 31jt", T.rose, T.roseBg, Receipt], ["Tertunda", "Rp 5.6jt", T.amber, T.amberBg, Clock], ["Disetujui", "Rp 25.4jt", T.emerald, T.emeraldBg, Check]].map(([l, v, c, bg, Icon]) => (
        <div key={l} style={{ flex: 1, background: T.surface, borderRadius: 16, padding: 24, boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: T.textMuted }}>{l}</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={16} color={c} /></div>
          </div>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 700, color: T.text, margin: 0 }}>{v}</p>
        </div>
      ))}
    </div>
    <TransactionTable filterType="Pengeluaran" />
  </PlaceholderPage>
);

const PropertiPage = ({ onPropChange }) => (
  <PlaceholderPage title="Manajemen Properti" desc="Informasi dan performa setiap vila">
    <div style={{ display: "flex", gap: 16 }}>
      {properties.map((p, i) => (
        <div key={p.id} onClick={() => onPropChange(i)} style={{
          flex: 1, background: T.surface, borderRadius: 16, padding: 24,
          boxShadow: T.shadow, border: `1px solid ${T.border}`, cursor: "pointer", transition: "box-shadow 0.2s"
        }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowHover}
          onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}
        >
          <div style={{ width: 48, height: 48, borderRadius: 14, background: T.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Building2 size={22} color={T.primary} />
          </div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>{p.name}</h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: T.textMuted, margin: "0 0 16px" }}>{p.location}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ background: T.bg, borderRadius: 8, padding: "8px 12px", flex: 1, textAlign: "center" }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: T.text, margin: 0 }}>{p.rooms}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: T.textMuted, margin: 0 }}>Kamar</p>
            </div>
            <div style={{ background: T.bg, borderRadius: 8, padding: "8px 12px", flex: 1, textAlign: "center" }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: T.primary, margin: 0 }}>★ {p.rating}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: T.textMuted, margin: 0 }}>Rating</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </PlaceholderPage>
);

const LaporanPage = () => (
  <PlaceholderPage title="Laporan Keuangan" desc="Unduh dan analisis laporan terperinci">
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        ["Laporan Laba Rugi – Juni 2025", "PDF · 2.4 MB · Dihasilkan 1 Jul 2025"],
        ["Laporan Arus Kas – Q2 2025", "XLSX · 1.1 MB · Dihasilkan 30 Jun 2025"],
        ["Rekap Pemesanan – Juni 2025", "PDF · 850 KB · Dihasilkan 2 Jul 2025"],
        ["Laporan Pengeluaran – Juni 2025", "PDF · 1.3 MB · Dihasilkan 1 Jul 2025"],
      ].map(([name, meta]) => (
        <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.surface, borderRadius: 12, padding: "16px 20px", boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={18} color={T.primary} />
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: T.text, margin: 0 }}>{name}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: T.textMuted, margin: 0 }}>{meta}</p>
            </div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: T.primaryBg, color: T.primary, border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600 }}>
            <Download size={14} /> Unduh
          </button>
        </div>
      ))}
    </div>
  </PlaceholderPage>
);

const PengaturanPage = () => (
  <PlaceholderPage title="Pengaturan" desc="Konfigurasi akun dan preferensi platform">
    <div style={{ background: T.surface, borderRadius: 16, padding: 28, boxShadow: T.shadow, border: `1px solid ${T.border}` }}>
      {[["Nama Perusahaan", "PT Bali Villa Indah"], ["Email", "admin@balividilla.com"], ["Mata Uang", "IDR (Rupiah Indonesia)"], ["Zona Waktu", "WIB (UTC+7)"]].map(([l, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: T.textMuted }}>{l}</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, color: T.text }}>{v}</span>
        </div>
      ))}
      <button style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, background: T.primary, color: "white", border: "none", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Simpan Perubahan</button>
    </div>
  </PlaceholderPage>
);

// ─── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [activeProp, setActiveProp] = useState(0);
  const [notif, setNotif] = useState(3);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Inter:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage prop={activeProp} />;
      case "pendapatan": return <PendapatanPage />;
      case "pengeluaran": return <PengeluaranPage />;
      case "laporan": return <LaporanPage />;
      case "properti": return <PropertiPage onPropChange={setActiveProp} />;
      case "pengaturan": return <PengaturanPage />;
      default: return <DashboardPage prop={activeProp} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "Inter, sans-serif", overflow: "hidden" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activePage={page}
        onNav={setPage}
        activeProp={activeProp}
        onPropChange={setActiveProp}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <header style={{
          height: 64, background: T.surface, borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 28px", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} color={T.textMuted} />
              <input placeholder="Cari apa saja..." style={{
                paddingLeft: 36, paddingRight: 16, height: 38, borderRadius: 10, border: `1px solid ${T.border}`,
                fontFamily: "Inter, sans-serif", fontSize: 13, color: T.text, background: T.bg, outline: "none", width: 260
              }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setNotif(0)} style={{ position: "relative", width: 38, height: 38, borderRadius: 10, background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Bell size={17} color={T.textMuted} />
              {notif > 0 && (
                <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: 999, background: T.rose, border: `2px solid ${T.surface}` }} />
              )}
            </button>
            <button style={{ width: 38, height: 38, borderRadius: 10, background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RefreshCw size={15} color={T.textMuted} />
            </button>
            <div style={{ width: 1, height: 24, background: T.border }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.primaryBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: T.primary }}>RB</span>
              </div>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: T.text, margin: 0 }}>Rizky Budiman</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: T.textMuted, margin: 0 }}>Administrator</p>
              </div>
              <ChevronDown size={14} color={T.textMuted} />
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}