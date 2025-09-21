import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const mockProducts = [
  { id: '1', name: 'Product A', category: 'Category 1', price: 10.99, image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Product B', category: 'Category 2', price: 25.50, image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Product C', category: 'Category 1', price: 15.00, image: 'https://via.placeholder.com/150' },
  { id: '4', name: 'Product D', category: 'Category 3', price: 5.99, image: 'https://via.placeholder.com/150' },
];

export default function ProductCatalogScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Catalog</Text>
        <TouchableOpacity>
          <Feather name="shopping-cart" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={Colors.light.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={mockProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
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
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: Colors.light.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    margin: 15,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 15,
  },
  productCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    margin: 7.5,
    padding: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
});
