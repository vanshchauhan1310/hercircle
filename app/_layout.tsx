import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="pharmacy" />
        <Stack.Screen name="distributor" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding/health-quiz" />
      </Stack>
    </AuthProvider>
  );
}
