import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Order {
  id: string;
  customer: string;
  items: Array<{ name: string; qty: number }>;
  total: number;
  status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  createdAt: number;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'All' | Order['status']>('All');
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const seedOrders = (): Order[] => [
    { id: '1001', customer: 'Ava K', items: [{ name: 'Paracetamol 500mg', qty: 2 }, { name: 'Vitamin C 1000mg', qty: 1 }], total: 12.98, status: 'Pending', createdAt: Date.now() - 1000 * 60 * 60 * 2 },
    { id: '1002', customer: 'Maya R', items: [{ name: 'Ibuprofen 200mg', qty: 1 }], total: 3.99, status: 'Processing', createdAt: Date.now() - 1000 * 60 * 60 * 4 },
    { id: '1003', customer: 'Nora S', items: [{ name: 'Cough Syrup 100ml', qty: 1 }], total: 5.5, status: 'Ready', createdAt: Date.now() - 1000 * 60 * 60 * 24 },
    { id: '1004', customer: 'Emma T', items: [{ name: 'Antacid Tablets', qty: 3 }], total: 12.75, status: 'Completed', createdAt: Date.now() - 1000 * 60 * 60 * 36 },
  ];

  const load = async () => {
    const auth = JSON.parse((await AsyncStorage.getItem('pharmacy_auth')) || 'null');
    const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
    const s = stores.find((x: any) => x.id === auth?.storeId);
    if (!s) return;
    if (!s.orders || s.orders.length === 0) {
      s.orders = seedOrders();
      const idx = stores.findIndex((x: any) => x.id === s.id);
      stores[idx] = s;
      await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
      setStore(s);
      setOrders(s.orders);
      return;
    }
    setStore(s);
    setOrders(s.orders || []);
  };

  const saveStatus = async (orderId: string, status: Order['status']) => {
    const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
    const idx = stores.findIndex((x: any) => x.id === store.id);
    if (idx >= 0) {
      stores[idx].orders = (stores[idx].orders || []).map((o: Order) => o.id === orderId ? { ...o, status } : o);
      await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
      setOrders(stores[idx].orders);
    }
  };

  const filtered = orders.filter(o => filter === 'All' ? true : o.status === filter);

  const OrderItem = ({ item }: { item: Order }) => (
    <View style={styles.order}>
      <View style={{ flex: 1 }}>
        <Text style={styles.orderTitle}>#{item.id} • {item.customer}</Text>
        <Text style={styles.orderMeta}>{item.items.length} items • ${item.total.toFixed(2)}</Text>
        <Text style={styles.orderMeta}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <View style={styles.statusRow}>
        {(['Pending','Processing','Ready','Completed','Cancelled'] as Order['status'][]).map(s => (
          <TouchableOpacity key={s} style={[styles.statusPill, item.status === s && styles.statusPillActive]} onPress={() => saveStatus(item.id, s)}>
            <Text style={[styles.statusText, item.status === s && styles.statusTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.filtersRow}>
          {(['All','Pending','Processing','Ready','Completed','Cancelled'] as const).map(f => (
            <TouchableOpacity key={f} style={[styles.filterPill, filter === f && styles.filterPillActive]} onPress={() => setFilter(f as any)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={OrderItem}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F3F4F6' },
  filterPillActive: { backgroundColor: '#7C3AED' },
  filterText: { fontSize: 12, color: '#374151', fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  order: { backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  orderTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  orderMeta: { fontSize: 12, color: '#6B7280' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#EEF2FF' },
  statusPillActive: { backgroundColor: '#7C3AED' },
  statusText: { fontSize: 11, color: '#374151', fontWeight: '600' },
  statusTextActive: { color: '#fff' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});