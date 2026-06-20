# IoT Dashboard - Firebase Backend Setup Guide

Panduan lengkap untuk mengatur backend Node.js dengan Firebase Admin SDK dan Firestore.

## 📋 Prerequisites

- Node.js 14+ terinstall
- Akun Firebase dengan project aktif
- npm atau yarn

## 🚀 Setup Backend Server

### 1. Inisialisasi Project Node.js

```bash
mkdir iot-dashboard-backend
cd iot-dashboard-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express firebase-admin cors dotenv
npm install --save-dev nodemon
```

### 3. Struktur Folder Backend

```
iot-dashboard-backend/
├── src/
│   ├── index.js          # Entry point
│   ├── config.js         # Firebase config
│   ├── routes/
│   │   ├── sensors.js    # Sensor endpoints
│   │   └── logs.js       # Logging endpoints
│   └── controllers/
│       └── sensorController.js
├── serviceAccountKey.json # Firebase service account (jangan commit!)
├── .env                  # Environment variables
├── .gitignore
└── package.json
```

### 4. Firebase Service Account Setup

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih Project Anda
3. Go to **Project Settings** (⚙️) → **Service Accounts**
4. Klik "Generate New Private Key"
5. Save file sebagai `serviceAccountKey.json` di folder backend
6. Tambahkan ke `.gitignore`:
   ```
   serviceAccountKey.json
   .env
   node_modules/
   ```

### 5. Buat File `.env`

```env
PORT=3000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

### 6. File `src/config.js`

```javascript
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
```

### 7. File `src/index.js`

```javascript
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { db } = require("./config");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/sensor-data", async (req, res) => {
  try {
    const { sensorName, value, unit, timestamp, status } = req.body;

    if (!sensorName || value === undefined || !unit) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: sensorName, value, unit",
      });
    }

    const docRef = await db.collection("sensor_logs").add({
      sensorName,
      value: parseFloat(value),
      unit,
      timestamp: admin.firestore.Timestamp.fromDate(new Date(timestamp)),
      status: status || "success",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      data: { id: docRef.id },
    });
  } catch (error) {
    console.error("Error saving sensor data:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get sensor logs
app.get("/api/sensor-logs/:sensorName", async (req, res) => {
  try {
    const { sensorName } = req.params;
    const { limit = 100 } = req.query;

    const snapshot = await db
      .collection("sensor_logs")
      .where("sensorName", "==", sensorName)
      .orderBy("timestamp", "desc")
      .limit(parseInt(limit))
      .get();

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate().toISOString(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
    }));

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching sensor logs:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      data: [],
    });
  }
});

// Get all sensors summary
app.get("/api/sensor-summary", async (req, res) => {
  try {
    const snapshot = await db.collection("sensor_logs").get();

    const summary = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!summary[data.sensorName]) {
        summary[data.sensorName] = {
          name: data.sensorName,
          latestValue: data.value,
          unit: data.unit,
          status: data.status,
          timestamp: data.timestamp?.toDate().toISOString(),
        };
      }
    });

    res.json({
      success: true,
      data: Object.values(summary),
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Sync pending logs
app.post("/api/sync-logs", async (req, res) => {
  try {
    const snapshot = await db
      .collection("sensor_logs")
      .where("status", "==", "pending")
      .get();

    let synced = 0;
    const batch = db.batch();

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { status: "success" });
      synced++;
    });

    await batch.commit();

    res.json({
      success: true,
      data: { synced },
    });
  } catch (error) {
    console.error("Error syncing logs:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete old logs
app.post("/api/delete-old-logs", async (req, res) => {
  try {
    const { daysOld = 30 } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const snapshot = await db
      .collection("sensor_logs")
      .where("createdAt", "<", admin.firestore.Timestamp.fromDate(cutoffDate))
      .get();

    let deleted = 0;
    const batch = db.batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
      deleted++;
    });

    await batch.commit();

    res.json({
      success: true,
      data: { deleted },
    });
  } catch (error) {
    console.error("Error deleting old logs:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IoT Dashboard Backend running on port ${PORT}`);
});
```

### 8. Update `package.json` scripts

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### 9. Jalankan Backend Server

```bash
# Development
npm run dev

# Production
npm start
```

## 🔗 Integrasi dengan React Native App

### 1. Update `.env.local` di Project Expo

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
# atau untuk production:
# EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### 2. Gunakan API Service di Component

```typescript
import { sensorApi } from "@/services/api";

// Contoh dalam Dashboard component
const handleSaveData = async () => {
  const result = await sensorApi.saveSensorData({
    sensorName: "Temperature",
    value: 27.5,
    unit: "°C",
    timestamp: new Date().toISOString(),
  });

  if (result.success) {
    console.log("Data saved to Firestore!");
  }
};
```

## 📊 Firestore Collection Structure

```
sensor_logs/
├── document_id_1
│   ├── sensorName: "Temperature"
│   ├── value: 27.5
│   ├── unit: "°C"
│   ├── timestamp: Timestamp
│   ├── status: "success"
│   └── createdAt: Timestamp
│
├── document_id_2
│   ├── sensorName: "Humidity"
│   ├── value: 65
│   ├── unit: "%"
│   ├── timestamp: Timestamp
│   ├── status: "success"
│   └── createdAt: Timestamp
```

## 🔐 Firestore Security Rules

Edit di Firebase Console → Firestore → Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write untuk development
    // JANGAN gunakan di production!
    match /sensor_logs/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🐛 Troubleshooting

### Error: "ENOENT: no such file or directory, open 'serviceAccountKey.json'"

- Pastikan file `serviceAccountKey.json` ada di folder backend
- Jangan commit file ini ke Git!

### Error: "Cannot find module 'firebase-admin'"

```bash
npm install firebase-admin --save
```

### Error: "CORS error"

Pastikan `cors` sudah di-install dan digunakan:

```bash
npm install cors
```

## 🎯 Fitur Lanjutan

### Real-time Updates dengan Firestore Listeners

```javascript
db.collection("sensor_logs")
  .where("sensorName", "==", "Temperature")
  .onSnapshot((snapshot) => {
    snapshot.forEach((doc) => {
      console.log("Real-time update:", doc.data());
    });
  });
```

### Batch Operations

```javascript
const batch = db.batch();

docs.forEach((doc) => {
  batch.update(doc.ref, { status: "synced" });
});

await batch.commit();
```

## 📚 Referensi

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/database/admin/start)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Express.js Guide](https://expressjs.com/)

---

**Next Steps:**

1. Setup backend server sesuai guide di atas
2. Deploy ke cloud (Firebase Functions, Vercel, Railway, dll)
3. Update `EXPO_PUBLIC_API_URL` dengan URL production
4. Test koneksi antara app dan backend
