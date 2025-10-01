import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
/* Charts temporarily disabled due to library incompatibility */

const mockData = {
  stats: [
    { title: 'Total Revenue', value: '$1.25M', icon: 'dollar-sign' },
    { title: 'Total Orders', value: '8.3K', icon: 'package' },
    { title: 'Distributors', value: '42', icon: 'truck' },
    { title: 'Pharmacies', value: '1.2K', icon: 'home' },
  ],
  recentOrders: [
    { id: 'ORD-001', distributor: 'HealthSupply Co.', amount: '$5,400', status: 'Shipped' },
    { id: 'ORD-002', distributor: 'MediWholesale', amount: '$12,800', status: 'Processing' },
  ],
  revenueData: [
    { value: 50, label: 'Jan' },
    { value: 75, label: 'Feb' },
    { value: 100, label: 'Mar' },
    { value: 80, label: 'Apr' },
    { value: 120, label: 'May' },
    { value: 110, label: 'Jun' },
  ],
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [pendingDistributors, setPendingDistributors] = useState<any[]>([]);
  const [pendingPharmacies, setPendingPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    try {
      const pd = JSON.parse((await AsyncStorage.getItem('admin_pending_distributors')) || '[]');
      const pp = JSON.parse((await AsyncStorage.getItem('admin_pending_pharmacies')) || '[]');
      setPendingDistributors(pd);
      setPendingPharmacies(pp);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const approveDistributor = async (item: any) => {
    const pd = pendingDistributors.filter((d) => d.id !== item.id);
    const approved = JSON.parse((await AsyncStorage.getItem('admin_distributors')) || '[]');
    approved.unshift({ id: item.id, name: item.name, location: item.location || '', email: item.email || '', phone: item.phone || '' });
    await AsyncStorage.setItem('admin_distributors', JSON.stringify(approved));
    await AsyncStorage.setItem('admin_pending_distributors', JSON.stringify(pd));
    setPendingDistributors(pd);
  };

  const rejectDistributor = async (item: any) => {
    const pd = pendingDistributors.filter((d) => d.id !== item.id);
    await AsyncStorage.setItem('admin_pending_distributors', JSON.stringify(pd));
    setPendingDistributors(pd);
  };

  const approvePharmacy = async (item: any) => {
    const pp = pendingPharmacies.filter((p) => p.id !== item.id);
    const approved = JSON.parse((await AsyncStorage.getItem('admin_pharmacies')) || '[]');
    approved.unshift({ id: item.id, name: item.name, owner: item.owner, city: item.city || '', phone: item.phone || '' });
    await AsyncStorage.setItem('admin_pharmacies', JSON.stringify(approved));

    // Ensure a store exists for this pharmacy
    const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
    const exists = stores.find((s: any) => (s.owner || '').toLowerCase() === (item.owner || '').toLowerCase());
    if (!exists) {
      stores.unshift({ id: `${Date.now()}`, name: item.name, owner: item.owner, city: item.city || '', phone: item.phone || '', inventory: [] });
      await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
    }

    await AsyncStorage.setItem('admin_pending_pharmacies', JSON.stringify(pp));
    setPendingPharmacies(pp);
  };

  const rejectPharmacy = async (item: any) => {
    const pp = pendingPharmacies.filter((p) => p.id !== item.id);
    await AsyncStorage.setItem('admin_pending_pharmacies', JSON.stringify(pp));
    setPendingPharmacies(pp);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Overview</Text>
        <TouchableOpacity onPress={logout}>
          <Feather name="log-out" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          {mockData.stats.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <Feather name={item.icon as any} size={22} color={Colors.light.primary} />
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statTitle}>{item.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Monthly Revenue</Text>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            {mockData.revenueData.map((d, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <View style={{ height: d.value * 1.2, width: 20, backgroundColor: Colors.light.primaryMuted, borderRadius: 4 }} />
                <Text style={{ marginTop: 6, color: Colors.light.textSecondary, fontSize: 12 }}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Approval Requests */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Approval Requests</Text>

          <Text style={{ fontWeight: '700', marginBottom: 10, color: Colors.light.textPrimary }}>Distributors</Text>
          {pendingDistributors.length === 0 ? (
            <Text style={{ color: Colors.light.textSecondary, marginBottom: 10 }}>No pending distributor requests</Text>
          ) : pendingDistributors.map((d) => (
            <View key={d.id} style={styles.approvalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemTitle}>{d.name}</Text>
                <Text style={styles.listItemSubtitle}>{d.email || '—'} · {d.phone || '—'} · {d.location || '—'}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: Colors.light.success }]} onPress={() => approveDistributor(d)}>
                  <Feather name="check" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#EF4444' }]} onPress={() => rejectDistributor(d)}>
                  <Feather name="x" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={{ fontWeight: '700', marginTop: 16, marginBottom: 10, color: Colors.light.textPrimary }}>Pharmacies</Text>
          {pendingPharmacies.length === 0 ? (
            <Text style={{ color: Colors.light.textSecondary }}>No pending pharmacy requests</Text>
          ) : pendingPharmacies.map((p) => (
            <View key={p.id} style={styles.approvalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemTitle}>{p.name}</Text>
                <Text style={styles.listItemSubtitle}>{p.owner || '—'} · {p.phone || '—'} · {p.city || '—'}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: Colors.light.success }]} onPress={() => approvePharmacy(p)}>
                  <Feather name="check" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#EF4444' }]} onPress={() => rejectPharmacy(p)}>
                  <Feather name="x" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Management</Text>
          <TouchableOpacity style={styles.managementButton} onPress={() => router.push('/admin/management/distributors')}>
            <Feather name="truck" size={22} color={Colors.light.primary} />
            <Text style={styles.managementButtonText}>Manage Distributors</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.managementButton} onPress={() => router.push('/admin/management/pharmacies')}>
            <Feather name="home" size={22} color={Colors.light.primary} />
            <Text style={styles.managementButtonText}>Manage Pharmacies</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.managementButton} onPress={() => router.push('/admin/management/products')}>
            <Feather name="box" size={22} color={Colors.light.primary} />
            <Text style={styles.managementButtonText}>Manage Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.managementButton} onPress={() => router.push('/admin/management/orders')}>
            <Feather name="file-text" size={22} color={Colors.light.primary} />
            <Text style={styles.managementButtonText}>Manage Orders</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  content: {
    padding: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  chartCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    height: 300,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 15,
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.background,
  },
  managementButtonText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  approvalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.background,
  },
  smallBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  listItemSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
