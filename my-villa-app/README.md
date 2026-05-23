# Therainvillas Finance

Dashboard keuangan villa dengan login, pencatatan pendapatan/pengeluaran, backup Excel, dan backend Node.js sederhana.

## Login

- Email: `admin@therainvillas.id`
- Password: `villa123`

## Jalankan Frontend + Backend

```bash
npm run dev:full
```

Frontend berjalan di `http://127.0.0.1:5173`.
Backend API berjalan di `http://127.0.0.1:4174`.

## Script Penting

```bash
npm run dev       # frontend Vite saja
npm run backend   # backend API + database JSON saja
npm run dev:full  # frontend dan backend bersamaan
npm run build     # build frontend produksi
npm run start     # serve backend dan dist produksi
```

Database backend tersimpan di `server/data/database.json` dan akan dibuat otomatis saat backend pertama kali berjalan.
