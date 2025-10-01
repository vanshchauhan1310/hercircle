import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATALOG_KEY = 'global_product_catalog';

interface Product { id: string; name: string; category: string; price: number; moq?: number; brand?: string; }

async function loadProducts(): Promise<Product[]> {
  const raw = await AsyncStorage.getItem(CATALOG_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveProducts(items: Product[]) {
  await AsyncStorage.setItem(CATALOG_KEY, JSON.stringify(items));
}

export default function ManageProductsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', category: '', price: '0', moq: '0', brand: '' });

  useEffect(() => { (async () => setItems(await loadProducts()))(); }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(s) || i.category.toLowerCase().includes(s) || (i.brand||'').toLowerCase().includes(s));
  }, [items, search]);

  const openCreate = () => { setEditing(null); setForm({ name: '', category: '', price: '0', moq: '0', brand: '' }); setModalVisible(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, category: p.category, price: String(p.price), moq: String(p.moq || 0), brand: p.brand || '' }); setModalVisible(true); };

  const remove = async (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    await saveProducts(next);
  };

  const submit = async () => {
    if (!form.name.trim()) return;
    const price = Math.max(0, parseFloat(form.price || '0') || 0);
    const moq = Math.max(0, parseInt(form.moq || '0', 10) || 0);
    if (editing) {
      const next = items.map(i => i.id === editing.id ? { ...i, name: form.name.trim(), category: form.category.trim(), price, moq, brand: form.brand.trim() || undefined } : i);
      setItems(next);
      await saveProducts(next);
    } else {
      const it: Product = { id: `${Date.now()}`, name: form.name.trim(), category: form.category.trim(), price, moq, brand: form.brand.trim() || undefined };
      const next = [it, ...items];
      setItems(next);
      await saveProducts(next);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Products</Text>
        <TouchableOpacity onPress={openCreate}>
          <Feather name="plus" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color={Colors.light.textSecondary} />
        <TextInput style={styles.searchInput} placeholder="Search products" value={search} onChangeText={setSearch} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => openEdit(item)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text style={styles.listItemSubtitle}>{item.category} · ${item.price.toFixed(2)}{item.brand ? ` · ${item.brand}` : ''}</Text>
            </View>
            <Text style={styles.moqText}>MOQ: {item.moq ?? 0}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Product' : 'Add Product'}</Text>
            <TextInput style={styles.modalInput} placeholder="Name" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
            <TextInput style={styles.modalInput} placeholder="Category" value={form.category} onChangeText={v => setForm({ ...form, category: v })} />
            <TextInput style={styles.modalInput} placeholder="Brand" value={form.brand} onChangeText={v => setForm({ ...form, brand: v })} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={[styles.modalInput, { flex: 1 }]} placeholder="Price" keyboardType="decimal-pad" value={form.price} onChangeText={v => setForm({ ...form, price: v })} />
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
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 12, marginHorizontal: 15, marginTop: 12, paddingHorizontal: 12 },
  searchInput: { flex: 1, height: 48, fontSize: 16 },
  list: {
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  moqText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, gap: 8 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  modalInput: { height: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12 },
  modalActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  actionBtn: { height: 44, borderRadius: 10, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  actionText: { color: '#fff', fontWeight: '800' },
});