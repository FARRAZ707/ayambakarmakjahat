# 📊 IoT Dashboard — Smart Storage

Aplikasi mobile **IoT Dashboard** berbasis React Native (Expo) untuk memantau data sensor secara real-time, dilengkapi grafik tren, data logger, dan integrasi backend Firebase Firestore.

Proyek ini dibuat sebagai **Tugas Besar (TUBES) Mata Kuliah Mobile Computing**.

---

## 👥 Anggota Kelompok

| Nama | NIM | Peran |
|------|-----|-------|
| Farras Risqy Setiawan | 0923040045 | UI/UX |
| Bayu Trio Apriliawan | 0923040033 | Axios (Integrasi API) |
| Dwi Putra Aprilana | 0923040040 | Database |

---

## ✨ Fitur Utama

- **Dashboard Interaktif** — kartu sensor real-time dengan indikator status, grafik tren (line & bar chart), statistik ringkasan, pull-to-refresh, serta dukungan dark mode & light mode.
- **Sidebar Navigation** — navigasi ke Data Logger, Statistics, Alerts, dan Settings.
- **Data Logger Management** — pencatatan log sensor, auto-sync ke Firebase Firestore, status sinkronisasi (Success/Pending/Error), pencarian & filter log.
- **Sensor Cards** — tampilan data per sensor dengan status (Good/Warning/Critical), timestamp, dan unit otomatis.
- **Sensor Charts** — visualisasi data sensor dalam bentuk line chart dan bar chart dengan multiple data series.
- **Peta Lokasi** — integrasi peta (Google Maps / Leaflet) untuk visualisasi lokasi gudang/sensor.
- **Backend Firebase** — REST API berbasis Node.js + Express + Firebase Admin SDK untuk menyimpan dan mengambil data sensor dari Firestore.

---

## 🛠️ Tech Stack

**Frontend (Mobile App)**
- [Expo](https://expo.dev) ~54
- React Native 0.81
- React 19 + TypeScript
- Expo Router (file-based routing)
- React Navigation (bottom tabs)
- React Native Chart Kit + React Native SVG
- React Native Maps & React Leaflet
- Axios (HTTP client)

**Backend**
- Node.js + Express
- Firebase Admin SDK
- Firestore (database)

---

## 📁 Struktur Proyek

```
ayambakarmakjahat/
├── app/                  # Routing & screens (Expo Router)
│   └── (tabs)/
│       ├── index.tsx     # Halaman utama - Dashboard
│       ├── explore.tsx   # Data Logger
│       └── _layout.tsx   # Tab navigation
├── components/
│   ├── dashboard.tsx     # Dashboard utama
│   ├── sidebar.tsx       # Navigasi sidebar
│   ├── data-logger.tsx   # Manajemen data logger
│   ├── sensor-card.tsx   # Kartu sensor individual
│   ├── sensor-chart.tsx  # Komponen grafik
│   └── ui/               # Komponen UI pendukung
├── services/
│   ├── firebase.ts       # Konfigurasi Firebase
│   └── api.ts            # Service API ke backend
├── constants/             # Konstanta (tema, warna, dll)
├── hooks/                 # Custom React hooks
├── scripts/                # Script utilitas (reset project, dll)
├── assets/images/          # Aset gambar
├── FIREBASE_SETUP.md       # Panduan setup backend Firebase
├── DASHBOARD_GUIDE.md      # Dokumentasi lengkap dashboard
└── package.json
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 14+
- npm atau yarn
- Akun Firebase dengan project aktif (untuk backend)
- Expo Go (opsional, untuk testing cepat di HP)

### 1. Clone repository

```bash
git clone https://github.com/FARRAZ707/ayambakarmakjahat.git
cd ayambakarmakjahat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment

Buat file `.env.local` (lihat contoh di `.env.local.example`):

```env
# Backend API
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Firebase (untuk future use dengan SDK Web)
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Google Maps API key untuk peta gudang
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Jalankan aplikasi

```bash
npx expo start
```

Pilih platform yang diinginkan dari output terminal:
- Android emulator / device
- iOS simulator
- Expo Go
- Web browser

### 5. Setup backend (opsional, untuk integrasi penuh)

Backend Node.js + Firebase terpisah dari project Expo ini. Panduan lengkap setup backend (Firebase Admin SDK, Firestore, endpoint API) ada di [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md).

---

## 📖 Dokumentasi Tambahan

- [`DASHBOARD_GUIDE.md`](./DASHBOARD_GUIDE.md) — dokumentasi lengkap fitur dashboard, komponen, kustomisasi, dan troubleshooting.
- [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) — panduan setup backend Node.js + Firebase Firestore.

---

## 📚 Referensi

- [Dokumentasi Expo](https://docs.expo.dev/)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)

---

## 📝 Lisensi

Proyek ini dibuat untuk keperluan akademik (Tugas Besar Mata Kuliah Mobile Computing) dan tidak dimaksudkan untuk penggunaan komersial.
