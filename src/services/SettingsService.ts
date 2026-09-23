const API_URL = `\${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/settings`;

class SettingsService {
  private getToken() {
    return localStorage.getItem('discord_clone_token');
  }

  private getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  async updateSettings(category: string, updates: Record<string, any>): Promise<any> {
    const response = await fetch(`${API_URL}/${category}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to save settings');
    return data.settings;
  }
}

export const settingsService = new SettingsService();
