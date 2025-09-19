import { useAuth } from '@/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const mockData = {
  stats: [
    { id: '1', title: 'Total Revenue', value: '$1,250,450', icon: 'dollar-sign', color: '#10B981' },
    { id: '2', title: 'Total Orders', value: '8,320', icon: 'package', color: '#3B82F6' },
    { id: '3', title: 'Distributors', value: '42', icon: 'truck', color: '#F97316' },
    { id: '4', title: 'Pharmacies', value: '1,280', icon: 'home', color: '#8B5CF6' },
  ],
  recentOrders: [
    { id: 'ORD-001', distributor: 'HealthSupply Co.', amount: '$5,400', status: 'Shipped' },
    { id: 'ORD-002', distributor: 'MediWholesale', amount: '$12,800', status: 'Processing' },
    { id: 'ORD-003', distributor: 'PharmaDirect', amount: '$8,250', status: 'Delivered' },
  ],
  topProducts: [
    { id: 'PROD-A1', name: 'Product A', sales: '12,500 units' },
    { id: 'PROD-B2', name: 'Product B', sales: '9,800 units' },
    { id: 'PROD-C3', name: 'Product C', sales: '7,200 units' },
  ],
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  const StatCard = ({ item }: { item: typeof mockData.stats[0] }) => (
    <View style={[styles.statCard, { backgroundColor: item.color }]}>
      <Feather name={item.icon as any} size={24} color="#fff" />
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          {mockData.stats.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.managementGrid}>
            <TouchableOpacity
              style={styles.managementButton}
              onPress={() => router.push('/admin/management/distributors')}>
              <Feather name="truck" size={28} color="#3B82F6" />
              <Text style={styles.managementButtonText}>Distributors</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.managementButton}
              onPress={() => router.push('/admin/management/products')}>
              <Feather name="box" size={28} color="#F97316" />
              <Text style={styles.managementButtonText}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.managementButton}
              onPress={() => router.push('/admin/management/orders')}>
              <Feather name="file-text" size={28} color="#8B5CF6" />
              <Text style={styles.managementButtonText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.managementButton}>
              <Feather name="home" size={28} color="#10B981" />
              <Text style={styles.managementButtonText}>Pharmacies</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <FlatList
            data={mockData.recentOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.listItemTitle}>{item.id}</Text>
                  <Text style={styles.listItemSubtitle}>{item.distributor}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.listItemTitle}>{item.amount}</Text>
                  <Text style={styles.listItemSubtitle}>{item.status}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  managementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  managementButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  managementButtonText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#374151',
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});
