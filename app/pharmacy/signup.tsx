import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function PharmacySignup() {
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [license, setLicense] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!storeName || !email || !phone || !address || !license || !password) {
      Alert.alert('Missing info', 'Please fill all the fields.');
      return;
    }
    setLoading(true);
    try {
      const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
      if (stores.find((s: any) => s.email === email)) {
        Alert.alert('Already exists', 'A store with this email already exists.');
        setLoading(false);
        return;
      }
      const newStore = {
        id: Date.now().toString(),
        storeName,
        email,
        phone,
        address,
        license,
        password,
        inventory: [],
        settings: { deliveryRadiusKm: 5, isOpen: true },
      };
      const updated = [...stores, newStore];
      await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(updated));
      await AsyncStorage.setItem('pharmacy_auth', JSON.stringify({ storeId: newStore.id }));
      router.replace('/pharmacy/dashboard');
    } catch (e) {
      Alert.alert('Error', 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7C3AED", "#3B82F6"]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Ionicons name="storefront" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Create Pharmacy Account</Text>
          <Text style={styles.headerSubtitle}>List your store on HerCircle</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.form} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Store Details</Text>
        <TextInput style={styles.input} placeholder="Store Name" placeholderTextColor="#999" value={storeName} onChangeText={setStoreName} />
        <TextInput style={styles.input} placeholder="Business Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Contact Phone" placeholderTextColor="#999" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Address" placeholderTextColor="#999" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="Pharmacy License Number" placeholderTextColor="#999" value={license} onChangeText={setLicense} />

        <Text style={styles.sectionTitle}>Owner Credentials</Text>
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
          <LinearGradient colors={["#7C3AED", "#3B82F6"]} style={styles.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.primaryText}>{loading ? 'Creating…' : 'Create Account'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/pharmacy/login')} style={styles.linkButton}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 20, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#fff', marginTop: 8, marginBottom: 4 },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)' },
  form: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, paddingVertical: 12, color: '#111827', marginBottom: 12 },
  primaryButton: { marginTop: 8, borderRadius: 12, overflow: 'hidden' },
  primaryGradient: { height: 52, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  linkButton: { alignItems: 'center', marginTop: 12 },
  linkText: { color: '#2563EB', fontWeight: '600' },
});