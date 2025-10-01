import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Distributor { id: string; name: string; email?: string; location?: string; phone?: string }
interface Pharmacy { id: string; name: string; owner: string; city?: string; phone?: string }

type MapRecord = Record<string, string[]>; // key: distributorEmailOrId(lowercase) -> [pharmacyId]

const DIST_KEY = 'admin_distributors';
const PHARM_KEY = 'admin_pharmacies';
const MAP_KEY = 'admin_distributor_pharmacy_map';

export default function MappingScreen() {
  const router = useRouter();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [map, setMap] = useState<MapRecord>({});

  const [selectedDist, setSelectedDist] = useState<Distributor | null>(null);
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const dRaw = JSON.parse((await AsyncStorage.getItem(DIST_KEY)) || '[]');
      const pRaw = JSON.parse((await AsyncStorage.getItem(PHARM_KEY)) || '[]');
      const mRaw = JSON.parse((await AsyncStorage.getItem(MAP_KEY)) || '{}');
      setDistributors(dRaw);
      setPharmacies(pRaw);
      setMap(mRaw);
    })();
  }, []);

  const filteredPharmacies = useMemo(() => {
    if (!search) return pharmacies;
    const s = search.toLowerCase();
    return pharmacies.filter(p => p.name.toLowerCase().includes(s) || (p.owner||'').toLowerCase().includes(s) || (p.city||'').toLowerCase().includes(s));
  }, [pharmacies, search]);

  const keyFor = (d: Distributor) => (d.email ? d.email.toLowerCase() : d.id);

  const openForDistributor = (d: Distributor) => {
    setSelectedDist(d);
    const k = keyFor(d);
    const assigned = new Set<string>((map[k] || []) as string[]);
    setSelectedSet(assigned);
  };

  const togglePharmacy = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedSet(next);
  };

  const saveMapping = async () => {
    if (!selectedDist) return;
    const k = keyFor(selectedDist);
    const nextMap: MapRecord = { ...map, [k]: Array.from(selectedSet) };
    setMap(nextMap);
    await AsyncStorage.setItem(MAP_KEY, JSON.stringify(nextMap));
    setSelectedDist(null);
  };

  const assignedCount = (d: Distributor) => {
    const k = keyFor(d);
    return (map[k] || []).length;
  };

  const DistRow = ({ item }: { item: Distributor }) => (
    <TouchableOpacity style={styles.row} onPress={() => openForDistributor(item)}>
      <Feather name="truck" size={20} color={Colors.light.primary} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.email || '—'} · {item.location || '—'} · {item.phone || '—'}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{assignedCount(item)}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={Colors.light.textSecondary} />
    </TouchableOpacity>
  );

  const PharmRow = ({ item }: { item: Pharmacy }) => {
    const checked = selectedSet.has(item.id);
    return (
      <TouchableOpacity style={styles.pharmRow} onPress={() => togglePharmacy(item.id)}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>{checked && <Feather name="check" size={14} color="#fff" />}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.owner || '—'} · {item.city || '—'} · {item.phone || '—'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Distributor-Pharmacy Mapping</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={distributors}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => <DistRow item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}> 
            <Feather name="truck" size={28} color={Colors.light.textSecondary} />
            <Text style={{ color: Colors.light.textSecondary, marginTop: 8 }}>No distributors found</Text>
          </View>
        }
      />

      <Modal visible={!!selectedDist} transparent animationType="slide" onRequestClose={() => setSelectedDist(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.modalTitle}>Assign Pharmacies</Text>
              <TouchableOpacity onPress={() => setSelectedDist(null)}>
                <Feather name="x" size={20} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: Colors.light.textSecondary, marginBottom: 8 }}>Distributor: {selectedDist?.name}</Text>
            <View style={styles.searchRow}>
              <Feather name="search" size={18} color={Colors.light.textSecondary} />
              <TextInput style={styles.searchInput} placeholder="Search pharmacies" value={search} onChangeText={setSearch} />
            </View>

            <FlatList
              data={filteredPharmacies}
              keyExtractor={(i) => i.id}
              ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
              renderItem={({ item }) => <PharmRow item={item} />}
              style={{ maxHeight: 360, marginTop: 8 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#6B7280' }]} onPress={() => setSelectedDist(null)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: Colors.light.primary }]} onPress={saveMapping}>
                <Feather name="save" size={16} color="#fff" />
                <Text style={styles.btnText}>Save</Text>
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
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.light.background, padding: 14 },
  title: { fontSize: 14, fontWeight: '700', color: Colors.light.textPrimary },
  subtitle: { fontSize: 12, color: Colors.light.textSecondary, marginTop: 2 },
  badge: { backgroundColor: Colors.light.primaryMuted, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8 },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  empty: { alignItems: 'center', padding: 24 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 16, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: Colors.light.textPrimary, marginBottom: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 10, borderWidth: 1, borderColor: Colors.light.background, paddingHorizontal: 10 },
  searchInput: { flex: 1, height: 44, marginLeft: 8 },
  pharmRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: 10, borderWidth: 1, borderColor: Colors.light.background, padding: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1, borderColor: Colors.light.primaryMuted, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: Colors.light.primaryMuted, borderColor: Colors.light.primaryMuted },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '800' },
});
