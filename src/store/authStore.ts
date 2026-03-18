import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export type UserRole = "customer" | "worker" | "admin";

export type AuthUser = {
  id: string;
  role: UserRole;
  name?: string;
  phone?: string;
  email?: string;
};

type AuthState = {
  hydrated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setAuth: (next: { accessToken: string; refreshToken: string; user: AuthUser }) => Promise<void>;
  clear: () => Promise<void>;
  hydrate: () => Promise<void>;
};

const ACCESS_KEY = "auth.accessToken";
const REFRESH_KEY = "auth.refreshToken";
const USER_KEY = "auth.user";

export const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  accessToken: null,
  refreshToken: null,
  user: null,

  hydrate: async () => {
    const [accessToken, refreshToken, userJson] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
      SecureStore.getItemAsync(USER_KEY),
    ]);
    const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
    set({ hydrated: true, accessToken: accessToken ?? null, refreshToken: refreshToken ?? null, user });
  },

  setAuth: async ({ accessToken, refreshToken, user }) => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_KEY, refreshToken),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
    ]);
    set({ accessToken, refreshToken, user });
  },

  clear: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));

export function getAccessToken() {
  return useAuthStore.getState().accessToken;
}

export async function setAuthTokens(next: { accessToken: string; refreshToken: string; user: AuthUser }) {
  return useAuthStore.getState().setAuth(next);
}

export async function clearAuth() {
  return useAuthStore.getState().clear();
}

