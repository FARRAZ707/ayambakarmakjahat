/**
 * API Service for IoT Dashboard
 *
 * This service handles all API calls to your Node.js backend
 * which manages the Firebase Firestore integration.
 */

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface SensorDataPayload {
  sensorName: string;
  value: number;
  unit: string;
  timestamp: string;
  status?: "success" | "error" | "pending";
}

/**
 * API Service for Sensor Data Management
 */
export const sensorApi = {
  /**
   * Save sensor data to Firestore via backend
   */
  saveSensorData: async (
    data: SensorDataPayload,
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error saving sensor data:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get sensor logs from Firestore via backend
   */
  getSensorLogs: async (
    sensorName: string,
    limit: number = 100,
  ): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sensor-logs/${sensorName}?limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching sensor logs:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
      };
    }
  },

  /**
   * Get all sensor data summary
   */
  getSensorSummary: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensor-summary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching sensor summary:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Sync pending logs to Firebase
   */
  syncPendingLogs: async (): Promise<ApiResponse<{ synced: number }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sync-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error syncing logs:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Delete old sensor data
   */
  deleteOldLogs: async (
    daysOld: number = 30,
  ): Promise<ApiResponse<{ deleted: number }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-old-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ daysOld }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting old logs:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};

/**
 * Example: How to use this service in your component
 *
 * import { sensorApi } from '@/services/api';
 *
 * // Save sensor data
 * const result = await sensorApi.saveSensorData({
 *   sensorName: 'Temperature',
 *   value: 27.5,
 *   unit: '°C',
 *   timestamp: new Date().toISOString(),
 * });
 *
 * if (result.success) {
 *   console.log('Data saved successfully');
 * } else {
 *   console.error('Failed to save data:', result.error);
 * }
 *
 * // Get sensor logs
 * const logsResult = await sensorApi.getSensorLogs('Temperature', 50);
 * if (logsResult.success && logsResult.data) {
 *   console.log('Temperature logs:', logsResult.data);
 * }
 */
