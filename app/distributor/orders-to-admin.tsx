import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Simple in-device dynamic store keys
const ORDERS_KEY = 'distributor_orders_to_admin';

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  notes?: string;
}

interface AdminOrder {
  id: string;
  createdAt: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Fulfilled';
  items: OrderItem[];
}

async function loadOrders(): Promise<AdminOrder[]> {
  const raw = await AsyncStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveOrders(orders: AdminOrder[]) {
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function newOrder(): AdminOrder {
  return { id: `AO-${Date.now()}`, createdAt: Date.now(), status: 'Draft', items: [] };
}

export default function OrdersToAdmin() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('1');

  useEffect(() => {
    (async () => {
      const stored = await loadOrders();
      if (stored.length === 0) {
        const initial = [newOrder()];
        setOrders(initial);
        setActiveOrderId(initial[0].id);
        await saveOrders(initial);
      } else {
        setOrders(stored);
        setActiveOrderId(stored[0]?.id || null);
      }
    })();
  }, []);

  const activeOrder = useMemo(() => orders.find(o => o.id === activeOrderId) || null, [orders, activeOrderId]);

  const filteredItems = useMemo(() => {
    if (!activeOrder) return [];
    if (!search) return activeOrder.items;
    const s = search.toLowerCase();
    return activeOrder.items.filter(i => i.name.toLowerCase().includes(s));
  }, [activeOrder, search]);

  const addOrder = async () => {
    const o = newOrder();
    const next = [o, ...orders];
    setOrders(next);
    setActiveOrderId(o.id);
    await saveOrders(next);
  };

  const addItem = async () => {
    if (!activeOrder) return;
    const qty = Math.max(1, parseInt(itemQty || '1', 10) || 1);
    if (!itemName.trim()) return;
    const item: OrderItem = { id: `${Date.now()}`, name: itemName.trim(), qty };
    const next = orders.map(o => o.id === activeOrder.id ? { ...o, items: [item, ...o.items] } : o);
    setOrders(next);
    await saveOrders(next);
    setItemName('');
    setItemQty('1');
  };

  const submitOrder = async () => {
    if (!activeOrder) return;
    if (activeOrder.items.length === 0) {
      Alert.alert('Empty order', 'Add at least one item before submitting.');
      return;
    }
    const next = orders.map(o => o.id === activeOrder.id ? { ...o, status: 'Submitted' } : o);
    setOrders(next);
    await saveOrders(next);
    Alert.alert('Order submitted', 'Your order was submitted to Admin.');
  };

  const updateStatus = async (status: AdminOrder['status']) => {
    if (!activeOrder) return;
    const next = orders.map(o => o.id === activeOrder.id ? { ...o, status } : o);
    setOrders(next);
    await saveOrders(next);
  };

  const removeItem = async (id: string) => {
    if (!activeOrder) return;
    const next = orders.map(o => o.id === activeOrder.id ? { ...o, items: o.items.filter(i => i.id !== id) } : o);
    setOrders(next);
    await saveOrders(next);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders to Admin</Text>
        <TouchableOpacity onPress={addOrder}>
          <Feather name="plus" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Orders Switcher */}
      <FlatList
        horizontal
        data={orders}
        keyExtractor={o => o.id}
        contentContainerStyle={styles.orderTabs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.orderTab, activeOrderId === item.id && styles.orderTabActive]}
            onPress={() => setActiveOrderId(item.id)}
          >
            <Text style={[styles.orderTabText, activeOrderId === item.id && styles.orderTabTextActive]}
            >{item.id} · {item.status}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Item adder */}
      <View style={styles.itemAdder}>
        <TextInput
          style={styles.input}
          placeholder="Medicine/Product name"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          style={[styles.input, { width: 80 }]}
          placeholder="Qty"
          keyboardType="number-pad"
          value={itemQty}
          onChangeText={setItemQty}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addItem}>
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Feather name="search" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items in this order"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Items list */}
      <FlatList
        data={filteredItems}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>Qty: {item.qty}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Feather name="trash-2" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#FBBF24' }]} onPress={() => updateStatus('Draft')}>
          <Text style={styles.statusBtnText}>Mark Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#60A5FA' }]} onPress={submitOrder}>
          <Text style={styles.statusBtnText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  orderTabs: { paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  orderTab: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8 },
  orderTabActive: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  orderTabText: { color: '#374151', fontWeight: '600' },
  orderTabTextActive: { color: '#4F46E5' },
  itemAdder: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  input: { flex: 1, height: 44, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12 },
  addBtn: { height: 44, borderRadius: 10, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, flexDirection: 'row', gap: 6 },
  addBtnText: { color: '#fff', fontWeight: '700' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', marginHorizontal: 16, paddingHorizontal: 10, marginBottom: 8 },
  searchInput: { flex: 1, height: 44, paddingHorizontal: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, marginTop: 8 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  itemMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff' },
  statusBtn: { flex: 1, marginHorizontal: 6, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statusBtnText: { color: '#fff', fontWeight: '800' },
});