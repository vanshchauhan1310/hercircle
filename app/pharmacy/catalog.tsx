import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const CATALOG_KEY = 'global_product_catalog';

interface CatalogItem { id: string; name: string; category: string; price: number; image?: string; brand?: string; }

const seedCatalog: CatalogItem[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Analgesic', price: 2.49, image: 'https://via.placeholder.com/150', brand: 'ACME' },
  { id: '2', name: 'Ibuprofen 200mg', category: 'NSAID', price: 3.99, image: 'https://via.placeholder.com/150', brand: 'HealWell' },
  { id: '3', name: 'Cough Syrup 100ml', category: 'Cold & Flu', price: 5.5, image: 'https://via.placeholder.com/150', brand: 'Soothe' },
  { id: '4', name: 'Vitamin C 1000mg', category: 'Supplements', price: 8.0, image: 'https://via.placeholder.com/150', brand: 'Immuno' },
];

async function loadCatalog(): Promise<CatalogItem[]> {
  const raw = await AsyncStorage.getItem(CATALOG_KEY);
  return raw ? JSON.parse(raw) : seedCatalog;
}

export default function ProductCatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<CatalogItem[]>([]);

  useEffect(() => {
    (async () => setItems(await loadCatalog()))();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return items;
    const s = searchQuery.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(s) || i.category.toLowerCase().includes(s) || (i.brand||'').toLowerCase().includes(s));
  }, [items, searchQuery]);

  const addToInventory = async (p: CatalogItem) => {
    // Adds selected product to current pharmacy inventory
    const auth = JSON.parse((await AsyncStorage.getItem('pharmacy_auth')) || 'null');
    const stores = JSON.parse((await AsyncStorage.getItem('pharmacy_stores')) || '[]');
    const s = stores.find((x: any) => x.id === auth?.storeId);
    if (!s) {
      Alert.alert('No store found', 'Please add your store details first in Settings.');
      return;
    }
    s.inventory = s.inventory || [];
    const exists = (s.inventory || []).some((x: any) => x.name === p.name);
    if (exists) {
      Alert.alert('Already in inventory', 'This product already exists in your inventory.');
      return;
    }
    s.inventory.unshift({ id: `${Date.now()}`, name: p.name, sku: p.id, price: p.price, stock: 0, reorderLevel: 5, category: p.category });
    const idx = stores.findIndex((x: any) => x.id === s.id);
    stores[idx] = s;
    await AsyncStorage.setItem('pharmacy_stores', JSON.stringify(stores));
    Alert.alert('Added', `${p.name} has been added to your inventory.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Catalog</Text>
        <TouchableOpacity onPress={() => router.push('/pharmacy/inventory')}>
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
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productCategory}>{item.category}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => addToInventory(item)}>
              <Feather name="plus" size={16} color="#fff" />
              <Text style={styles.addBtnText}>Add to Inventory</Text>
            </TouchableOpacity>
          </TouchableOpacity>
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
  addBtn: { marginTop: 8, backgroundColor: '#7C3AED', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 6 },
  addBtnText: { color: '#fff', fontWeight: '700' },
});
