import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthData = {
  email: string;
  role: 'customer' | 'pharmacy' | 'distributor' | 'admin';
  loggedInAt: number;
};

type AuthContextType = {
  auth: AuthData | null;
  loading: boolean;
  login: (data: AuthData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  auth: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(auth: AuthData | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !auth &&
      !inAuthGroup
    ) {
      // Redirect to the login page.
      router.replace('/(auth)/login');
    } else if (auth && inAuthGroup) {
      // Redirect away from the login page if the user is signed in.
      switch (auth.role) {
        case 'customer':
          router.replace('/(tabs)');
          break;
        case 'pharmacy':
          router.replace('/pharmacy');
          break;
        case 'distributor':
          router.replace('/distributor');
          break;
        case 'admin':
          router.replace('/admin');
          break;
        default:
          router.replace('/(tabs)');
      }
    }
  }, [auth, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const authDataString = await AsyncStorage.getItem('user_auth');
        if (authDataString) {
          setAuth(JSON.parse(authDataString));
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  useProtectedRoute(auth);

  const login = async (data: AuthData) => {
    setAuth(data);
    await AsyncStorage.setItem('user_auth', JSON.stringify(data));
  };

  const logout = async () => {
    setAuth(null);
    await AsyncStorage.removeItem('user_auth');
  };

  return (
    <AuthContext.Provider value={{ auth, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
