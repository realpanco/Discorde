import type { User } from '../types/auth';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api/auth`;

class AuthService {
  private static TOKEN_KEY = 'discord_clone_token';

  async login(email: string, password: string): Promise<{ user: User, settings?: any }> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to login');

    localStorage.setItem(AuthService.TOKEN_KEY, data.token);
    return { user: data.user, settings: data.settings };
  }

  async register(username: string, email: string, password: string): Promise<{ user: User, settings?: any }> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to register');

    localStorage.setItem(AuthService.TOKEN_KEY, data.token);
    return { user: data.user, settings: data.settings };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(AuthService.TOKEN_KEY);
  }

  async getSession(): Promise<{ user: User, settings?: any } | null> {
    const token = localStorage.getItem(AuthService.TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Invalid session');
      
      const data = await response.json();
      return { user: data.user, settings: data.settings };
    } catch (e) {
      localStorage.removeItem(AuthService.TOKEN_KEY);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  async updateProfile(data: any): Promise<User> {
    const token = this.getToken();
    if (!token) throw new Error('No token');
    
    const response = await fetch(`${BASE_URL}/api/settings/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to update profile');
    return result.user;
  }
}

export const authService = new AuthService();
