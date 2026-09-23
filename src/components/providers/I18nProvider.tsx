import React, { createContext, useContext, useCallback } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

type Translations = Record<string, Record<string, string>>;

const translations: Translations = {
  'pt-BR': {
    'settings.title': 'Configurações',
    'settings.account': 'Conta',
    'settings.appearance': 'Aparência',
    'settings.privacy': 'Privacidade',
    'settings.notifications': 'Notificações',
    'settings.chats': 'Conversas',
    'settings.voice_video': 'Voz e Vídeo',
    'settings.devices': 'Dispositivos',
    'settings.language': 'Idioma e Região',
    'settings.storage': 'Armazenamento',
    'settings.application': 'Aplicativo',
    'settings.logout': 'Sair',
    'language.title': 'Idioma e Região',
    'language.app_language': 'Idioma do aplicativo',
    'language.region': 'Região',
    'language.date_format': 'Formato de data',
    'language.time_format': 'Formato de hora',
    'language.timezone': 'Fuso horário',
    'language.first_day': 'Primeiro dia da semana',
  },
  'en-US': {
    'settings.title': 'Settings',
    'settings.account': 'Account',
    'settings.appearance': 'Appearance',
    'settings.privacy': 'Privacy',
    'settings.notifications': 'Notifications',
    'settings.chats': 'Chats',
    'settings.voice_video': 'Voice & Video',
    'settings.devices': 'Devices',
    'settings.language': 'Language & Region',
    'settings.storage': 'Storage',
    'settings.application': 'Application',
    'settings.logout': 'Logout',
    'language.title': 'Language & Region',
    'language.app_language': 'App Language',
    'language.region': 'Region',
    'language.date_format': 'Date Format',
    'language.time_format': 'Time Format',
    'language.timezone': 'Timezone',
    'language.first_day': 'First day of week',
  },
  'es-ES': {
    'settings.title': 'Ajustes',
    'settings.account': 'Cuenta',
    'settings.appearance': 'Apariencia',
    'settings.privacy': 'Privacidad',
    'settings.notifications': 'Notificaciones',
    'settings.chats': 'Chats',
    'settings.voice_video': 'Voz y Video',
    'settings.devices': 'Dispositivos',
    'settings.language': 'Idioma y Región',
    'settings.storage': 'Almacenamiento',
    'settings.application': 'Aplicación',
    'settings.logout': 'Cerrar sesión',
    'language.title': 'Idioma y Región',
    'language.app_language': 'Idioma de la aplicación',
    'language.region': 'Región',
    'language.date_format': 'Formato de fecha',
    'language.time_format': 'Formato de hora',
    'language.timezone': 'Zona horaria',
    'language.first_day': 'Primer día de la semana',
  }
};

interface I18nContextProps {
  t: (key: string, defaultValue?: string) => string;
  formatDate: (date: Date | number | string) => string;
}

const I18nContext = createContext<I18nContextProps>({
  t: (key) => key,
  formatDate: () => '',
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, dateFormat, timeFormat } = useSettingsStore();

  const t = useCallback((key: string, defaultValue?: string) => {
    const langKey = language === 'pt-BR' || language === 'en-US' || language === 'es-ES' ? language : 'en-US';
    return translations[langKey]?.[key] || defaultValue || key;
  }, [language]);

  const formatDate = useCallback((date: Date | number | string) => {
    const d = new Date(date);
    const hour12 = timeFormat === '12h';
    
    // Very basic implementation of user's date format preference
    let dateStr = '';
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    if (dateFormat === 'dd/mm/yyyy') dateStr = `${day}/${month}/${year}`;
    else if (dateFormat === 'mm/dd/yyyy') dateStr = `${month}/${day}/${year}`;
    else if (dateFormat === 'yyyy-mm-dd') dateStr = `${year}-${month}-${day}`;

    const timeStr = d.toLocaleTimeString(language, { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12 
    });

    return `${dateStr} ${timeStr}`;
  }, [dateFormat, timeFormat, language]);

  return (
    <I18nContext.Provider value={{ t, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
