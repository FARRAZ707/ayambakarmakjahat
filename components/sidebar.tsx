import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  activeItem?: string;
}

export function Sidebar({
  isOpen,
  onClose,
  menuItems,
  activeItem,
}: SidebarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];

  if (!isOpen) return null;

  const handleMenuItemPress = (item: MenuItem) => {
    item.onPress();
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdropTouchable}
        onPress={onClose}
        activeOpacity={1}
      />
      <SafeAreaView
        style={[
          styles.sidebar,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
          },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              borderBottomColor: isDark ? "#333333" : "#e0e0e0",
            },
          ]}
        >
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
          <TouchableOpacity onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "#ffffff" : "#000000"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                activeItem === item.id && [
                  styles.menuItemActive,
                  { backgroundColor: colors.tint },
                ],
              ]}
              onPress={() => handleMenuItemPress(item)}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={
                  activeItem === item.id
                    ? "#ffffff"
                    : isDark
                      ? "#cccccc"
                      : "#666666"
                }
                style={styles.menuIcon}
              />
              <Text
                style={[
                  styles.menuLabel,
                  {
                    color:
                      activeItem === item.id
                        ? "#ffffff"
                        : isDark
                          ? "#cccccc"
                          : "#333333",
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              borderTopColor: isDark ? "#333333" : "#e0e0e0",
            },
          ]}
        >
          <Text
            style={[
              styles.footerText,
              {
                color: isDark ? "#999999" : "#666666",
              },
            ]}
          >
            v1.0.0 - IoT System
          </Text>
          <Text
            style={[
              styles.footerSubtext,
              {
                color: isDark ? "#666666" : "#999999",
              },
            ]}
          >
            Firebase Firestore Ready
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 1000,
  },
  backdropTouchable: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    width: Dimensions.get("window").width * 0.75,
    maxWidth: 280,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  menuItemActive: {
    marginHorizontal: 10,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
  },
});
