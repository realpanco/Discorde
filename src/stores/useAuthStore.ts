import { create } from 'zustand';
import type { User } from '../types/auth';
import { authService } from '../services/AuthService';
import { socketService } from '../services/SocketService';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  clearError: () => void;
}

import { useSettingsStore } from './useSettingsStore';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading for initial session check
  error: null,

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { user, settings } = await authService.login(email, password);
      if (settings) {
        useSettingsStore.getState().loadSettings(settings);
      }
      socketService.connect();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { user, settings } = await authService.register(username, email, password);
      if (settings) {
        useSettingsStore.getState().loadSettings(settings);
      }
      socketService.connect();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      socketService.disconnect();
      useSettingsStore.getState().resetSettings();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  checkSession: async () => {
    try {
      set({ isLoading: true });
      const result = await authService.getSession();
      if (result && result.user) {
        if (result.settings) {
          useSettingsStore.getState().loadSettings(result.settings);
        }
        socketService.connect();
        set({ user: result.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (data: any) => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.updateProfile(data);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));
