import { Stack } from 'expo-router';

export default function PharmacyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="inventory" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="catalog" />
    </Stack>
  );
}