import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, ViewProps } from "react-native";

interface SensorCardProps extends ViewProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  status?: "good" | "warning" | "critical";
  timestamp?: string;
}

export function SensorCard({
  title,
  value,
  unit = "",
  icon,
  status = "good",
  timestamp,
  style,
}: SensorCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];

  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "#ff4444";
      case "warning":
        return "#ffaa00";
      default:
        return colors.tint;
    }
  };

  const statusColor = getStatusColor();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#222222" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e0e0e0",
        },
        style,
      ]}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${statusColor}15` },
          ]}
        >
          <Ionicons name={icon as any} size={24} color={statusColor} />
        </View>
        <Text
          style={[
            styles.title,
            {
              color: isDark ? "#e0e0e0" : "#333333",
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.valueContainer}>
          <Text
            style={[
              styles.value,
              {
                color: statusColor,
              },
            ]}
          >
            {value}
          </Text>
          {unit && (
            <Text
              style={[
                styles.unit,
                {
                  color: isDark ? "#999999" : "#666666",
                },
              ]}
            >
              {unit}
            </Text>
          )}
        </View>
        {timestamp && (
          <Text
            style={[
              styles.timestamp,
              {
                color: isDark ? "#666666" : "#999999",
              },
            ]}
          >
            {timestamp}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.statusIndicator,
          {
            backgroundColor: statusColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  content: {
    paddingLeft: 52,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 11,
  },
  statusIndicator: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 4,
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});
