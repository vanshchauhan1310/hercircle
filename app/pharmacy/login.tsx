import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export default function PharmacyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
      const found = stores.find((s: any) => s.email === email && s.password === password);
      if (!found) {
        Alert.alert('Invalid credentials', 'Please check your details or sign up.');
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem('pharmacy_auth', JSON.stringify({ storeId: found.id }));
      router.replace('/pharmacy/dashboard');
    } catch (e) {
      Alert.alert('Error', 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7C3AED", "#3B82F6"]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Ionicons name="medkit" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Pharmacy Portal</Text>
          <Text style={styles.headerSubtitle}>Log in to manage your store</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
            <LinearGradient colors={["#7C3AED", "#3B82F6"]} style={styles.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.primaryText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/pharmacy/signup')} style={styles.linkButton}>
            <Text style={styles.linkText}>New here? Create a pharmacy account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 20, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 8, marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)' },
  content: { flex: 1, paddingHorizontal: 20, marginTop: -20 },
  form: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, paddingHorizontal: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: '#111827' },
  primaryButton: { marginTop: 8, borderRadius: 12, overflow: 'hidden' },
  primaryGradient: { height: 52, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  linkButton: { alignItems: 'center', marginTop: 12 },
  linkText: { color: '#2563EB', fontWeight: '600' },
});