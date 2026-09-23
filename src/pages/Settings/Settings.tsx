import React, { useState, useMemo } from 'react';
import {
  User, Palette, Bell, Mic, Lock, MessageSquare, HardDrive, Monitor,
  Shield, Globe, Accessibility, Keyboard, Link2, Puzzle, Bot, Smartphone,
  HelpCircle, AlertTriangle, LogOut, Search, UserPlus, UserMinus, X
} from 'lucide-react';
import classNames from 'classnames';
import { useAuthStore } from '../../stores/useAuthStore';
import styles from './Settings.module.css';

import { AccountTab } from './tabs/AccountTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { VoiceVideoTab } from './tabs/VoiceVideoTab';
import { PrivacyTab } from './tabs/PrivacyTab';
import { ChatsTab } from './tabs/ChatsTab';
import { StorageTab } from './tabs/StorageTab';
import { DevicesTab } from './tabs/DevicesTab';
import { SecurityTab } from './tabs/SecurityTab';
import { LanguageTab } from './tabs/LanguageTab';
import { AccessibilityTab } from './tabs/AccessibilityTab';
import { ShortcutsTab } from './tabs/ShortcutsTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { CustomizationTab } from './tabs/CustomizationTab';
import { SmartFeaturesTab } from './tabs/SmartFeaturesTab';
import { ApplicationTab } from './tabs/ApplicationTab';
import { SupportTab } from './tabs/SupportTab';
import { AdvancedTab } from './tabs/AdvancedTab';
import { useTranslation } from '../../components/providers/I18nProvider';

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ size?: number }>;
  component: React.FC;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { id: 'account', label: 'Conta', icon: User, component: AccountTab },
      { id: 'appearance', label: 'Aparência', icon: Palette, component: AppearanceTab },
      { id: 'notifications', label: 'Notificações', icon: Bell, component: NotificationsTab },
      { id: 'voice-video', label: 'Voz e Vídeo', icon: Mic, component: VoiceVideoTab },
      { id: 'chats', label: 'Conversas', icon: MessageSquare, component: ChatsTab },
      { id: 'privacy', label: 'Privacidade', icon: Lock, component: PrivacyTab },
      { id: 'security', label: 'Segurança', icon: Shield, component: SecurityTab },
    ],
  },
  {
    items: [
      { id: 'storage', label: 'Armazenamento', icon: HardDrive, component: StorageTab },
      { id: 'devices', label: 'Dispositivos', icon: Monitor, component: DevicesTab },
      { id: 'language', label: 'Idioma e Região', icon: Globe, component: LanguageTab },
      { id: 'accessibility', label: 'Acessibilidade', icon: Accessibility, component: AccessibilityTab },
      { id: 'shortcuts', label: 'Atalhos', icon: Keyboard, component: ShortcutsTab },
    ],
  },
  {
    items: [
      { id: 'integrations', label: 'Integrações', icon: Link2, component: IntegrationsTab },
      { id: 'customization', label: 'Personalização', icon: Puzzle, component: CustomizationTab },
      { id: 'smart-features', label: 'Recursos Inteligentes', icon: Bot, component: SmartFeaturesTab },
    ],
  },
  {
    items: [
      { id: 'application', label: 'Aplicativo', icon: Smartphone, component: ApplicationTab },
      { id: 'support', label: 'Suporte', icon: HelpCircle, component: SupportTab },
      { id: 'advanced', label: 'Avançado', icon: AlertTriangle, component: AdvancedTab },
    ],
  },
];

// Flat list of all items for search
const allItems = navSections.flatMap((s) => s.items);

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [search, setSearch] = useState('');
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();

  const getTranslatedLabel = (id: string, defaultLabel: string) => {
    // Map id to translation key
    const idToKey: Record<string, string> = {
      'account': 'settings.account',
      'appearance': 'settings.appearance',
      'privacy': 'settings.privacy',
      'notifications': 'settings.notifications',
      'chats': 'settings.chats',
      'voice-video': 'settings.voice_video',
      'devices': 'settings.devices',
      'language': 'settings.language',
      'storage': 'settings.storage',
      'application': 'settings.application',
    };
    return idToKey[id] ? t(idToKey[id], defaultLabel) : defaultLabel;
  };

  const filteredSections = useMemo(() => {
    if (!search.trim()) return navSections;

    const q = search.toLowerCase();
    return navSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => getTranslatedLabel(item.id, item.label).toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0);
  }, [search]);

  const ActiveComponent = allItems.find((item) => item.id === activeTab)?.component || AccountTab;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar configurações..."
            className={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} className={styles.searchClear}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {filteredSections.map((section, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <div className={styles.divider} />}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={classNames(styles.navItem, {
                    [styles.active]: activeTab === item.id,
                  })}
                >
                  <item.icon size={18} />
                  <span>{getTranslatedLabel(item.id, item.label)}</span>
                </button>
              ))}
            </React.Fragment>
          ))}

          <div className={styles.divider} />

          {/* Logout */}
          <button
            onClick={logout}
            className={classNames(styles.navItem, styles.danger)}
          >
            <LogOut size={18} />
            <span>{t('settings.logout', 'Sair')}</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.content}>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};
