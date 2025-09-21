import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
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
    { title: 'Pending Orders', value: '28', icon: 'clock' },
    { title: 'Revenue (MTD)', value: '$82.5K', icon: 'dollar-sign' },
    { title: 'Assigned Pharmacies', value: '42', icon: 'home' },
    { title: 'Issues', value: '3', icon: 'alert-circle' },
  ],
  pharmacyOrders: [
    { id: 'ORD-P01', pharmacy: 'GoodHealth Pharmacy', items: 5, total: '$1,200', status: 'Pending' },
    { id: 'ORD-P02', pharmacy: 'CityMed Pharmacy', items: 8, total: '$2,500', status: 'Shipped' },
    { id: 'ORD-P03', pharmacy: 'Wellness Drugstore', items: 3, total: '$850', status: 'Delivered' },
  ],
};

export default function DistributorDashboard() {
  const { logout } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return Colors.light.warning;
      case 'Shipped':
        return Colors.light.primaryMuted;
      case 'Delivered':
        return Colors.light.success;
      default:
        return Colors.light.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Distributor Hub</Text>
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

        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="plus-circle" size={24} color={Colors.light.primary} />
            <Text style={styles.actionButtonText}>New Order to Admin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="list" size={24} color={Colors.light.primary} />
            <Text style={styles.actionButtonText}>My Stock</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incoming Pharmacy Orders</Text>
          <FlatList
            data={mockData.pharmacyOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemTitle}>{item.pharmacy}</Text>
                  <Text style={styles.listItemSubtitle}>{item.id} - {item.items} items</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.listItemTitle}>{item.total}</Text>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                  </View>
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
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    marginTop: 10,
    fontWeight: '600',
    color: Colors.light.primary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.light.background,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
