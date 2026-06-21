import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Constants from "expo-constants";
import React from "react";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
  googleApiKey?: string;
}

export function WarehouseMap({ warehouses, googleApiKey }: WarehouseMapProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];

  const expoConstants = Constants as unknown as {
    expoConfig?: { extra?: { googleMapsApiKey?: string } };
    manifest?: { extra?: { googleMapsApiKey?: string } };
  };
  const key =
    googleApiKey ||
    expoConstants.expoConfig?.extra?.googleMapsApiKey ||
    expoConstants.manifest?.extra?.googleMapsApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

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

  if (Platform.OS === "web") {
    if (!key) {
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
            Untuk menampilkan peta di web diperlukan Google Maps API Key.
          </Text>
        </View>
      );
    }

    const markers = warehouses
      .map((w) => `markers=color:red%7C${w.latitude},${w.longitude}`)
      .join("&");
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=12&size=640x300&${markers}&key=${encodeURIComponent(
      key,
    )}`;

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
        <Image source={{ uri: url }} style={styles.map} />
      </View>
    );
  }

  // Native (iOS/Android) - use react-native-maps with Google provider
  const initialRegion = {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

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
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          style={styles.map}
        >
          {warehouses.map((w) => (
            <Marker
              key={w.id}
              coordinate={{ latitude: w.latitude, longitude: w.longitude }}
              title={w.name}
              description={`Suhu: ${w.temperature}°C • Gas: ${w.gas} ppm`}
            />
          ))}
        </MapView>
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
