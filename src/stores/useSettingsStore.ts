import { create } from 'zustand';

interface SettingsState {
  // --- Appearance ---
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: number;
  interfaceScale: number;
  interfaceDensity: 'comfortable' | 'compact' | 'spacious';
  animations: boolean;
  visualEffects: boolean;
  transparency: boolean;
  compactMode: boolean;
  showAvatars: boolean;
  chatLayout: 'cozy' | 'compact';

  // --- Notifications ---
  notificationsEnabled: boolean;
  messageNotifications: boolean;
  dmNotifications: boolean;
  mentionNotifications: boolean;
  friendRequestNotifications: boolean;
  incomingCallNotifications: boolean;
  missedCallNotifications: boolean;
  notificationSound: boolean;
  vibration: boolean;
  desktopNotifications: boolean;
  messagePreview: boolean;
  doNotDisturb: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;

  // --- Voice & Video ---
  inputDevice: string;
  outputDevice: string;
  cameraDevice: string;
  inputVolume: number;
  outputVolume: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
  autoSensitivity: boolean;
  voiceDetection: boolean;
  pushToTalk: boolean;
  pushToTalkKey: string;
  audioQuality: 'low' | 'medium' | 'high';
  videoQuality: 'auto' | '360p' | '480p' | '720p' | '1080p';
  cameraFps: '15' | '30' | '60';
  maxResolution: '480p' | '720p' | '1080p' | '1440p' | '4k';
  backgroundBlur: boolean;
  virtualCamera: boolean;

  // --- Privacy ---
  whoCanMessage: 'everyone' | 'friends' | 'nobody';
  whoCanCall: 'everyone' | 'friends' | 'nobody';
  whoCanAddYou: 'everyone' | 'friends_of_friends' | 'nobody';
  whoCanSeeProfile: 'everyone' | 'friends' | 'nobody';
  whoCanSeeStatus: 'everyone' | 'friends' | 'nobody';
  whoCanSeeOnline: 'everyone' | 'friends' | 'nobody';
  showLastOnline: boolean;
  readReceipts: boolean;
  typingIndicator: boolean;
  hideActivity: boolean;

  // --- Chats ---
  enterSendsMessage: boolean;
  showDeleteConfirmation: boolean;
  editMessages: boolean;
  linkPreview: boolean;
  autoplayVideos: boolean;
  autoplayGifs: boolean;
  autoDownload: boolean;
  mediaQuality: 'low' | 'medium' | 'high' | 'original';
  compressImages: boolean;
  openLinksExternally: boolean;

  // --- Storage ---
  dataSaver: boolean;
  uploadQuality: 'low' | 'medium' | 'high' | 'original';
  downloadQuality: 'low' | 'medium' | 'high' | 'original';
  autoSync: boolean;

  // --- Language ---
  language: string;
  region: string;
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
  timeFormat: '12h' | '24h';
  timezone: string;
  firstDayOfWeek: 'sunday' | 'monday';

  // --- Accessibility ---
  largerText: boolean;
  highContrast: boolean;
  reduceAnimations: boolean;
  reduceEffects: boolean;
  autoCaptions: boolean;
  callCaptions: boolean;
  keyboardNavigation: boolean;
  screenReader: boolean;

  // --- Smart Features ---
  autoTranscription: boolean;
  conversationSummary: boolean;
  autoTranslation: boolean;
  messageTranslation: boolean;
  realtimeCaptions: boolean;
  spamFilters: boolean;
  replySuggestions: boolean;
  contentDetection: boolean;

  // --- Application ---
  startWithSystem: boolean;
  minimizeToTray: boolean;
  runInBackground: boolean;
  autoUpdates: boolean;

  // --- Advanced ---
  developerMode: boolean;
  hardwareAcceleration: boolean;

  // Actions
  setSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  loadSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

const defaultSettings: Omit<SettingsState, 'setSetting' | 'loadSettings' | 'resetSettings'> = {
  // Appearance
  theme: 'dark',
  accentColor: '#6366f1',
  fontSize: 14,
  interfaceScale: 100,
  interfaceDensity: 'comfortable',
  animations: true,
  visualEffects: true,
  transparency: true,
  compactMode: false,
  showAvatars: true,
  chatLayout: 'cozy',

  // Notifications
  notificationsEnabled: true,
  messageNotifications: true,
  dmNotifications: true,
  mentionNotifications: true,
  friendRequestNotifications: true,
  incomingCallNotifications: true,
  missedCallNotifications: true,
  notificationSound: true,
  vibration: true,
  desktopNotifications: true,
  messagePreview: true,
  doNotDisturb: false,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',

  // Voice & Video
  inputDevice: 'default',
  outputDevice: 'default',
  cameraDevice: 'default',
  inputVolume: 80,
  outputVolume: 100,
  noiseSuppression: true,
  echoCancellation: true,
  autoGainControl: true,
  autoSensitivity: true,
  voiceDetection: true,
  pushToTalk: false,
  pushToTalkKey: 'Space',
  audioQuality: 'high',
  videoQuality: '720p',
  cameraFps: '30',
  maxResolution: '1080p',
  backgroundBlur: false,
  virtualCamera: false,

  // Privacy
  whoCanMessage: 'everyone',
  whoCanCall: 'friends',
  whoCanAddYou: 'everyone',
  whoCanSeeProfile: 'everyone',
  whoCanSeeStatus: 'everyone',
  whoCanSeeOnline: 'everyone',
  showLastOnline: true,
  readReceipts: true,
  typingIndicator: true,
  hideActivity: false,

  // Chats
  enterSendsMessage: true,
  showDeleteConfirmation: true,
  editMessages: true,
  linkPreview: true,
  autoplayVideos: true,
  autoplayGifs: true,
  autoDownload: true,
  mediaQuality: 'high',
  compressImages: true,
  openLinksExternally: false,

  // Storage
  dataSaver: false,
  uploadQuality: 'original',
  downloadQuality: 'high',
  autoSync: true,

  // Language
  language: 'pt-BR',
  region: 'BR',
  dateFormat: 'dd/mm/yyyy',
  timeFormat: '24h',
  timezone: 'America/Sao_Paulo',
  firstDayOfWeek: 'sunday',

  // Accessibility
  largerText: false,
  highContrast: false,
  reduceAnimations: false,
  reduceEffects: false,
  autoCaptions: false,
  callCaptions: false,
  keyboardNavigation: false,
  screenReader: false,

  // Smart Features
  autoTranscription: false,
  conversationSummary: false,
  autoTranslation: false,
  messageTranslation: false,
  realtimeCaptions: false,
  spamFilters: true,
  replySuggestions: false,
  contentDetection: true,

  // Application
  startWithSystem: false,
  minimizeToTray: true,
  runInBackground: true,
  autoUpdates: true,

  // Advanced
  developerMode: false,
  hardwareAcceleration: true,
};

import { settingsService } from '../services/SettingsService';

// Mapping setting keys to their backend categories
const categoryMap: Record<string, string> = {
  theme: 'appearance', accentColor: 'appearance', fontSize: 'appearance', interfaceScale: 'appearance',
  interfaceDensity: 'appearance', animations: 'appearance', visualEffects: 'appearance', 
  transparency: 'appearance', compactMode: 'appearance', showAvatars: 'appearance', chatLayout: 'appearance',
  
  notificationsEnabled: 'notification', messageNotifications: 'notification', dmNotifications: 'notification',
  mentionNotifications: 'notification', friendRequestNotifications: 'notification', incomingCallNotifications: 'notification',
  missedCallNotifications: 'notification', notificationSound: 'notification', vibration: 'notification',
  desktopNotifications: 'notification', messagePreview: 'notification', doNotDisturb: 'notification',
  quietHoursEnabled: 'notification', quietHoursStart: 'notification', quietHoursEnd: 'notification',

  inputDevice: 'voice_video', outputDevice: 'voice_video', cameraDevice: 'voice_video', inputVolume: 'voice_video',
  outputVolume: 'voice_video', noiseSuppression: 'voice_video', echoCancellation: 'voice_video', autoGainControl: 'voice_video',
  autoSensitivity: 'voice_video', voiceDetection: 'voice_video', pushToTalk: 'voice_video', pushToTalkKey: 'voice_video',
  audioQuality: 'voice_video', videoQuality: 'voice_video', cameraFps: 'voice_video', maxResolution: 'voice_video',
  backgroundBlur: 'voice_video', virtualCamera: 'voice_video',

  whoCanMessage: 'privacy', whoCanCall: 'privacy', whoCanAddYou: 'privacy', whoCanSeeProfile: 'privacy',
  whoCanSeeStatus: 'privacy', whoCanSeeOnline: 'privacy', showLastOnline: 'privacy', readReceipts: 'privacy',
  typingIndicator: 'privacy', hideActivity: 'privacy',

  enterSendsMessage: 'chat', showDeleteConfirmation: 'chat', editMessages: 'chat', linkPreview: 'chat',
  autoplayVideos: 'chat', autoplayGifs: 'chat', autoDownload: 'chat', mediaQuality: 'chat', compressImages: 'chat',
  openLinksExternally: 'chat',

  dataSaver: 'storage', uploadQuality: 'storage', downloadQuality: 'storage', autoSync: 'storage',

  language: 'language', region: 'language', dateFormat: 'language', timeFormat: 'language', timezone: 'language',
  firstDayOfWeek: 'language',

  largerText: 'accessibility', highContrast: 'accessibility', reduceAnimations: 'accessibility', reduceEffects: 'accessibility',
  autoCaptions: 'accessibility', callCaptions: 'accessibility', keyboardNavigation: 'accessibility', screenReader: 'accessibility',

  autoTranscription: 'smart_features', conversationSummary: 'smart_features', autoTranslation: 'smart_features',
  messageTranslation: 'smart_features', realtimeCaptions: 'smart_features', spamFilters: 'smart_features',
  replySuggestions: 'smart_features', contentDetection: 'smart_features',

  startWithSystem: 'application', minimizeToTray: 'application', runInBackground: 'application', autoUpdates: 'application',

  developerMode: 'advanced', hardwareAcceleration: 'advanced',
};

// Debounce timer map
const debounceMap = new Map<string, NodeJS.Timeout>();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,

  setSetting: (key, value) => {
    // 1. Optimistic UI update
    set({ [key]: value } as Partial<SettingsState>);

    // 2. Debounced API sync
    const category = categoryMap[key as string];
    if (category) {
      if (debounceMap.has(category)) clearTimeout(debounceMap.get(category));
      
      const timeoutId = setTimeout(async () => {
        try {
          // Gather all settings in this category
          const currentState = get();
          const categoryUpdates: Record<string, any> = {};
          for (const [k, c] of Object.entries(categoryMap)) {
            if (c === category) {
              categoryUpdates[k] = currentState[k as keyof SettingsState];
            }
          }
          
          await settingsService.updateSettings(category, categoryUpdates);
        } catch (err) {
          console.error(`Failed to sync settings for ${category}:`, err);
        }
      }, 500); // 500ms debounce
      
      debounceMap.set(category, timeoutId);
    }
  },

  loadSettings: (settings) => set({ ...settings }),

  resetSettings: () => set(defaultSettings),
}));
