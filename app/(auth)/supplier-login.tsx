import { useAuth } from '@/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

type Role = 'pharmacy' | 'distributor' | 'admin';

export default function SupplierLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('pharmacy');
  const { login } = useAuth();

  const handleSupplierLogin = () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }
    login({ email, role, loggedInAt: Date.now() });
  };

  const RoleSelector = () => (
    <View style={styles.roleSelectorContainer}>
      {[
        { id: 'pharmacy', name: 'Pharmacy', icon: 'home' },
        { id: 'distributor', name: 'Distributor', icon: 'truck' },
        { id: 'admin', name: 'Admin', icon: 'shield' },
      ].map((r) => (
        <TouchableOpacity
          key={r.id}
          style={[styles.roleButton, role === r.id && styles.roleButtonActive]}
          onPress={() => setRole(r.id as Role)}>
          <Feather
            name={r.icon as any}
            size={18}
            color={role === r.id ? '#fff' : '#4B5563'}
          />
          <Text style={[styles.roleButtonText, role === r.id && styles.roleButtonTextActive]}>
            {r.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#10B981']} style={styles.gradient} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Supplier Portal</Text>
          <Text style={styles.subtitle}>Sign in to your business account</Text>
        </View>

        <View style={styles.formContainer}>
          <RoleSelector />

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
              autoComplete="email"
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
              autoComplete="password"
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSupplierLogin}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(auth)/supplier-signup')}>
            <Text style={styles.secondaryButtonText}>Create a new Supplier Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Not a supplier? Go back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  secondaryButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
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
  roleSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  roleButtonActive: {
    backgroundColor: '#10B981',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
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
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
