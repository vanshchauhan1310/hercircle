import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PHARMACY_KEY = 'admin_pharmacies';

interface Pharmacy {
  id: string;
  name: string;
  owner: string;
  city?: string;
  phone?: string;
}

async function loadPharmacies(): Promise<Pharmacy[]> {
  const raw = await AsyncStorage.getItem(PHARMACY_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function savePharmacies(items: Pharmacy[]) {
  await AsyncStorage.setItem(PHARMACY_KEY, JSON.stringify(items));
}

export default function ManagePharmaciesScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Pharmacy[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Pharmacy | null>(null);
  const [form, setForm] = useState({ name: '', owner: '', city: '', phone: '' });

  useEffect(() => {
    (async () => setItems(await loadPharmacies()))();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(i =>
      i.name.toLowerCase().includes(s) ||
      i.owner.toLowerCase().includes(s) ||
      i.city?.toLowerCase().includes(s) ||
      i.phone?.toLowerCase().includes(s)
    );
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', owner: '', city: '', phone: '' });
    setModalVisible(true);
  };

  const openEdit = (it: Pharmacy) => {
    setEditing(it);
    setForm({ name: it.name, owner: it.owner, city: it.city || '', phone: it.phone || '' });
    setModalVisible(true);
  };

  const remove = async (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    await savePharmacies(next);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.owner.trim()) {
      Alert.alert('Missing fields', 'Name and Owner are required.');
      return;
    }
    if (editing) {
      const next = items.map(i => i.id === editing.id ? { ...i, ...form, name: form.name.trim(), owner: form.owner.trim(), city: form.city.trim() || undefined, phone: form.phone.trim() || undefined } : i);
      setItems(next);
      await savePharmacies(next);
    } else {
      const it: Pharmacy = { id: `${Date.now()}`, name: form.name.trim(), owner: form.owner.trim(), city: form.city.trim() || undefined, phone: form.phone.trim() || undefined };
      const next = [it, ...items];
      setItems(next);
      await savePharmacies(next);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Pharmacies</Text>
        <TouchableOpacity onPress={openCreate}>
          <Feather name="plus" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pharmacies..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => openEdit(item)}>
            <Feather name="home" size={24} color={Colors.light.primary} />
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text style={styles.listItemSubtitle}>Owner: {item.owner} · {item.city || '—'} · {item.phone || '—'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Pharmacy' : 'Add Pharmacy'}</Text>
            <TextInput style={styles.modalInput} placeholder="Pharmacy Name" value={form.name} onChangeText={v => setForm({ ...form, name: v })} />
            <TextInput style={styles.modalInput} placeholder="Owner Name" value={form.owner} onChangeText={v => setForm({ ...form, owner: v })} />
            <TextInput style={styles.modalInput} placeholder="City" value={form.city} onChangeText={v => setForm({ ...form, city: v })} />
            <TextInput style={styles.modalInput} placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={v => setForm({ ...form, phone: v })} />

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
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: Colors.light.surface, borderBottomWidth: 1, borderBottomColor: Colors.light.background },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.light.textPrimary },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 12, margin: 15, paddingHorizontal: 15 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16 },
  list: { paddingHorizontal: 15 },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 12, padding: 20, marginBottom: 10 },
  listItemContent: { flex: 1, marginLeft: 15 },
  listItemTitle: { fontSize: 16, fontWeight: '600', color: Colors.light.textPrimary },
  listItemSubtitle: { fontSize: 14, color: Colors.light.textSecondary, marginTop: 4 },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, gap: 8 },
  modalTitle: { fontSize: 16, fontWeight: '800', marginBottom: 4 },
  modalInput: { height: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12 },
  modalActions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  actionBtn: { height: 44, borderRadius: 10, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  actionText: { color: '#fff', fontWeight: '800' },
});