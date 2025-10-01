import { Stack } from 'expo-router';

export default function DistributorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="orders-to-admin" />
      <Stack.Screen name="stock" />
      <Stack.Screen name="pharmacies" />
    </Stack>
  );
}
