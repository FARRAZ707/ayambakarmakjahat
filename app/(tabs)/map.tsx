import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Pastikan path ini sesuai dengan lokasi komponen Anda
import { WarehouseMap } from "@/components/warehouse-map";
import { router } from "expo-router";

interface Warehouse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  gas: number;
}

export default function MapTab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Setup API Key
  const expoConstants = Constants as unknown as {
    expoConfig?: { extra?: { googleMapsApiKey?: string } };
    manifest?: { extra?: { googleMapsApiKey?: string } };
  };
  const googleApiKey =
    expoConstants.expoConfig?.extra?.googleMapsApiKey ||
    expoConstants.manifest?.extra?.googleMapsApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Data Gudang (Bisa disesuaikan atau diambil dari Firebase nantinya)
  const [warehouses] = useState<Warehouse[]>([
    { id: "WH1", name: "Gudang Utama", latitude: -6.2088, longitude: 106.8456, temperature: 27.5, gas: 42 },
    { id: "WH2", name: "Gudang Cabang", latitude: -6.1753, longitude: 106.8249, temperature: 26.8, gas: 38 },
    { id: "WH3", name: "Gudang Distribusi", latitude: -6.2315, longitude: 106.8762, temperature: 28.2, gas: 45 },
  ]);

  // --- FITUR TAMBAHAN: Logika Analitik Kritis ---
  // Secara otomatis mencari gudang dengan angka tertinggi untuk dipantau
  const maxTempWarehouse = warehouses.reduce((prev, current) => (prev.temperature > current.temperature) ? prev : current);
  const maxGasWarehouse = warehouses.reduce((prev, current) => (prev.gas > current.gas) ? prev : current);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" }]}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header Kustom dengan Tombol Back */}
        <View style={[styles.header, { backgroundColor: isDark ? "#1a1a1a" : "#ffffff", borderBottomColor: isDark ? "#333333" : "#e0e0e0" }]}>
          <View style={styles.headerTitleContainer}>
            
            {/* --- TOMBOL BACK --- */}
            <TouchableOpacity 
              onPress={() => router.navigate('/')} 
              style={{ paddingRight: 12, paddingVertical: 4 }}
            >
              <Ionicons name="arrow-back" size={24} color={isDark ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
            {/* ------------------- */}

            <Ionicons name="map" size={24} color={isDark ? "#ffffff" : "#000000"} />
            <Text style={[styles.headerTitle, { color: isDark ? "#ffffff" : "#000000" }]}>
              Pemantauan Geografis
            </Text>
          </View>
          <Text style={[styles.headerSubtitle, { color: isDark ? "#999999" : "#666666", marginLeft: 44 }]}>
            Distribusi Lokasi & Status Fasilitas
          </Text>
        </View>

        <View style={styles.content}>
          {/* Komponen Peta Utama */}
          <View style={styles.mapSection}>
            <WarehouseMap warehouses={warehouses} googleApiKey={googleApiKey} />
          </View>

          {/* Fitur Tambahan: Panel Analitik Lokasi Kritis */}
          <Text style={[styles.sectionTitle, { color: isDark ? "#ffffff" : "#000000" }]}>
            Analitik Lokasi Kritis
          </Text>

          <View style={styles.analyticsGrid}>
            {/* Highlight Suhu Tertinggi */}
            <View style={[styles.analyticCard, { backgroundColor: isDark ? "#3a1c1c" : "#ffebee" }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="thermometer" size={20} color="#f44336" />
                <Text style={[styles.cardTitle, { color: isDark ? "#ffcdd2" : "#c62828" }]}>Suhu Tertinggi</Text>
              </View>
              <Text style={[styles.cardValue, { color: isDark ? "#ffffff" : "#000000" }]}>
                {maxTempWarehouse.temperature}°C
              </Text>
              <Text style={[styles.cardLocation, { color: isDark ? "#ffcdd2" : "#c62828" }]}>
                📍 {maxTempWarehouse.name}
              </Text>
            </View>

            {/* Highlight Gas Tertinggi */}
            <View style={[styles.analyticCard, { backgroundColor: isDark ? "#1c2a3a" : "#e3f2fd" }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="cloud" size={20} color="#2196f3" />
                <Text style={[styles.cardTitle, { color: isDark ? "#bbdefb" : "#1565c0" }]}>Level Gas Tertinggi</Text>
              </View>
              <Text style={[styles.cardValue, { color: isDark ? "#ffffff" : "#000000" }]}>
                {maxGasWarehouse.gas} ppm
              </Text>
              <Text style={[styles.cardLocation, { color: isDark ? "#bbdefb" : "#1565c0" }]}>
                📍 {maxGasWarehouse.name}
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
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  mapSection: {
    marginBottom: 24,
    marginHorizontal: -20, // Agar peta lebih lebar dari margin konten
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  analyticsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  analyticCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 11,
    fontWeight: "500",
  },
  bottomPadding: {
    height: 40,
  },
});