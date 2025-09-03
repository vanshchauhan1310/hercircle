import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 15,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 6,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Ionicons 
                name={focused ? "bag" : "bag-outline"} 
                size={focused ? 24 : 22} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Ionicons 
                name={focused ? "book" : "book-outline"} 
                size={focused ? 24 : 22} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Ionicons 
                name={focused ? "calendar" : "calendar-outline"} 
                size={focused ? 24 : 22} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="flowbot"
        options={{
          title: 'FlowBot',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Ionicons 
                name={focused ? "chatbubble" : "chatbubble-outline"} 
                size={focused ? 24 : 22} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={focused ? 24 : 22} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}