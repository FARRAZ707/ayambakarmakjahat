import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Dimensions, StyleSheet, Text, View, ViewProps } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

interface ChartProps extends ViewProps {
  title: string;
  chartType?: "line" | "bar";
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
    strokeWidth?: number;
  }[];
  unit?: string;
}

export function SensorChart({
  title,
  chartType = "line",
  labels,
  datasets,
  unit = "",
  style,
}: ChartProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];
  const windowWidth = Dimensions.get("window").width;
  const chartWidth = windowWidth - 40;

  const chartConfig = {
    backgroundGradientFrom: isDark ? "#1a1a1a" : "#ffffff",
    backgroundGradientTo: isDark ? "#1a1a1a" : "#ffffff",
    color: (opacity = 1) =>
      isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: colors.tint,
    },
  };

  const chartData = {
    labels: labels,
    datasets: datasets.map((dataset) => ({
      data: dataset.data,
      color: (opacity = 1) => dataset.color || colors.tint,
      strokeWidth: dataset.strokeWidth || 2,
    })),
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#222222" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e0e0e0",
        },
        style,
      ]}
    >
      <View style={styles.header}>
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
        {unit && (
          <Text
            style={[
              styles.unit,
              {
                color: isDark ? "#999999" : "#666666",
              },
            ]}
          >
            Unit: {unit}
          </Text>
        )}
      </View>

      <View style={styles.chartContainer}>
        {chartType === "line" ? (
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 8,
            }}
          />
        ) : (
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            style={{
              marginVertical: 8,
              borderRadius: 8,
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  unit: {
    fontSize: 12,
    fontWeight: "500",
  },
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
