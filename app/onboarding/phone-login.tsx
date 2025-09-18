import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

// NOTE: This screen uses a mocked OTP flow suitable for development.
// For production, integrate Firebase Phone Auth or Twilio Verify.
export default function PhoneLoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    const cleanPhone = phone.replace(/\s|-/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      Alert.alert('Invalid phone', 'Please enter a valid phone number including country code.');
      return;
    }
    try {
      setIsSending(true);
      // Simulated OTP. Replace with real provider integration (Firebase/Twilio) in production.
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(code);
      setIsOTPSent(true);
      // Dev helper to allow testing without SMS backend
      Alert.alert('OTP sent (development)', `Use this code to verify: ${code}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code.');
      return;
    }
    try {
      setIsVerifying(true);
      if (otp === sentOtp) {
        await AsyncStorage.setItem('auth', JSON.stringify({ phone }));
        // Proceed to health quiz after successful phone verification
        router.push('/onboarding/health-quiz');
      } else {
        Alert.alert('Incorrect code', 'The code you entered is incorrect. Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to verify OTP.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#FF8E53']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="call" size={32} color="#FF6B9D" />
            </View>
          </View>
          <Text style={styles.title}>Verify your phone</Text>
          <Text style={styles.subtitle}>We will send a one-time code to your number</Text>
        </View>

        <View style={styles.formContainer}>
          {!isOTPSent ? (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Phone number (e.g., +1 555 555 5555)"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={sendOtp} disabled={isSending}>
                <LinearGradient colors={['#FF6B9D', '#FF8E53']} style={styles.buttonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.primaryButtonText}>{isSending ? 'Sending...' : 'Send OTP'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={18} color="#666" />
                <Text style={styles.secondaryButtonText}>Back to sign up</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#999"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={verifyOtp} disabled={isVerifying}>
                <LinearGradient colors={['#FF6B9D', '#FF8E53']} style={styles.buttonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.primaryButtonText}>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkButton} onPress={sendOtp} disabled={isSending}>
                <Text style={styles.linkButtonText}>{isSending ? 'Resending...' : 'Resend code'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton} onPress={() => { setIsOTPSent(false); setOtp(''); }}>
                <Ionicons name="arrow-back" size={18} color="#666" />
                <Text style={styles.secondaryButtonText}>Change phone number</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: height * 0.06,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  secondaryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkButtonText: {
    color: '#FF6B9D',
    fontSize: 14,
    fontWeight: '600',
  },
});
