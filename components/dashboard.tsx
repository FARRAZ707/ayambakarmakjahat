import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SensorCard } from "./sensor-card";
import { SensorChart } from "./sensor-chart";
import { Sidebar } from "./sidebar";
import { WarehouseMap } from "./warehouse-map";

// Sample data structure for IoT sensors
interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: string;
  status: "good" | "warning" | "critical";
  lastUpdate: string;
  warehouseId: string;
}

interface Warehouse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  gas: number;
}

interface DashboardProps {
  onNavigateToLogger?: () => void;
  onNavigateToSettings?: () => void;
}

export function Dashboard({
  onNavigateToLogger,
  onNavigateToSettings,
}: DashboardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSensor, setActiveSensor] = useState<string | undefined>();
  const scrollViewRef = useRef<ScrollView>(null);

  const expoConstants = Constants as unknown as {
    expoConfig?: { extra?: { googleMapsApiKey?: string } };
    manifest?: { extra?: { googleMapsApiKey?: string } };
  };
  const googleApiKey =
    expoConstants.expoConfig?.extra?.googleMapsApiKey ||
    expoConstants.manifest?.extra?.googleMapsApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Warehouse data - 3 lokasi gudang
  const [warehouses] = useState<Warehouse[]>([
    {
      id: "WH1",
      name: "Gudang Utama",
      latitude: -6.2088,
      longitude: 106.8456,
      temperature: 27.5,
      gas: 42,
    },
    {
      id: "WH2",
      name: "Gudang Cabang",
      latitude: -6.1753,
      longitude: 106.8249,
      temperature: 26.8,
      gas: 38,
    },
    {
      id: "WH3",
      name: "Gudang Distribusi",
      latitude: -6.2315,
      longitude: 106.8762,
      temperature: 28.2,
      gas: 45,
    },
  ]);

  // Sample sensor data - 6 sensors (3 warehouses × 2 sensors: temperature & gas)
  const [sensorData] = useState<SensorData[]>([
    {
      id: "S1",
      name: "Suhu Gudang Utama",
      value: 27.5,
      unit: "°C",
      icon: "thermometer",
      status: "good",
      lastUpdate: "2 min ago",
      warehouseId: "WH1",
    },
    {
      id: "S2",
      name: "Gas Gudang Utama",
      value: 42,
      unit: "ppm",
      icon: "cloud",
      status: "good",
      lastUpdate: "2 min ago",
      warehouseId: "WH1",
    },
    {
      id: "S3",
      name: "Suhu Gudang Cabang",
      value: 26.8,
      unit: "°C",
      icon: "thermometer",
      status: "good",
      lastUpdate: "1 min ago",
      warehouseId: "WH2",
    },
    {
      id: "S4",
      name: "Gas Gudang Cabang",
      value: 38,
      unit: "ppm",
      icon: "cloud",
      status: "good",
      lastUpdate: "1 min ago",
      warehouseId: "WH2",
    },
    {
      id: "S5",
      name: "Suhu Gudang Distribusi",
      value: 28.2,
      unit: "°C",
      icon: "thermometer",
      status: "warning",
      lastUpdate: "3 min ago",
      warehouseId: "WH3",
    },
    {
      id: "S6",
      name: "Gas Gudang Distribusi",
      value: 45,
      unit: "ppm",
      icon: "cloud",
      status: "warning",
      lastUpdate: "3 min ago",
      warehouseId: "WH3",
    },
  ]);

  // Chart data sample - untuk 3 gudang
  const chartLabels = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

  // Temperature data untuk 3 gudang
  const warehouseTemperatureData = [
    [22, 23.5, 25, 26, 27, 27.5], // Gudang Utama
    [21.5, 23, 24.5, 25.5, 26.2, 26.8], // Gudang Cabang
    [23, 24.5, 26, 27, 27.8, 28.2], // Gudang Distribusi
  ];

  // Gas data untuk 3 gudang
  const warehouseGasData = [
    [35, 37, 39, 40, 41, 42], // Gudang Utama
    [32, 34, 35, 36, 37, 38], // Gudang Cabang
    [38, 40, 42, 43, 44, 45], // Gudang Distribusi
  ];

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "speedometer",
      onPress: () => {
        setActiveSensor("dashboard");
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        setSidebarOpen(false);
      },
    },
    {
      id: "map",
      label: "Peta Gudang",
      icon: "map",
      onPress: () => {
        setActiveSensor("map");
        scrollViewRef.current?.scrollTo({ y:0, animated: true });
        setSidebarOpen(false);
      },
    },
    {
      id: "sensors",
      label: "Sensor Status",
      icon: "pulse",
      onPress: () => {
        setActiveSensor("sensors");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 450, animated: true });
        }
        setSidebarOpen(false);
      },
    },
    {
      id: "trends",
      label: "Tren Suhu",
      icon: "trending-up",
      onPress: () => {
        setActiveSensor("trends");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 1430, animated: true });
        }
        setSidebarOpen(false);
      },
    },
    {
      id: "gas",
      label: "Gas Monitor",
      icon: "cloud",
      onPress: () => {
        setActiveSensor("gas");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 2460, animated: true });
        }
        setSidebarOpen(false);
      },
    },
    {
      id: "logout",
      label: "Keluar (Logout)",
      icon: "log-out", // Ikon pintu keluar bawaan Ionicons
      onPress: () => {
        // Memunculkan pop-up konfirmasi sebelum benar-benar keluar
        Alert.alert(
          "Konfirmasi Logout",
          "Apakah Anda yakin ingin keluar dari sistem Smart Storage?",
          [
            { 
              text: "Batal", 
              style: "cancel" 
            },
            {
              text: "Ya, Keluar",
              style: "destructive", // Memberikan warna merah pada tombol (di iOS)
              onPress: () => {
                // Menutup sidebar (jika ada state setSidebarOpen)
                // setSidebarOpen(false); 
                
                // Menghancurkan sesi dashboard dan kembali ke halaman Login (index.tsx)
                router.replace("/");
              },
            },
          ]
        );
      },
    },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate fetching data from Firebase
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5",
        },
      ]}
    >
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
        activeItem={activeSensor}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            borderBottomColor: isDark ? "#333333" : "#e0e0e0",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setSidebarOpen(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="menu"
            size={28}
            color={isDark ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              {
                color: isDark ? "#ffffff" : "#000000",
              },
            ]}
          >
            Smart Storage Dashboard
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {
                color: isDark ? "#999999" : "#666666",
              },
            ]}
          >
            Real-time Monitoring
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleRefresh}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="refresh"
            size={24}
            color={isDark ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
          />
        }
      >
        <View style={styles.content}>
          {/* Warehouse Map Section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
            >
              Lokasi Gudang
            </Text>
            <WarehouseMap warehouses={warehouses} googleApiKey={googleApiKey} />
          </View>

          {/* Status Cards */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
            >
              Sensor Status
            </Text>
            {sensorData.map((sensor) => (
              <SensorCard
                key={sensor.id}
                title={sensor.name}
                value={sensor.value}
                unit={sensor.unit}
                icon={sensor.icon as any}
                status={sensor.status}
                timestamp={sensor.lastUpdate}
              />
            ))}
          </View>

          {/* Charts Section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
            >
              Tren Suhu Gudang
            </Text>

            <SensorChart
              title="Gudang Utama"
              labels={chartLabels}
              datasets={[
                {
                  label: "Temperature",
                  data: warehouseTemperatureData[0],
                  color: "#ff6b6b",
                },
              ]}
              unit="°C"
              chartType="line"
            />

            <SensorChart
              title="Gudang Cabang"
              labels={chartLabels}
              datasets={[
                {
                  label: "Temperature",
                  data: warehouseTemperatureData[1],
                  color: "#4ecdc4",
                },
              ]}
              unit="°C"
              chartType="line"
            />

            <SensorChart
              title="Gudang Distribusi"
              labels={chartLabels}
              datasets={[
                {
                  label: "Temperature",
                  data: warehouseTemperatureData[2],
                  color: "#ffd93d",
                },
              ]}
              unit="°C"
              chartType="line"
            />
          </View>

          {/* Gas Charts Section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
            >
              Tren Gas Gudang
            </Text>

            <SensorChart
              title="Gas - Gudang Utama"
              labels={chartLabels}
              datasets={[
                {
                  label: "Gas",
                  data: warehouseGasData[0],
                  color: "#a78bfa",
                },
              ]}
              unit="ppm"
              chartType="line"
            />

            <SensorChart
              title="Gas - Gudang Cabang"
              labels={chartLabels}
              datasets={[
                {
                  label: "Gas",
                  data: warehouseGasData[1],
                  color: "#f87171",
                },
              ]}
              unit="ppm"
              chartType="line"
            />

            <SensorChart
              title="Gas - Gudang Distribusi"
              labels={chartLabels}
              datasets={[
                {
                  label: "Gas",
                  data: warehouseGasData[2],
                  color: "#60a5fa",
                },
              ]}
              unit="ppm"
              chartType="line"
            />
          </View>

          {/* Summary Statistics */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
            >
              Summary
            </Text>

            <View style={styles.statsGrid}>
              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDark ? "#222222" : "#f0f0f0",
                  },
                ]}
              >
                <Ionicons name="storefront" size={32} color="#9c27b0" />
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                >
                  3
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: isDark ? "#999999" : "#666666",
                    },
                  ]}
                >
                  Warehouses
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDark ? "#222222" : "#f0f0f0",
                  },
                ]}
              >
                <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                >
                  6
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: isDark ? "#999999" : "#666666",
                    },
                  ]}
                >
                  Active Sensors
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDark ? "#222222" : "#f0f0f0",
                  },
                ]}
              >
                <Ionicons name="warning" size={32} color="#ff9800" />
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                >
                  2
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: isDark ? "#999999" : "#666666",
                    },
                  ]}
                >
                  Warnings
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDark ? "#222222" : "#f0f0f0",
                  },
                ]}
              >
                <Ionicons name="cloud-upload" size={32} color="#2196f3" />
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                >
                  ✓
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    {
                      color: isDark ? "#999999" : "#666666",
                    },
                  ]}
                >
                  Cloud Sync
                </Text>
              </View>
            </View>
          </View>

          {/* Firebase Integration Info */}
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: isDark ? "#1a3a3a" : "#e3f2fd",
                borderColor: isDark ? "#2a5a5a" : "#90caf9",
              },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={isDark ? "#64b5f6" : "#1976d2"}
            />
            <View style={styles.infoContent}>
              <Text
                style={[
                  styles.infoTitle,
                  {
                    color: isDark ? "#64b5f6" : "#1976d2",
                  },
                ]}
              >
                Firebase Firestore Ready
              </Text>
              <Text
                style={[
                  styles.infoText,
                  {
                    color: isDark ? "#90caf9" : "#0d47a1",
                  },
                ]}
              >
                Connected to Cloud Database • Real-time Sync Active
              </Text>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
  },
  bottomPadding: {
    height: 20,
  },
});
