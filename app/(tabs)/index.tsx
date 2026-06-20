import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageIndicator}>halaman 1-4</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Data Lokasi Pengguna</Text>
        <Text style={styles.address}>Alamat: JL.AMUNTAI</Text>
        
        {/* Nantinya grafik MQTT dan data Firestore bisa ditempatkan di area ini */}
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Area Grafik Sensor ESP32 (Segera Hadir)</Text>
        </View>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
  },
  chartPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#999',
  },
  placeholderText: {
    color: '#666',
  }
});