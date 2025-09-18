import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PharmacyDashboard() {
  const [store, setStore] = useState<any>(null);
  const [stats, setStats] = useState({
    products: 0,
    lowStock: 0,
    openOrders: 0,
    revenueToday: 0,
    avgOrderValue: 0,
    outOfStock: 0,
    processingOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
  });

  const distributors = [
    { id: 'd1', name: 'HealthSupply Co.', leadTime: '2-3 days', minOrder: 100, rating: 4.8, color: '#E0F2FE' },
    { id: 'd2', name: 'MediWholesale', leadTime: '1-2 days', minOrder: 150, rating: 4.6, color: '#DCFCE7' },
    { id: 'd3', name: 'PharmaDirect', leadTime: 'Same-day (Metro)', minOrder: 200, rating: 4.7, color: '#FAE8FF' },
  ];

  useEffect(() => {
    (async () => {
      const auth = JSON.parse((await AsyncStorage.getItem('pharmacy_auth')) || 'null');
      const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
      const s = stores.find((x: any) => x.id === auth?.storeId);
      if (!s) return;
      setStore(s);

      const products = s?.inventory?.length || 0;
      const lowStock = s?.inventory?.filter((p: any) => (p.stock || 0) <= (p.reorderLevel || 5)).length || 0;
      const outOfStock = s?.inventory?.filter((p: any) => (p.stock || 0) === 0).length || 0;

      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const orders = s?.orders || [];
      const revenueToday = orders.filter((o: any) => o.createdAt >= todayStart.getTime() && (o.status === 'Completed' || o.status === 'Ready')).reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const avgOrderValue = orders.length ? (orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0) / orders.length) : 0;
      const openOrders = orders.filter((o: any) => o.status === 'Pending').length || 0;
      const processingOrders = orders.filter((o: any) => o.status === 'Processing').length || 0;
      const readyOrders = orders.filter((o: any) => o.status === 'Ready').length || 0;
      const completedOrders = orders.filter((o: any) => o.status === 'Completed').length || 0;

      setStats({ products, lowStock, outOfStock, openOrders, processingOrders, readyOrders, completedOrders, revenueToday, avgOrderValue });
    })();
  }, []);

  const Card = ({ title, value, icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.cardIconWrap, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const placeDistributorOrder = async (distributorId: string, distributorName: string) => {
    try {
      const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
      const idx = stores.findIndex((x: any) => x.id === store.id);
      if (idx < 0) return;

      const inventory = stores[idx].inventory || [];
      // Build suggested restock based on low/out-of-stock items
      const items = inventory
        .filter((p: any) => (p.stock || 0) <= (p.reorderLevel || 5))
        .map((p: any) => {
          const target = Math.max((p.reorderLevel || 5) * 2, 10);
          const qty = Math.max(target - (p.stock || 0), 1);
          return { name: p.name, qty, price: p.price || 0 };
        });

      if (items.length === 0) {
        Alert.alert('Up to date', 'No low-stock items found to restock.');
        return;
      }

      const total = items.reduce((sum: number, it: any) => sum + it.price * it.qty, 0);
      const orderId = Math.floor(Math.random() * 9000 + 1000).toString();
      const order = {
        id: `${orderId}-D`,
        customer: `${distributorName} (Restock)`,
        items: items.map((it: any) => ({ name: it.name, qty: it.qty })),
        total,
        status: 'Pending',
        createdAt: Date.now(),
      };

      stores[idx].orders = [order, ...(stores[idx].orders || [])];
      await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
      setStore(stores[idx]);
      Alert.alert('Order placed', `Restock request sent to ${distributorName}.`);
    } catch (e) {
      Alert.alert('Error', 'Could not place distributor order.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#7C3AED", "#3B82F6"]} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{store?.storeName || 'Your Pharmacy'}</Text>
          <TouchableOpacity onPress={() => router.replace('/pharmacy/login')}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Manage inventory, orders and store settings</Text>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
        <View style={styles.grid}>
          <Card title="Products" value={stats.products} icon="cube" color="#6366F1" onPress={() => router.push('/pharmacy/inventory')} />
          <Card title="Low Stock" value={stats.lowStock} icon="alert-circle" color="#F59E0B" onPress={() => router.push('/pharmacy/inventory')} />
          <Card title="Out of Stock" value={stats.outOfStock} icon="close-circle" color="#EF4444" onPress={() => router.push('/pharmacy/inventory')} />
          <Card title="Pending" value={stats.openOrders} icon="time" color="#F97316" onPress={() => router.push('/pharmacy/orders')} />
          <Card title="Processing" value={stats.processingOrders} icon="sync" color="#06B6D4" onPress={() => router.push('/pharmacy/orders')} />
          <Card title="Ready" value={stats.readyOrders} icon="checkmark-done" color="#22C55E" onPress={() => router.push('/pharmacy/orders')} />
          <Card title="Completed" value={stats.completedOrders} icon="reader" color="#0EA5E9" onPress={() => router.push('/pharmacy/orders')} />
          <Card title="Revenue Today" value={`$${stats.revenueToday.toFixed(2)}`} icon="cash" color="#10B981" onPress={() => router.push('/pharmacy/orders')} />
          <Card title="Avg Order" value={`$${stats.avgOrderValue.toFixed(2)}`} icon="pricetag" color="#8B5CF6" onPress={() => router.push('/pharmacy/orders')} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/pharmacy/inventory')}>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.actionText}>Add New Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#0EA5E9' }]} onPress={() => router.push('/pharmacy/orders')}>
            <Ionicons name="documents" size={20} color="#fff" />
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F43F5E' }]} onPress={() => router.push('/pharmacy/settings')}>
            <Ionicons name="settings" size={20} color="#fff" />
            <Text style={styles.actionText}>Store Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Distributors Section */}
        <View style={styles.distributorsSection}>
          <Text style={styles.sectionTitle}>Available Distributors</Text>
          <View style={styles.distributorsGrid}>
            {distributors.map((d) => (
              <View key={d.id} style={styles.distCard}>
                <View style={[styles.distIcon, { backgroundColor: d.color }]}>
                  <Ionicons name="business" size={18} color="#111827" />
                </View>
                <Text style={styles.distName}>{d.name}</Text>
                <Text style={styles.distMeta}>Lead time: {d.leadTime}</Text>
                <Text style={styles.distMeta}>Min order: ${d.minOrder}</Text>
                <Text style={styles.distMeta}>Rating: {d.rating.toFixed(1)} ★</Text>
                <TouchableOpacity
                  style={styles.distBtn}
                  onPress={() => placeDistributorOrder(d.id, d.name)}
                >
                  <Ionicons name="cart" size={16} color="#fff" />
                  <Text style={styles.distBtnText}>Place Restock Order</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 20, paddingBottom: 20, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSubtitle: { marginTop: 6, color: 'rgba(255,255,255,0.9)' },
  content: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '31.5%', backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  cardIconWrap: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardValue: { fontSize: 16, fontWeight: '800', color: '#111827' },
  cardTitle: { fontSize: 11, color: '#6B7280', textAlign: 'center' },
  actions: { marginTop: 16, gap: 12 },
  actionButton: { backgroundColor: '#22C55E', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  actionText: { color: '#fff', fontWeight: '700' },
  distributorsSection: { marginTop: 18 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 10 },
  distributorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  distCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  distIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  distName: { fontSize: 15, fontWeight: '800', color: '#111827' },
  distMeta: { fontSize: 12, color: '#6B7280' },
  distBtn: { marginTop: 10, backgroundColor: '#7C3AED', borderRadius: 10, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  distBtnText: { color: '#fff', fontWeight: '800' },
});