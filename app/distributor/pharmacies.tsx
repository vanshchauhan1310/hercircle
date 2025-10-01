import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Pharmacy {
  id: string;
  name: string;
  owner: string;
  city?: string;
  phone?: string;
}

export default function DistributorPharmacies() {
  const router = useRouter();
  const [items, setItems] = useState<Pharmacy[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = JSON.parse((await AsyncStorage.getItem('admin_pharmacies')) || '[]');
        setItems(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter((p) =>
      p.name.toLowerCase().includes(s) ||
      (p.owner || '').toLowerCase().includes(s) ||
      (p.city || '').toLowerCase().includes(s) ||
      (p.phone || '').toLowerCase().includes(s)
    );
  }, [items, search]);

  const Row = ({ item }: { item: Pharmacy }) => (
    <TouchableOpacity style={styles.row} onPress={() => setSelected(item)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.owner || '—'} · {item.city || '—'} · {item.phone || '—'}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={Colors.light.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pharmacies</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchRow}>
        <Feather name="search" size={18} color={Colors.light.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, owner, city or phone"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={!loading ? (
          <View style={styles.empty}>
            <Feather name="home" size={28} color={Colors.light.textSecondary} />
            <Text style={{ color: Colors.light.textSecondary, marginTop: 8 }}>No pharmacies found</Text>
          </View>
        ) : null}
        renderItem={({ item }) => <Row item={item} />}
      />

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.modalTitle}>Pharmacy Details</Text>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Feather name="x" size={20} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{selected?.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Owner</Text>
              <Text style={styles.detailValue}>{selected?.owner || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>City</Text>
              <Text style={styles.detailValue}>{selected?.city || '—'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{selected?.phone || '—'}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.light.primary }]} onPress={() => setSelected(null)}>
                <Feather name="message-circle" size={16} color="#fff" />
                <Text style={styles.actionText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.light.primaryMuted }]} onPress={() => setSelected(null)}>
                <Feather name="list" size={16} color="#fff" />
                <Text style={styles.actionText}>View Orders</Text>
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
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: Colors.light.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.light.background },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.textPrimary },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 12, margin: 16, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.light.background },
  searchInput: { flex: 1, height: 44, marginLeft: 8 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: Colors.light.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.light.background, marginTop: 8 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.light.textPrimary },
  subtitle: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 4 },
  empty: { alignItems: 'center', padding: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 16, justifyContent: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: Colors.light.textPrimary, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.light.background },
  detailLabel: { fontSize: 12, color: Colors.light.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '700', color: Colors.light.textPrimary },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  actionText: { color: '#fff', fontWeight: '800' },
});