import { authService, Credentials, RegisterPayload } from '@/src/services/authService';
import { ProfileUpdate, userService } from '@/src/services/userService';
import { User } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = '@elegante-amaro/auth-user';

interface AuthContextValue {
  user: User | null;
  /** true tant que la session persistée n'a pas été rechargée au démarrage. */
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
  /** Ouvre une session pour un utilisateur déjà résolu (ex. commande invité). */
  signInAs: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Recharge la session persistée au démarrage.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setUser(JSON.parse(raw) as User);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(async (next: User | null) => {
    setUser(next);
    if (next) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(
    async (credentials: Credentials) => {
      const u = await authService.login(credentials);
      await persist(u);
    },
    [persist],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const u = await authService.register(payload);
      await persist(u);
    },
    [persist],
  );

  const logout = useCallback(async () => {
    await persist(null);
  }, [persist]);

  const updateProfile = useCallback(
    async (data: ProfileUpdate) => {
      if (!user) throw new Error('Aucun utilisateur connecté.');
      const updated = await userService.updateProfile(user.id, data);
      await persist(updated);
    },
    [persist, user],
  );

  const signInAs = useCallback(
    async (next: User) => {
      await persist(next);
    },
    [persist],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, updateProfile, signInAs }),
    [user, loading, login, register, logout, updateProfile, signInAs],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>.');
  return ctx;
}
