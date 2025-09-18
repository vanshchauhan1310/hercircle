import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PharmacySettings() {
  const [store, setStore] = useState<any>(null);
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState('5');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const auth = JSON.parse((await AsyncStorage.getItem('pharmacy_auth')) || 'null');
    const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
    const s = stores.find((x: any) => x.id === auth?.storeId);
    if (s) {
      setStore(s);
      setStoreName(s.storeName);
      setPhone(s.phone);
      setAddress(s.address);
      setDeliveryRadiusKm(String(s.settings?.deliveryRadiusKm ?? 5));
      setIsOpen(Boolean(s.settings?.isOpen ?? true));
    }
  };

  const save = async () => {
    try {
      const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
      const idx = stores.findIndex((x: any) => x.id === store.id);
      if (idx >= 0) {
        stores[idx] = {
          ...stores[idx],
          storeName,
          phone,
          address,
          settings: { deliveryRadiusKm: Number(deliveryRadiusKm || 5), isOpen },
        };
        await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
        Alert.alert('Saved', 'Store settings updated.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to save settings.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Store Settings</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Ionicons name="save-outline" size={18} color="#fff" />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Store Name</Text>
        <TextInput style={styles.input} value={storeName} onChangeText={setStoreName} />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} />

        <Text style={styles.label}>Delivery Radius (km)</Text>
        <TextInput style={styles.input} value={deliveryRadiusKm} onChangeText={setDeliveryRadiusKm} keyboardType="numeric" />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Open for Orders</Text>
          <Switch value={isOpen} onValueChange={setIsOpen} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#7C3AED', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#4F46E5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  saveText: { color: '#fff', fontWeight: '700' },
  content: { padding: 16, gap: 10 },
  label: { fontSize: 13, color: '#374151', fontWeight: '600' },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 10 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
});