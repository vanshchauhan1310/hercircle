import { useAuth } from '@/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    { id: '1', title: 'Pending Orders', value: '28', icon: 'clock', color: '#F97316' },
    { id: '2', title: 'Completed Orders', value: '1,240', icon: 'check-circle', color: '#10B981' },
    { id: '3', title: 'Pharmacies', value: '42', icon: 'home', color: '#3B82F6' },
    { id: '4', title: 'Revenue (Month)', value: '$82,500', icon: 'dollar-sign', color: '#8B5CF6' },
  ],
  pharmacyOrders: [
    { id: 'ORD-P01', pharmacy: 'GoodHealth Pharmacy', items: 5, total: '$1,200', status: 'Pending' },
    { id: 'ORD-P02', pharmacy: 'CityMed Pharmacy', items: 8, total: '$2,500', status: 'Shipped' },
    { id: 'ORD-P03', pharmacy: 'Wellness Drugstore', items: 3, total: '$850', status: 'Delivered' },
  ],
};

export default function DistributorDashboard() {
  const { logout } = useAuth();

  const StatCard = ({ item }: { item: typeof mockData.stats[0] }) => (
    <View style={[styles.statCard, { backgroundColor: item.color }]}>
      <Feather name={item.icon as any} size={24} color="#fff" />
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#059669', '#10B981']} style={styles.header}>
        <Text style={styles.headerTitle}>Distributor Dashboard</Text>
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
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="plus-circle" size={28} color="#3B82F6" />
              <Text style={styles.actionButtonText}>New Order to Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="list" size={28} color="#10B981" />
              <Text style={styles.actionButtonText}>View My Orders</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pharmacy Orders</Text>
          <FlatList
            data={mockData.pharmacyOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View>
                  <Text style={styles.listItemTitle}>{item.pharmacy}</Text>
                  <Text style={styles.listItemSubtitle}>{item.id} - {item.items} items</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.listItemTitle}>{item.total}</Text>
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
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  actionButtonText: {
    marginTop: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
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
