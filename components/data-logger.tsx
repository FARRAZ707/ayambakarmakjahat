import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface LogEntry {
  id: string;
  warehouseName: string;
  sensorType: "temperature" | "gas";
  sensorName: string;
  value: number;
  unit: string;
  timestamp: string;
  status: "success" | "error" | "pending" | "critical";
  warehouseIcon?: string;
}

interface DataLoggerProps {
  onBackPress?: () => void;
}

export function DataLogger({ onBackPress }: DataLoggerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];

  const [autoSync, setAutoSync] = useState(true);
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState("30");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample log data - 6 sensors dari 3 gudang
  const [logEntries, setLogEntries] = useState<LogEntry[]>([
    {
      id: "1",
      warehouseName: "Gudang Utama",
      sensorType: "temperature",
      sensorName: "Suhu Gudang Utama",
      value: 27.5,
      unit: "°C",
      timestamp: "2024-06-21 14:45:00",
      status: "success",
      warehouseIcon: "thermometer",
    },
    {
      id: "2",
      warehouseName: "Gudang Utama",
      sensorType: "gas",
      sensorName: "Gas Gudang Utama",
      value: 42,
      unit: "ppm",
      timestamp: "2024-06-21 14:44:58",
      status: "success",
      warehouseIcon: "cloud",
    },
    {
      id: "3",
      warehouseName: "Gudang Cabang",
      sensorType: "temperature",
      sensorName: "Suhu Gudang Cabang",
      value: 26.8,
      unit: "°C",
      timestamp: "2024-06-21 14:44:55",
      status: "success",
      warehouseIcon: "thermometer",
    },
    {
      id: "4",
      warehouseName: "Gudang Cabang",
      sensorType: "gas",
      sensorName: "Gas Gudang Cabang",
      value: 38,
      unit: "ppm",
      timestamp: "2024-06-21 14:44:52",
      status: "success",
      warehouseIcon: "cloud",
    },
    {
      id: "5",
      warehouseName: "Gudang Distribusi",
      sensorType: "temperature",
      sensorName: "Suhu Gudang Distribusi",
      value: 28.2,
      unit: "°C",
      timestamp: "2024-06-21 14:44:30",
      status: "pending",
      warehouseIcon: "thermometer",
    },
    {
      id: "6",
      warehouseName: "Gudang Distribusi",
      sensorType: "gas",
      sensorName: "Gas Gudang Distribusi",
      value: 45,
      unit: "ppm",
      timestamp: "2024-06-21 14:44:28",
      status: "pending",
      warehouseIcon: "cloud",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#4caf50";
      case "error":
        return "#f44336";
      case "pending":
        return "#ff9800";
      case "critical":
        return "#d32f2f";
      default:
        return "#999999";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "pending":
        return "time";
      case "critical":
        return "warning";
      default:
        return "help-circle";
    }
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => (
    <View
      style={[
        styles.logItem,
        {
          backgroundColor: isDark ? "#222222" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e0e0e0",
        },
      ]}
    >
      <View style={styles.logStatusIndicator}>
        <Ionicons
          name={getStatusIcon(item.status) as any}
          size={20}
          color={getStatusColor(item.status)}
        />
      </View>
      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <View style={styles.logTitleSection}>
            <Ionicons
              name={(item.warehouseIcon as any) || "business"}
              size={16}
              color={colors.tint}
              style={styles.warehouseIcon}
            />
            <View>
              <Text
                style={[
                  styles.warehouseName,
                  {
                    color: isDark ? "#999999" : "#666666",
                  },
                ]}
              >
                {item.warehouseName}
              </Text>
              <Text
                style={[
                  styles.sensorName,
                  {
                    color: isDark ? "#e0e0e0" : "#333333",
                  },
                ]}
              >
                {item.sensorName}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.logDetails}>
          <Text
            style={[
              styles.logValue,
              {
                color: colors.tint,
                fontWeight: "600",
              },
            ]}
          >
            {item.value} {item.unit}
          </Text>
          <Text
            style={[
              styles.logTimestamp,
              {
                color: isDark ? "#666666" : "#999999",
              },
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    </View>
  );

// --- TAMBAHKAN FUNGSI INI SEBELUM return (...) ---
  const handleMenuOptions = () => {
    Alert.alert(
      "Opsi Data Logger",
      "Pilih tindakan pengujian sistem:",
      [
        {
          text: "➕ Simulasikan Data Baru",
          onPress: () => {
            // 1. Dapatkan nilai suhu acak antara 25.0 sampai 35.0 °C
            const randomValue = parseFloat((Math.random() * (35 - 25) + 25).toFixed(1));
            
            // 2. LOGIKA EWS: Tentukan batas aman (misal suhu maksimal 30.0 °C)
            const thresholdSuhu = 30.0;
            const isCritical = randomValue > thresholdSuhu;

            // 3. Buat data log baru dengan status dinamis
            const newLog: LogEntry = {
              id: Date.now().toString(),
              warehouseName: "Gudang Utama",
              sensorType: "temperature",
              sensorName: "Suhu Gudang Utama",
              value: randomValue,
              unit: "°C",
              timestamp: new Date().toLocaleString('sv-SE').replace('T', ' '),
              // Jika melebihi batas, status otomatis menjadi 'critical' (warna merah)
              status: isCritical ? "critical" : "success", 
              warehouseIcon: "thermometer",
            };

            // 4. Masukkan ke dalam daftar layar
            setLogEntries([newLog, ...logEntries]);

            // 5. PEMICU NOTIFIKASI PERINGATAN DINI
            if (isCritical) {
              // Diberi jeda 500ms agar data log memunculkan warna merah dulu di layar, baru notifikasi muncul
              setTimeout(() => {
                Alert.alert(
                  "⚠️ PERINGATAN DINI (EWS)",
                  `Sistem mendeteksi parameter lingkungan di luar batas aman!\n\n` +
                  `• Lokasi: Gudang Utama\n` +
                  `• Parameter: Pembacaan Suhu\n` +
                  `• Nilai: ${randomValue} °C (Batas aman: ${thresholdSuhu} °C)\n` +
                  `• Status: CRITICAL`,
                  [{ text: "Respons Bahaya", style: "destructive" }]
                );
              }, 500);
            }
          },
        },
        {
          text: "🗑️ Bersihkan Semua Log",
          onPress: () => {
            setLogEntries([]);
          },
          style: "destructive",
        },
        {
          text: "Batal",
          style: "cancel",
        },
      ]
    );
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
        <View style={styles.headerTopRow}>
          <View style={styles.headerTitleContainer}>
            {/* Tombol Back yang seragam */}
            <TouchableOpacity 
              onPress={() => router.navigate('/')} 
              style={{ paddingRight: 12, paddingVertical: 4 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={isDark ? "#ffffff" : "#000000"}
              />
            </TouchableOpacity>
            
            {/* Ikon dan Judul */}
            <Ionicons name="document-text" size={24} color={isDark ? "#ffffff" : "#000000"} />
            <Text
              style={[
                styles.headerTitle,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
            >
              Data Logger Gudang
            </Text>
          </View>

          {/* Tombol Opsi Tambahan (Titik 3) */}
          <TouchableOpacity onPress={handleMenuOptions}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={isDark ? "#ffffff" : "#000000"}
            />
          </TouchableOpacity>
        </View>

        {/* Subtitle baru */}
        <Text style={[styles.headerSubtitle, { color: isDark ? "#999999" : "#666666", marginLeft: 44 }]}>
          Riwayat Sensor & Sinkronisasi Cloud
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Settings Section */}
          <View
            style={[
              styles.section,
              {
                backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                borderColor: isDark ? "#333333" : "#e0e0e0",
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
            >
              ⚙️ Pengaturan Logging
            </Text>

            {/* Logging Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="radio-button-on"
                  size={20}
                  color={colors.tint}
                  style={styles.settingIcon}
                />
                <View>
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: isDark ? "#e0e0e0" : "#333333",
                      },
                    ]}
                  >
                    Logging Data Sensor
                  </Text>
                  <Text
                    style={[
                      styles.settingDesc,
                      {
                        color: isDark ? "#999999" : "#666666",
                      },
                    ]}
                  >
                    Catat semua pembacaan sensor gudang
                  </Text>
                </View>
              </View>
              <Switch
                value={loggingEnabled}
                onValueChange={setLoggingEnabled}
                trackColor={{ false: "#ccc", true: colors.tint }}
              />
            </View>

            {/* Auto Sync Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="cloud-upload"
                  size={20}
                  color={colors.tint}
                  style={styles.settingIcon}
                />
                <View>
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: isDark ? "#e0e0e0" : "#333333",
                      },
                    ]}
                  >
                    Sinkronisasi Otomatis
                  </Text>
                  <Text
                    style={[
                      styles.settingDesc,
                      {
                        color: isDark ? "#999999" : "#666666",
                      },
                    ]}
                  >
                    Sinkron data ke Firebase Firestore
                  </Text>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: "#ccc", true: colors.tint }}
              />
            </View>

            {/* Sync Interval */}
            {autoSync && (
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="timer"
                    size={20}
                    color={colors.tint}
                    style={styles.settingIcon}
                  />
                  <Text
                    style={[
                      styles.settingLabel,
                      {
                        color: isDark ? "#e0e0e0" : "#333333",
                      },
                    ]}
                  >
                    Interval Sinkronisasi (detik)
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.intervalInput,
                    {
                      backgroundColor: isDark ? "#2a2a2a" : "#f0f0f0",
                      color: isDark ? "#ffffff" : "#000000",
                      borderColor: isDark ? "#444444" : "#d0d0d0",
                    },
                  ]}
                  value={syncInterval}
                  onChangeText={setSyncInterval}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor={isDark ? "#777777" : "#cccccc"}
                />
              </View>
            )}
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View
              style={[
                styles.statItem,
                {
                  backgroundColor: isDark ? "#1a2a3a" : "#e3f2fd",
                  borderColor: isDark ? "#2a4a6a" : "#90caf9",
                },
              ]}
            >
              <Ionicons name="document-text" size={32} color={colors.tint} />
              <Text
                style={[
                  styles.statCount,
                  {
                    color: isDark ? "#ffffff" : "#000000",
                  },
                ]}
              >
                {logEntries.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: isDark ? "#999999" : "#666666",
                  },
                ]}
              >
                Total Logs
              </Text>
            </View>

            <View
              style={[
                styles.statItem,
                {
                  backgroundColor: isDark ? "#1a3a1a" : "#f1f8e9",
                  borderColor: isDark ? "#2a6a2a" : "#c5e1a5",
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={32} color="#4caf50" />
              <Text
                style={[
                  styles.statCount,
                  {
                    color: isDark ? "#ffffff" : "#000000",
                  },
                ]}
              >
                {logEntries.filter((l) => l.status === "success").length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: isDark ? "#999999" : "#666666",
                  },
                ]}
              >
                Synced
              </Text>
            </View>

            <View
              style={[
                styles.statItem,
                {
                  backgroundColor: isDark ? "#3a1a1a" : "#ffe0b2",
                  borderColor: isDark ? "#6a2a2a" : "#ffb74d",
                },
              ]}
            >
              <Ionicons name="time" size={32} color="#ff9800" />
              <Text
                style={[
                  styles.statCount,
                  {
                    color: isDark ? "#ffffff" : "#000000",
                  },
                ]}
              >
                {logEntries.filter((l) => l.status === "pending").length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: isDark ? "#999999" : "#666666",
                  },
                ]}
              >
                Pending
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                borderColor: isDark ? "#333333" : "#e0e0e0",
              },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={isDark ? "#999999" : "#999999"}
            />
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: isDark ? "#ffffff" : "#000000",
                },
              ]}
              placeholder="Search logs..."
              placeholderTextColor={isDark ? "#666666" : "#cccccc"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Logs List */}
          <Text
            style={[
              styles.logsTitle,
              {
                color: isDark ? "#ffffff" : "#000000",
              },
            ]}
          >
            📋 Log Terbaru
          </Text>
          <FlatList
          data={logEntries.filter(
          (log) =>
            log.warehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.sensorName.toLowerCase().includes(searchQuery.toLowerCase())
          )}
            renderItem={renderLogItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.logsList}
          />

          {/* Firebase Info */}
          <View
            style={[
              styles.firebaseCard,
              {
                backgroundColor: isDark ? "#1a1a3a" : "#f3e5f5",
                borderColor: isDark ? "#2a2a6a" : "#ce93d8",
              },
            ]}
          >
            <Ionicons
              name="logo-firebase"
              size={24}
              color={isDark ? "#c084fc" : "#7b1fa2"}
            />
            <View style={styles.firebaseContent}>
              <Text
                style={[
                  styles.firebaseTitle,
                  {
                    color: isDark ? "#c084fc" : "#7b1fa2",
                  },
                ]}
              >
                Integrasi Firebase
              </Text>
              <Text
                style={[
                  styles.firebaseText,
                  {
                    color: isDark ? "#ce93d8" : "#8e24aa",
                  },
                ]}
              >
                Data dari 6 sensor (3 gudang) akan tersinkronisasi secara
                otomatis ke Firestore untuk penyimpanan jangka panjang.
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  intervalInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    width: 60,
    textAlign: "center",
    fontSize: 14,
  },
  statsSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
  },
  statCount: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  logsList: {
    marginBottom: 16,
  },
  logItem: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  logStatusIndicator: {
    paddingTop: 2,
  },
  logContent: {
    gap: 8,
    flex: 1,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logTitleSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  warehouseIcon: {
    marginTop: 2,
  },
  warehouseName: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 2,
  },
  sensorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  logDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logValue: {
    fontSize: 13,
    fontWeight: "bold",
  },
  logTimestamp: {
    fontSize: 11,
  },
  firebaseCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    flexDirection: "row",
    gap: 12,
  },
  firebaseContent: {
    flex: 1,
  },
  firebaseTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  firebaseText: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomPadding: {
    height: 20,
  },
});
