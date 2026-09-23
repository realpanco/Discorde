import React, { useEffect } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { socketService } from '../../services/SocketService';
import { useAuthStore } from '../../stores/useAuthStore';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    notificationsEnabled,
    messageNotifications,
    desktopNotifications,
    notificationSound,
    doNotDisturb,
  } = useSettingsStore();

  const user = useAuthStore(state => state.user);

  useEffect(() => {
    // Request permission if enabled
    if (notificationsEnabled && desktopNotifications && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationsEnabled, desktopNotifications]);

  useEffect(() => {
    if (!user) return;

    const handleMessage = (msg: any) => {
      // Don't notify for our own messages or system messages
      if (msg.userId === user.id || msg.userId === 'system') return;

      if (!notificationsEnabled || doNotDisturb) return;
      if (!messageNotifications) return;

      // Desktop Notification
      if (desktopNotifications && Notification.permission === 'granted') {
        new Notification(`Nova mensagem de ${msg.username}`, {
          body: msg.content,
          icon: '/favicon.ico', // Placeholder
        });
      }

      // Sound
      if (notificationSound) {
        // In a real app we'd play an audio file here. 
        // Example: new Audio('/notification.mp3').play().catch(() => {});
      }
    };

    socketService.onMessage(handleMessage);

    return () => {
      socketService.offMessage(handleMessage);
    };
  }, [user, notificationsEnabled, doNotDisturb, messageNotifications, desktopNotifications, notificationSound]);

  return <>{children}</>;
};
