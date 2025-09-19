import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const mockDistributors = [
  { id: '1', name: 'HealthSupply Co.', location: 'New York, NY' },
  { id: '2', name: 'MediWholesale', location: 'Los Angeles, CA' },
  { id: '3', name: 'PharmaDirect', location: 'Chicago, IL' },
];

export default function ManageDistributorsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Distributors</Text>
      </View>
      <FlatList
        data={mockDistributors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Feather name="truck" size={24} color="#3B82F6" />
            <View style={styles.listItemContent}>
              <Text style={styles.listItemTitle}>{item.name}</Text>
              <Text style={styles.listItemSubtitle}>{item.location}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  list: {
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 15,
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
