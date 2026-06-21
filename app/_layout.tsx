import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// --- 1. UBAH BAGIAN INI AGAR MERUJUK KE INDEX (LOGIN) ---
export const unstable_settings = {
  initialRouteName: 'index', 
};
// -----------------------------------------------------

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View
        style={[
          styles.letterbox,
          { backgroundColor: isDark ? "#000000" : "#e0e0e0" },
        ]}
      >
        <View style={styles.ratioContainer}>
          
          <Stack>
            {/* --- 2. TAMBAHKAN BARIS SCREEN INDEX DI SINI --- */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* ----------------------------------------------- */}
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false, 
                animation: "flip" // <--- Ini kunci transisi halusnya
              }} 
            />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          
        </View>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  letterbox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ratioContainer: {
    width: "100%",
    height: "95%",
    overflow: "hidden", 
    backgroundColor: "transparent", 
    borderRadius: 20,
  },
});