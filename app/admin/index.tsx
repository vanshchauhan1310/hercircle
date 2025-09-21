import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart, XAxis, YAxis } from 'react-native-svg-charts';

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
          <Text style={styles.cardTitle}>Monthly Revenue (in thousands)</Text>
          <View style={{ height: 200, flexDirection: 'row' }}>
            <YAxis
              data={mockData.revenueData.map(d => d.value)}
              contentInset={{ top: 20, bottom: 20 }}
              svg={{ fontSize: 10, fill: Colors.light.textSecondary }}
              numberOfTicks={6}
              formatLabel={(value) => `$${value}k`}
            />
            <BarChart
              style={{ flex: 1, marginLeft: 10 }}
              data={mockData.revenueData.map(d => d.value)}
              svg={{ fill: Colors.light.primaryMuted }}
              contentInset={{ top: 20, bottom: 20 }}
            />
          </View>
          <XAxis
            style={{ marginHorizontal: 10, marginTop: 10 }}
            data={mockData.revenueData}
            formatLabel={(_, index) => mockData.revenueData[index].label}
            contentInset={{ left: 30, right: 30 }}
            svg={{ fontSize: 10, fill: Colors.light.textSecondary }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Management</Text>
          <TouchableOpacity style={styles.managementButton} onPress={() => router.push('/admin/management/distributors')}>
            <Feather name="truck" size={22} color={Colors.light.primary} />
            <Text style={styles.managementButtonText}>Manage Distributors</Text>
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
});
