import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface Warehouse {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  temperature: number;
  gas: number;
}

interface WarehouseMapProps {
  warehouses: Warehouse[];
  mapboxApiKey?: string; // Optional: untuk Mapbox tile layer
}

// ========== LEAFLET API KEY INFORMATION ==========
// PENTING: OpenStreetMap (saat ini) GRATIS dan TIDAK memerlukan API Key!
//
// ⚠️ EXPO GO LIMITATION:
// - Leaflet HANYA tersedia di WEB (tidak support di Expo Go untuk Android/iOS)
// - Di Expo Go, komponen akan menampilkan placeholder text
// - Untuk mobile native, gunakan: react-native-maps atau expo-map-view
//
// JIKA INGIN MENGGUNAKAN PROVIDER LAIN (Mapbox, dll):
// 1. Daftar di https://www.mapbox.com/
// 2. Dapatkan Mapbox API key
// 3. Pass ke component: <WarehouseMap warehouses={warehouses} mapboxApiKey="YOUR_KEY" />
// 4. Uncomment TileLayer Mapbox di bawah (line ~130)
// ================================================

// Leaflet is web-only, so we export a web component
let MapContainer: any;
let TileLayer: any;
let Marker: any;
let Popup: any;

if (Platform.OS === "web") {
  try {
    const leaflet = require("react-leaflet");
    MapContainer = leaflet.MapContainer;
    TileLayer = leaflet.TileLayer;
    Marker = leaflet.Marker;
    Popup = leaflet.Popup;
  } catch (e) {
    console.log("Leaflet not available");
  }
}

export function WarehouseMap({ warehouses, mapboxApiKey }: WarehouseMapProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];

  if (Platform.OS !== "web") {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? "#222222" : "#ffffff",
            borderColor: isDark ? "#333333" : "#e0e0e0",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: isDark ? "#e0e0e0" : "#333333",
            },
          ]}
        >
          Peta Gudang
        </Text>
        <Text
          style={[
            styles.message,
            {
              color: isDark ? "#999999" : "#666666",
            },
          ]}
        >
          Peta hanya tersedia di versi WEB
        </Text>
        <Text
          style={[
            styles.helpText,
            {
              color: isDark ? "#888888" : "#777777",
            },
          ]}
        >
        </Text>
      </View>
    );
  }

  // Default center (Indonesia)
  const defaultCenter: [number, number] = [-6.2088, 106.8456];
  const centerLat =
    warehouses.length > 0
      ? warehouses.reduce((sum, w) => sum + w.latitude, 0) / warehouses.length
      : defaultCenter[0];
  const centerLng =
    warehouses.length > 0
      ? warehouses.reduce((sum, w) => sum + w.longitude, 0) / warehouses.length
      : defaultCenter[1];

  if (!MapContainer) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? "#222222" : "#ffffff",
            borderColor: isDark ? "#333333" : "#e0e0e0",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: isDark ? "#e0e0e0" : "#333333",
            },
          ]}
        >
          Peta Gudang
        </Text>
        <Text
          style={[
            styles.message,
            {
              color: isDark ? "#999999" : "#666666",
            },
          ]}
        >
          Loading peta...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#222222" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e0e0e0",
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: isDark ? "#e0e0e0" : "#333333",
          },
        ]}
      >
        Peta Gudang
      </Text>
      <View style={styles.mapContainer}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={12}
          style={styles.map}
        >
          {/* OpenStreetMap - Gratis, tidak butuh API key */}
          {!mapboxApiKey ? (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            /* Mapbox - Butuh API key dari https://www.mapbox.com/ */
            <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/{x}/{y}/{z}/1280x720?access_token=${mapboxApiKey}`}
            />
          )}
          {warehouses.map((warehouse) => (
            <Marker
              key={warehouse.id}
              position={[warehouse.latitude, warehouse.longitude]}
            >
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong>{warehouse.name}</strong>
                  <br />
                  <div style={{ marginTop: "8px", fontSize: "12px" }}>
                    <div>
                      🌡️ Suhu: <strong>{warehouse.temperature}°C</strong>
                    </div>
                    <div>
                      💨 Gas: <strong>{warehouse.gas} ppm</strong>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 20,
  },
  helpText: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});
