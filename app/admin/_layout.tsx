import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="management/distributors" />
      <Stack.Screen name="management/products" />
      <Stack.Screen name="management/orders" />
    </Stack>
  );
}
