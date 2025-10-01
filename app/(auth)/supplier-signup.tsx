import { useAuth } from '@/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

import { router as appRouter } from 'expo-router';

type Role = 'distributor' | 'pharmacy';

export default function SupplierSignupScreen() {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('distributor');
  const [details, setDetails] = useState({ city: '', phone: '' });
  const { login } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !companyName) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    try {
      if (role === 'distributor') {
        const pendingKey = 'admin_pending_distributors';
        const list = JSON.parse((await AsyncStorage.getItem(pendingKey)) || '[]');
        list.unshift({ id: `${Date.now()}`, name: companyName, email, phone: details.phone || '', location: details.city || '' });
        await AsyncStorage.setItem(pendingKey, JSON.stringify(list));
      } else if (role === 'pharmacy') {
        const pendingKey = 'admin_pending_pharmacies';
        const list = JSON.parse((await AsyncStorage.getItem(pendingKey)) || '[]');
        list.unshift({ id: `${Date.now()}`, name: companyName, owner: email, city: details.city || '', phone: details.phone || '' });
        await AsyncStorage.setItem(pendingKey, JSON.stringify(list));
      }

      Alert.alert('Request submitted', 'Your account is pending admin approval. You will be able to login once approved.', [
        { text: 'OK', onPress: () => appRouter.replace('/(auth)/supplier-login') },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#10B981']} style={styles.gradient} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Become a Supplier</Text>
          <Text style={styles.subtitle}>Join our network of pharmacies and distributors.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.roleSelectorContainer}>
            {[
              { id: 'distributor', label: 'Distributor', icon: 'truck' },
              { id: 'pharmacy', label: 'Pharmacy', icon: 'home' },
            ].map((r) => (
              <TouchableOpacity key={r.id} style={[styles.roleButton, role === (r.id as Role) && styles.roleButtonActive]} onPress={() => setRole(r.id as Role)}>
                <Feather name={r.icon as any} size={16} color={role === (r.id as Role) ? '#fff' : '#4B5563'} />
                <Text style={[styles.roleButtonText, role === (r.id as Role) && styles.roleButtonTextActive]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Feather name="briefcase" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={role === 'pharmacy' ? 'Pharmacy Name' : 'Company Name'}
              placeholderTextColor="#9CA3AF"
              value={companyName}
              onChangeText={setCompanyName}
              autoCapitalize="words"
            />
          </View>

          {role === 'pharmacy' && (
            <>
              <View style={styles.inputContainer}>
                <Feather name="map-pin" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="City" placeholderTextColor="#9CA3AF" value={details.city} onChangeText={(v) => setDetails({ ...details, city: v })} />
              </View>
              <View style={styles.inputContainer}>
                <Feather name="phone" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" value={details.phone} onChangeText={(v) => setDetails({ ...details, phone: v })} />
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Business Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  roleSelectorContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 20 },
  roleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  roleButtonActive: { backgroundColor: '#10B981' },
  roleButtonText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  roleButtonTextActive: { color: '#fff' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 8,
  },
  primaryButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
