import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SensorCard } from "./sensor-card";
import { SensorChart } from "./sensor-chart";
import { Sidebar } from "./sidebar";

// Sample data structure for IoT sensors
interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: string;
  status: "good" | "warning" | "critical";
  lastUpdate: string;
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

  // Sample sensor data
  const [sensorData] = useState<SensorData[]>([
    {
      id: "1",
      name: "Temperature",
      value: 27.5,
      unit: "°C",
      icon: "thermometer",
      status: "good",
      lastUpdate: "2 min ago",
    },
    {
      id: "2",
      name: "Humidity",
      value: 65,
      unit: "%",
      icon: "water",
      status: "good",
      lastUpdate: "2 min ago",
    },
    {
      id: "3",
      name: "Air Quality",
      value: 42,
      unit: "AQI",
      icon: "cloud",
      status: "good",
      lastUpdate: "1 min ago",
    },
    {
      id: "4",
      name: "Light Intensity",
      value: 850,
      unit: "lux",
      icon: "sunny",
      status: "warning",
      lastUpdate: "3 min ago",
    },
  ]);

  // Chart data sample
  const chartLabels = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  const temperatureData = [22, 23.5, 25, 26, 27, 27.5];
  const humidityData = [55, 58, 62, 65, 65, 65];

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "speedometer",
      onPress: () => {
        setActiveSensor("dashboard");
      },
    },
    {
      id: "data-logger",
      label: "Data Logger",
      icon: "document-text",
      onPress: () => {
        setActiveSensor("data-logger");
        onNavigateToLogger?.();
      },
    },
    {
      id: "statistics",
      label: "Statistics",
      icon: "bar-chart",
      onPress: () => {
        setActiveSensor("statistics");
      },
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: "alert-circle",
      onPress: () => {
        setActiveSensor("alerts");
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      onPress: () => {
        setActiveSensor("settings");
        onNavigateToSettings?.();
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
            IoT Dashboard
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
              Trends
            </Text>

            <SensorChart
              title="Temperature Trend"
              labels={chartLabels}
              datasets={[
                {
                  label: "Temperature",
                  data: temperatureData,
                  color: () => "#ff6b6b",
                },
              ]}
              unit="°C"
              chartType="line"
            />

            <SensorChart
              title="Humidity Levels"
              labels={chartLabels}
              datasets={[
                {
                  label: "Humidity",
                  data: humidityData,
                  color: () => "#4ecdc4",
                },
              ]}
              unit="%"
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
                <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
                <Text
                  style={[
                    styles.statValue,
                    {
                      color: isDark ? "#ffffff" : "#000000",
                    },
                  ]}
                >
                  4
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
                  1
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
    paddingVertical: 12,
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
