export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bannerUrl?: string;
  pronouns?: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  bio?: string;
  phone?: string;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
