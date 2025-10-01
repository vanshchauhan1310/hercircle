import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STOCK_KEY = 'distributor_stock_items';

interface StockItem {
  id: string;
  name: string;
  sku?: string;
  qty: number;
  moq?: number;
}

async function loadStock(): Promise<StockItem[]> {
  const raw = await AsyncStorage.getItem(STOCK_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveStock(items: StockItem[]) {
  await AsyncStorage.setItem(STOCK_KEY, JSON.stringify(items));
}

export default function DistributorStock() {
  const router = useRouter();
  const [items, setItems] = useState<StockItem[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<StockItem | null>(null);
  const [form, setForm] = useState({ name: '', sku: '', qty: '0', moq: '0' });

  useEffect(() => {
    (async () => setItems(await loadStock()))();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(s) || i.sku?.toLowerCase().includes(s));
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', sku: '', qty: '0', moq: '0' });
    setModalVisible(true);
  };

  const openEdit = (it: StockItem) => {
    setEditing(it);
    setForm({ name: it.name, sku: it.sku || '', qty: String(it.qty), moq: String(it.moq || 0) });
    setModalVisible(true);
  };

  const remove = async (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    await saveStock(next);
  };

  const submit = async () => {
    const qty = Math.max(0, parseInt(form.qty || '0', 10) || 0);
    const moq = Math.max(0, parseInt(form.moq || '0', 10) || 0);
    if (!form.name.trim()) {
      Alert.alert('Name required', 'Enter a product name.');
      return;
    }
    if (editing) {
      const next = items.map(i => i.id === editing.id ? { ...i, name: form.name.trim(), sku: form.sku.trim() || undefined, qty, moq } : i);
      setItems(next);
      await saveStock(next);
    } else {
      const it: StockItem = { id: `${Date.now()}`, name: form.name.trim(), sku: form.sku.trim() || undefined, qty, moq };
      const next = [it, ...items];
      setItems(next);
      await saveStock(next);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Stock</Text>
        <TouchableOpacity onPress={openCreate}>
          <Feather name="plus" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stock items"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemRow} onPress={() => openEdit(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>SKU: {item.sku || '-'} · MOQ: {item.moq ?? 0}</Text>
            </View>
            <Text style={styles.qtyBadge}>Qty: {item.qty}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Item' : 'Add Item'}</Text>
            <TextInput style={styles.modalInput} placeholder="Name" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
            <TextInput style={styles.modalInput} placeholder="SKU" value={form.sku} onChangeText={v => setForm({ ...form, sku: v })} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="Qty" keyboardType="number-pad" value={form.qty} onChangeText={v => setForm({ ...form, qty: v })} />
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="MOQ" keyboardType="number-pad" value={form.moq} onChangeText={v => setForm({ ...form, moq: v })} />
            </View>

            <View style={styles.modalActions}>
              {editing && (
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EF4444' }]} onPress={() => { setModalVisible(false); remove(editing.id); }}>
                  <Feather name="trash-2" color="#fff" size={16} />
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#6B7280' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4F46E5' }]} onPress={submit}>
                <Text style={styles.actionText}>{editing ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', margin: 16, paddingHorizontal: 10 },
  searchInput: { flex: 1, height: 44, paddingHorizontal: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 12, marginHorizontal: 16, marginTop: 8 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  itemMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  qtyBadge: { fontSize: 12, fontWeight: '800', color: '#1F2937', backgroundColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, gap: 8 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  modalInput: { height: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12 },
  modalActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  actionBtn: { height: 44, borderRadius: 10, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  actionText: { color: '#fff', fontWeight: '800' },
});