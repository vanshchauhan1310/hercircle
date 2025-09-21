import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
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
    { title: 'Pending Orders', value: '5', icon: 'clock' },
    { title: 'Low Stock', value: '12', icon: 'alert-triangle' },
    { title: 'Out of Stock', value: '3', icon: 'slash' },
    { title: 'Revenue (Today)', value: '$1.2K', icon: 'dollar-sign' },
  ],
  distributors: [
    { id: 'd1', name: 'HealthSupply Co.', leadTime: '2-3 days', minOrder: 100, rating: 4.8 },
    { id: 'd2', name: 'MediWholesale', leadTime: '1-2 days', minOrder: 150, rating: 4.6 },
  ],
  hasDistributor: true, // Set to false to see the "Contact Admin" card
};

export default function PharmacyDashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Pharmacy</Text>
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

        <TouchableOpacity style={styles.primaryButton}>
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Create New Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/pharmacy/catalog')}>
          <Feather name="book-open" size={20} color={Colors.light.primary} />
          <Text style={styles.secondaryButtonText}>Browse Product Catalog</Text>
        </TouchableOpacity>

        {mockData.hasDistributor ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>My Assigned Distributors</Text>
            <FlatList
              data={mockData.distributors}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listItemTitle}>{item.name}</Text>
                    <Text style={styles.listItemSubtitle}>Lead Time: {item.leadTime}</Text>
                    <Text style={styles.listItemSubtitle}>Min. Order: ${item.minOrder}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Feather name="star" size={16} color="#f59e0b" />
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>No Assigned Distributor</Text>
            <Text style={styles.noDistributorText}>
              You are not currently assigned to a distributor. You can place orders directly with the admin.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => Alert.alert('Order from Admin', 'This will open an order form to the admin.')}>
              <Feather name="shield" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Contact Admin for Order</Text>
            </TouchableOpacity>
          </View>
        )}
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 10,
    gap: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.light.primaryMuted,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: '600',
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ca8a04',
    marginRight: 4,
  },
});