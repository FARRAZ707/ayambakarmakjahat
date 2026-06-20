/**
 * Firebase Configuration
 *
 * This file provides utilities and configuration examples for integrating with Firebase Firestore.
 * For production use, store sensitive credentials in environment variables, not in code.
 */

// Example Firebase Realtime Database URL for reference
// Replace these with your actual Firebase credentials
//update API KEY
export const FIREBASE_CONFIG = {
  // Your Firebase configuration object from Firebase Console
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

/**
 * Node.js Admin SDK Configuration Example
 *
 * For your backend (Node.js with Admin SDK):
 *
 * 1. Install Firebase Admin SDK:
 *    npm install firebase-admin
 *
 * 2. Download service account key from Firebase Console:
 *    - Go to Project Settings > Service Accounts
 *    - Click "Generate New Private Key"
 *    - Save as `serviceAccountKey.json`
 *
 * 3. Initialize in your Node.js backend:
 *
 *    const admin = require('firebase-admin');
 *    const serviceAccount = require('./serviceAccountKey.json');
 *
 *    admin.initializeApp({
 *      credential: admin.credential.cert(serviceAccount),
 *      projectId: 'your-project-id'
 *    });
 *
 *    const db = admin.firestore();
 *
 * 4. Example: Save sensor data to Firestore
 *
 *    async function saveSensorData(sensorName, value, unit, timestamp) {
 *      try {
 *        const docRef = await db.collection('sensor_logs').add({
 *          sensorName: sensorName,
 *          value: value,
 *          unit: unit,
 *          timestamp: admin.firestore.Timestamp.fromDate(new Date(timestamp)),
 *          createdAt: admin.firestore.FieldValue.serverTimestamp()
 *        });
 *        console.log('Document written with ID: ', docRef.id);
 *        return true;
 *      } catch (error) {
 *        console.error('Error adding document: ', error);
 *        return false;
 *      }
 *    }
 *
 * 5. Example: Retrieve sensor data from Firestore
 *
 *    async function getSensorLogs(sensorName, limit = 100) {
 *      try {
 *        const snapshot = await db
 *          .collection('sensor_logs')
 *          .where('sensorName', '==', sensorName)
 *          .orderBy('timestamp', 'desc')
 *          .limit(limit)
 *          .get();
 *
 *        return snapshot.docs.map(doc => ({
 *          id: doc.id,
 *          ...doc.data()
 *        }));
 *      } catch (error) {
 *        console.error('Error getting documents: ', error);
 *        return [];
 *      }
 *    }
 */

// Interface for sensor data structure in Firestore
export interface SensorDataRecord {
  id?: string;
  sensorName: string;
  value: number;
  unit: string;
  timestamp: string;
  status: "success" | "error" | "pending";
  createdAt?: any;
  updatedAt?: any;
}

// Interface for Firestore operations
export interface FirestoreOptions {
  collection?: string;
  documentId?: string;
  query?: any;
}

/**
 * Placeholder for Firestore operations
 * These will be implemented in your backend service
 */
export const firestoreOperations = {
  /**
   * Save sensor data to Firestore
   * Should be called from your Node.js backend
   */
  saveSensorData: async (data: SensorDataRecord): Promise<boolean> => {
    try {
      // This would be implemented in your Node.js backend
      console.log("Sensor data to save:", data);
      return true;
    } catch (error) {
      console.error("Error saving sensor data:", error);
      return false;
    }
  },

  /**
   * Get sensor logs from Firestore
   * Should be called from your Node.js backend
   */
  getSensorLogs: async (
    sensorName: string,
    limit: number = 100,
  ): Promise<SensorDataRecord[]> => {
    try {
      // This would be implemented in your Node.js backend
      console.log(`Fetching ${limit} logs for sensor: ${sensorName}`);
      return [];
    } catch (error) {
      console.error("Error fetching sensor logs:", error);
      return [];
    }
  },

  /**
   * Delete old sensor data from Firestore
   * Should be called from your Node.js backend for cleanup
   */
  deleteOldLogs: async (
    sensorName: string,
    daysOld: number = 30,
  ): Promise<number> => {
    try {
      // This would be implemented in your Node.js backend
      console.log(
        `Deleting logs older than ${daysOld} days for sensor: ${sensorName}`,
      );
      return 0;
    } catch (error) {
      console.error("Error deleting old logs:", error);
      return 0;
    }
  },
};

/**
 * Setup Instructions:
 *
 * 1. Create a .env.local file in your project root:
 *    EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
 *    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
 *    EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
 *    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
 *    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
 *    EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
 *    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
 *
 * 2. Create a Node.js backend service with the Admin SDK to handle:
 *    - Receiving sensor data from MQTT/IoT devices
 *    - Saving to Firestore
 *    - Providing API endpoints for the React Native app
 *
 * 3. Example Express backend structure:
 *
 *    const express = require('express');
 *    const admin = require('firebase-admin');
 *    const app = express();
 *
 *    app.use(express.json());
 *
 *    // Save sensor data
 *    app.post('/api/sensor-data', async (req, res) => {
 *      const { sensorName, value, unit, timestamp } = req.body;
 *      const success = await saveSensorData(sensorName, value, unit, timestamp);
 *      res.json({ success });
 *    });
 *
 *    // Get sensor logs
 *    app.get('/api/sensor-logs/:sensorName', async (req, res) => {
 *      const { sensorName } = req.params;
 *      const logs = await getSensorLogs(sensorName);
 *      res.json(logs);
 *    });
 *
 *    app.listen(3000, () => console.log('Server running on port 3000'));
 */
