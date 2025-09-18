import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  reorderLevel: number;
  category: string;
}

export default function InventoryScreen() {
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});

  useEffect(() => {
    load();
  }, []);

  const seedInventory = (): Product[] => {
    return [
      { id: Date.now().toString() + '-1', name: 'Paracetamol 500mg', sku: 'PARA500', price: 2.49, stock: 120, reorderLevel: 20, category: 'Analgesic' },
      { id: Date.now().toString() + '-2', name: 'Ibuprofen 200mg', sku: 'IBU200', price: 3.99, stock: 60, reorderLevel: 15, category: 'NSAID' },
      { id: Date.now().toString() + '-3', name: 'Cough Syrup 100ml', sku: 'COUGH100', price: 5.5, stock: 25, reorderLevel: 10, category: 'Cold & Flu' },
      { id: Date.now().toString() + '-4', name: 'Antacid Tablets', sku: 'ANTACID', price: 4.25, stock: 0, reorderLevel: 10, category: 'Digestive' },
      { id: Date.now().toString() + '-5', name: 'Vitamin C 1000mg', sku: 'VITC1000', price: 8.0, stock: 200, reorderLevel: 30, category: 'Supplements' },
    ];
  };

  const load = async () => {
    const auth = JSON.parse((await AsyncStorage.getItem('pharmacy_auth')) || 'null');
    const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
    const s = stores.find((x: any) => x.id === auth?.storeId);
    if (!s) return;
    if (!s.inventory || s.inventory.length === 0) {
      const seeded = seedInventory();
      s.inventory = seeded;
      const idx = stores.findIndex((x: any) => x.id === s.id);
      stores[idx] = s;
      await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
      setStore(s);
      setProducts(seeded);
      return;
    }
    setStore(s);
    setProducts(s.inventory || []);
  };

  const save = async (updatedProducts: Product[]) => {
    const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
    const idx = stores.findIndex((x: any) => x.id === store.id);
    if (idx >= 0) {
      stores[idx].inventory = updatedProducts;
      await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
      setProducts(updatedProducts);
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', sku: '', price: 0, stock: 0, reorderLevel: 5, category: '' });
    setModalVisible(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setModalVisible(true);
  };

  const remove = (id: string) => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const updated = products.filter(p => p.id !== id);
        await save(updated);
      } }
    ]);
  };

  const submit = async () => {
    if (!form.name || !form.sku) {
      Alert.alert('Missing info', 'Please provide product name and SKU.');
      return;
    }
    const updated = [...products];
    if (editing) {
      const idx = updated.findIndex(p => p.id === editing.id);
      if (idx >= 0) updated[idx] = { ...(editing as Product), ...(form as Product) } as Product;
    } else {
      updated.unshift({
        id: Date.now().toString(),
        name: form.name as string,
        sku: form.sku as string,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        reorderLevel: Number(form.reorderLevel || 5),
        category: (form.category as string) || 'General',
      });
    }
    await save(updated);
    setModalVisible(false);
  };

  const Item = ({ item }: { item: Product }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>SKU {item.sku} • {item.category}</Text>
        <Text style={styles.itemMeta}>${item.price.toFixed(2)} • Stock {item.stock}</Text>
      </View>
      <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
        <Ionicons name="create-outline" size={18} color="#111827" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]} onPress={() => remove(item.id)}>
        <Ionicons name="trash-outline" size={18} color="#DC2626" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventory</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openNew}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addText}>New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(i) => i.id}
        renderItem={Item}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Product' : 'Add Product'}</Text>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#9CA3AF" value={form.name as string} onChangeText={(v) => setForm({ ...form, name: v })} />
            <TextInput style={styles.input} placeholder="SKU" placeholderTextColor="#9CA3AF" value={form.sku as string} onChangeText={(v) => setForm({ ...form, sku: v })} />
            <TextInput style={styles.input} placeholder="Category" placeholderTextColor="#9CA3AF" value={form.category as string} onChangeText={(v) => setForm({ ...form, category: v })} />
            <TextInput style={styles.input} placeholder="Price" placeholderTextColor="#9CA3AF" keyboardType="decimal-pad" value={String(form.price ?? '')} onChangeText={(v) => setForm({ ...form, price: Number(v || 0) })} />
            <TextInput style={styles.input} placeholder="Stock" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={String(form.stock ?? '')} onChangeText={(v) => setForm({ ...form, stock: Number(v || 0) })} />
            <TextInput style={styles.input} placeholder="Reorder Level" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={String(form.reorderLevel ?? '')} onChangeText={(v) => setForm({ ...form, reorderLevel: Number(v || 0) })} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={submit}>
                <Text style={styles.saveText}>{editing ? 'Save' : 'Add'}</Text>
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
  header: { paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7C3AED', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  addText: { color: '#fff', fontWeight: '700' },
  item: { backgroundColor: '#fff', padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  itemMeta: { fontSize: 12, color: '#6B7280' },
  iconBtn: { backgroundColor: '#EEF2FF', padding: 8, borderRadius: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  input: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, color: '#111827' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 6 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#F3F4F6' },
  cancelText: { color: '#374151', fontWeight: '700' },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#7C3AED' },
  saveText: { color: '#fff', fontWeight: '700' },
});