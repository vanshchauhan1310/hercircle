import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface UserProfile {
  age?: string;
  location?: string;
  cycleLength?: string;
  periodDuration?: string;
  flowIntensity?: string;
  symptoms?: string[];
  products?: string[];
  brands?: string;
  preferences?: string[];
  conditions?: string[];
  goals?: string[];
  consent?: {
    cyclePredictions: boolean;
    anonymousData: boolean;
  };
}

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['auth', 'userProfile', 'onboardingCompleted']);
              router.replace('/onboarding/signup');
            } catch (error) {
              console.error('Failed to logout:', error);
            }
          },
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'subscriptions',
      title: 'My Subscriptions',
      subtitle: 'Manage your recurring orders',
      icon: 'repeat',
      color: '#FF6B9D',
      onPress: () => Alert.alert('Subscriptions', 'Manage your subscriptions here'),
    },
    {
      id: 'orders',
      title: 'Order History',
      subtitle: 'View past orders and tracking',
      icon: 'bag',
      color: '#4ECDC4',
      onPress: () => Alert.alert('Orders', 'View your order history here'),
    },
    {
      id: 'wishlist',
      title: 'Saved Items',
      subtitle: 'Products you\'ve saved',
      icon: 'heart',
      color: '#FF8E53',
      onPress: () => Alert.alert('Wishlist', 'View your saved items here'),
    },
    {
      id: 'quiz',
      title: 'Retake Product Quiz',
      subtitle: 'Update your preferences',
      icon: 'help-circle',
      color: '#A78BFA',
      onPress: () => router.push('/onboarding/health-quiz'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage your alerts',
      icon: 'notifications',
      color: '#10B981',
      onPress: () => Alert.alert('Notifications', 'Manage your notification preferences'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Data and account settings',
      icon: 'shield',
      color: '#F59E0B',
      onPress: () => Alert.alert('Privacy', 'Manage your privacy settings'),
    },
    {
      id: 'support',
      title: 'Help & Support',
      subtitle: 'Contact us and FAQs',
      icon: 'chatbubble-ellipses',
      color: '#EF4444',
      onPress: () => router.push('/flowbot'),
    },
  ];

  const ProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="person" size={32} color="#fff" />
          </LinearGradient>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>HerCircle Member</Text>
          <Text style={styles.profileEmail}>Welcome back!</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.cycleLength || '28'}</Text>
          <Text style={styles.statLabel}>Days</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.periodDuration || '5'}</Text>
          <Text style={styles.statLabel}>Period</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.symptoms?.length || '0'}</Text>
          <Text style={styles.statLabel}>Symptoms</Text>
        </View>
      </View>
    </View>
  );

  const MenuSection = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Account & Settings</Text>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuItem}
          onPress={item.onPress}
        >
          <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon as any} size={20} color="#fff" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7D2FE" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const QuickActions = () => (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/tracker')}
        >
          <LinearGradient
            colors={['#FF6B9D', '#FF8E53']}
            style={styles.quickActionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="calendar" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Track Today</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/flowbot')}
        >
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.quickActionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="chatbubble" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Ask FlowBot</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/learn')}
        >
          <LinearGradient
            colors={['#A78BFA', '#8B5CF6']}
            style={styles.quickActionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="book" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Learn</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => router.push('/')}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.quickActionGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="bag" size={24} color="#fff" />
            <Text style={styles.quickActionTitle}>Shop</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B9D', '#FF8E53']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <Ionicons name="person" size={28} color="#fff" />
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileSection />
        <QuickActions />
        <MenuSection />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  profileSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E9ECEF',
  },
  quickActionsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 44) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionGradient: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
}); 