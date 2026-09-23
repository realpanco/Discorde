import { io, Socket } from 'socket.io-client';
import { authService } from './AuthService';

class SocketService {
  private socket: Socket | null = null;
  private baseURL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`;

  connect() {
    const token = authService.getToken();
    if (!token) return;

    if (!this.socket) {
      this.socket = io(this.baseURL, {
        auth: { token }
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string, user: any) {
    if (this.socket) {
      this.socket.emit('join-room', { roomId, user });
    }
  }

  sendMessage(content: string, attachment?: { type: string; data: string; name: string }) {
    if (this.socket) {
      this.socket.emit('send-message', { content, attachment });
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('chat-message', callback);
    }
  }

  offMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.off('chat-message', callback);
    }
  }

  // WebRTC Signaling Wrappers
  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
