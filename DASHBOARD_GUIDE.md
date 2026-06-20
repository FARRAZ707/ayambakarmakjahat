# 📊 IoT Dashboard - Dokumentasi Lengkap

Dashboard IoT yang lengkap dengan grafik sensor, data logger, dan integrasi Firebase Firestore menggunakan Node.js Admin SDK.

## 🎯 Fitur Utama

### 1. **Dashboard Interaktif** (`components/dashboard.tsx`)

- 📊 Kartu sensor real-time dengan status indikator
- 📈 Grafik trend data sensor (garis dan bar)
- 📈 Statistik ringkasan sistem
- 🔄 Pull-to-refresh untuk update manual
- 🌙 Support dark mode dan light mode
- 📱 Responsive design untuk semua ukuran layar

### 2. **Sidebar Navigation** (`components/sidebar.tsx`)

- 🗂️ Menu navigasi untuk berbagai fitur
- ⚡ Data Logger - Kelola log sensor
- 📊 Statistics - Lihat statistik lengkap
- 🚨 Alerts - Pantau alert dan warning
- ⚙️ Settings - Konfigurasi sistem
- 🎨 Dark/Light mode support

### 3. **Data Logger Management** (`components/data-logger.tsx`)

- 💾 Tampilan semua log sensor
- ⚙️ Pengaturan logging otomatis
- ☁️ Auto-sync ke Firebase Firestore
- 🔔 Status syncing (Success/Pending/Error)
- 📊 Statistik sync status
- 🔍 Search dan filter logs
- 🛠️ Manajemen interval sync

### 4. **Sensor Cards** (`components/sensor-card.tsx`)

- 🎨 Card design yang modern dan clean
- 🟢 Status indicator (Good/Warning/Critical)
- ⏰ Timestamp setiap reading
- 📏 Unit display otomatis
- 🎯 Custom icon untuk tiap sensor

### 5. **Sensor Charts** (`components/sensor-chart.tsx`)

- 📈 Line chart dan bar chart
- 🎨 Warna custom untuk tiap dataset
- 📊 Multiple data series support
- 🎯 Smooth bezier curves
- 📱 Responsive width

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install react-native-chart-kit react-native-svg
```

### 2. Gunakan Dashboard di App Anda

```tsx
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <Dashboard
      onNavigateToLogger={() => {
        /* ... */
      }}
      onNavigateToSettings={() => {
        /* ... */
      }}
    />
  );
}
```

### 3. Integrasi dengan API Backend

Hubungkan dashboard ke backend Node.js dengan Firebase:

```tsx
import { sensorApi } from "@/services/api";

// Simpan data sensor
const result = await sensorApi.saveSensorData({
  sensorName: "Temperature",
  value: 27.5,
  unit: "°C",
  timestamp: new Date().toISOString(),
});

// Ambil log sensor
const logs = await sensorApi.getSensorLogs("Temperature", 50);
```

## 📁 Struktur File

```
components/
├── dashboard.tsx          # Main dashboard dengan sidebar
├── sidebar.tsx            # Navigation sidebar
├── data-logger.tsx        # Data logger management
├── sensor-card.tsx        # Individual sensor card
├── sensor-chart.tsx       # Chart component
└── ui/
    ├── collapsible.tsx
    ├── icon-symbol.tsx
    └── icon-symbol.ios.tsx

services/
├── firebase.ts            # Firebase config & docs
├── api.ts                 # API service untuk backend
└── ...

app/
└── (tabs)/
    ├── index.tsx          # Home - Dashboard
    ├── explore.tsx        # Data Logger
    └── _layout.tsx        # Tab navigation
```

## 🔧 Konfigurasi

### Environment Variables (.env.local)

```env
# Backend API
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Firebase (untuk future use dengan SDK Web)
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 🎨 Customization

### Mengubah Warna Tema

Edit `constants/theme.ts`:

```tsx
export const Colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: "#your-color", // Ubah warna utama
    // ...
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: "#your-color",
    // ...
  },
};
```

### Menambah Sensor Baru

Di `components/dashboard.tsx`:

```tsx
const [sensorData] = useState<SensorData[]>([
  // ... existing sensors
  {
    id: "5",
    name: "Pressure", // Nama sensor
    value: 1013, // Nilai
    unit: "hPa", // Unit
    icon: "barometer", // Icon Ionicons
    status: "good", // Status
    lastUpdate: "1 min ago",
  },
]);
```

### Custom Chart Colors

```tsx
<SensorChart
  title="Custom Chart"
  labels={["12:00", "13:00", "14:00"]}
  datasets={[
    {
      label: "Data",
      data: [20, 25, 30],
      color: () => "#ff6b6b", // Custom color
    },
  ]}
  unit="°C"
/>
```

## 🔐 Firebase Firestore Setup

### Document Structure

```firestore
collections/
└── sensor_logs
    ├── timestamp: Timestamp
    ├── sensorName: String
    ├── value: Number
    ├── unit: String
    ├── status: String (success|pending|error)
    └── createdAt: Timestamp
```

### Node.js Admin SDK Example

```javascript
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "your-project-id",
});

const db = admin.firestore();

// Save sensor data
async function saveSensorData(sensorName, value, unit, timestamp) {
  await db.collection("sensor_logs").add({
    sensorName,
    value: parseFloat(value),
    unit,
    timestamp: admin.firestore.Timestamp.fromDate(new Date(timestamp)),
    status: "success",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
```

Lihat [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) untuk setup lengkap.

## 📱 Responsive Design

Dashboard sudah responsive untuk:

- 📱 Mobile (< 480px)
- 📱 Tablet (480px - 768px)
- 🖥️ Desktop (> 768px)

## 🌙 Dark Mode Support

Semua komponen sudah support dark mode otomatis menggunakan `useColorScheme()` hook.

## ⚡ Performance Tips

1. **Optimize Charts**: Limit data points untuk performa lebih baik
2. **Memoization**: Gunakan `useMemo` untuk data processing yang heavy
3. **Lazy Loading**: Load sensor data only when needed
4. **Batch Updates**: Update multiple sensors sekaligus

Contoh optimasi:

```tsx
import { useMemo } from "react";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);

  const processedData = useMemo(() => {
    return sensorData.map((d) => ({
      ...d,
      displayValue: d.value.toFixed(2),
    }));
  }, [sensorData]);

  return <SensorCard {...processedData[0]} />;
};
```

## 🧪 Testing

### Test Components Locally

```tsx
import { Dashboard } from '@/components/dashboard';

// Test di Expo
npx expo start

# Choose platform:
# a - Android
# i - iOS
# w - Web
```

### Mock Data Testing

```tsx
const mockSensorData = [
  {
    id: "1",
    name: "Temperature",
    value: 25 + Math.random() * 5,
    unit: "°C",
    // ...
  },
];

// Use untuk testing UI
```

## 📚 API Reference

### Dashboard Props

```tsx
interface DashboardProps {
  onNavigateToLogger?: () => void;
  onNavigateToSettings?: () => void;
}
```

### SensorCard Props

```tsx
interface SensorCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  status?: "good" | "warning" | "critical";
  timestamp?: string;
}
```

### SensorChart Props

```tsx
interface ChartProps {
  title: string;
  chartType?: "line" | "bar";
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    strokeWidth?: number;
  }[];
  unit?: string;
}
```

## 🐛 Troubleshooting

### Chart tidak muncul

- Pastikan data tidak kosong
- Check console untuk error message
- Verifikasi import react-native-chart-kit

### API request gagal

- Check EXPO_PUBLIC_API_URL di .env.local
- Pastikan backend server running
- Check CORS settings di backend

### Dark mode tidak bekerja

- Clear cache: `npm run reset-project`
- Restart dev server
- Check device color scheme setting

## 🚀 Deployment

### Build untuk Production

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios

# Web
npm run build
```

## 📖 Dokumentasi Lengkap

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Charts](https://github.com/indiespirit/react-native-chart-kit)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)

## 📞 Support

Untuk pertanyaan atau issue, silakan:

1. Check dokumentasi di file ini
2. Lihat FIREBASE_SETUP.md untuk backend setup
3. Check console logs untuk error messages

---

**Version**: 1.0.0  
**Last Updated**: 2024-06-20  
**Status**: Production Ready ✅
