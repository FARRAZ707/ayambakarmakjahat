import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "light"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Kunci Akun Pengujian Sederhana
    const emailBenar = "admin@smartstorage.com";
    const passwordBenar = "admin123";

    if (email === emailBenar && password === passwordBenar) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.replace("/dashboard");
      }, 1000);
    } else {
      // Jika salah, munculkan peringatan sistem
      Alert.alert(
        "Akses Ditolak",
        "Email atau password yang Anda masukkan salah. Silakan periksa kembali kredensial Anda.",
        [{ text: "Coba Lagi" }]
      );
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Bagian Logo & Judul */}
          <View style={styles.headerContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isDark ? "#1a2a3a" : "#e3f2fd" },
              ]}
            >
              <Ionicons name="cube-outline" size={48} color={colors.tint} />
            </View>
            <Text
              style={[
                styles.title,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Smart Storage
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? "#999999" : "#666666" },
              ]}
            >
              Sistem Peringatan Dini dan Monitoring Parameter Lingkungan
            </Text>
          </View>

          {/* Bagian Form Input */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: isDark ? "#cccccc" : "#333333" },
                ]}
              >
                Email
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                    borderColor: isDark ? "#333333" : "#e0e0e0",
                  },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={isDark ? "#666666" : "#999999"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                  placeholder="admin@smartstorage.com"
                  placeholderTextColor={isDark ? "#666666" : "#aaaaaa"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: isDark ? "#cccccc" : "#333333" },
                ]}
              >
                Password
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
                    borderColor: isDark ? "#333333" : "#e0e0e0",
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={isDark ? "#666666" : "#999999"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? "#ffffff" : "#000000" },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={isDark ? "#666666" : "#aaaaaa"}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={isDark ? "#666666" : "#999999"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotText, { color: colors.tint }]}>
                Lupa Password?
              </Text>
            </TouchableOpacity>

            {/* Tombol Login */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: colors.tint, opacity: isLoading ? 0.7 : 1 },
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Mengautentikasi..." : "Masuk ke Dashboard"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: isDark ? "#666666" : "#999999" },
              ]}
            >
              Akses terbatas hanya untuk personel berwenang.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
  },
});