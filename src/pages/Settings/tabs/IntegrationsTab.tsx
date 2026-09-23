import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Button } from '../../../components/ui/Button/Button';
import { ExternalLink, Unplug, Link2 } from 'lucide-react';
import classNames from 'classnames';

interface IntegrationItem {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
}

const externalAccounts: IntegrationItem[] = [
  { id: 'google', name: 'Google', icon: '🔵', connected: false, description: 'Vincule sua conta Google' },
  { id: 'apple', name: 'Apple', icon: '🍎', connected: false, description: 'Vincule sua conta Apple' },
  { id: 'twitch', name: 'Twitch', icon: '🟣', connected: false, description: 'Mostre o que está assistindo' },
  { id: 'spotify', name: 'Spotify', icon: '🟢', connected: true, description: 'Compartilhe o que está ouvindo' },
  { id: 'youtube', name: 'YouTube', icon: '🔴', connected: false, description: 'Vincule seu canal' },
];

export const IntegrationsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Integrações</h2>

      <SettingSection title="Contas Externas">
        {externalAccounts.map((acc) => (
          <div key={acc.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{acc.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text">{acc.name}</span>
                  {acc.connected && (
                    <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">
                      CONECTADO
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted">{acc.description}</p>
              </div>
            </div>
            {acc.connected ? (
              <Button variant="ghost" size="sm" leftIcon={<Unplug size={14} />}>Desvincular</Button>
            ) : (
              <Button variant="secondary" size="sm" leftIcon={<Link2 size={14} />}>Vincular</Button>
            )}
          </div>
        ))}
      </SettingSection>

      <SettingSection title="Aplicativos Conectados">
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-text-muted">Nenhum aplicativo conectado</p>
          <Button variant="outline" size="sm" className="mt-3" leftIcon={<ExternalLink size={14} />}>
            Explorar aplicativos
          </Button>
        </div>
      </SettingSection>

      <SettingSection title="Webhooks">
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-text-muted">Nenhum webhook configurado</p>
          <Button variant="outline" size="sm" className="mt-3">
            Criar webhook
          </Button>
        </div>
      </SettingSection>
    </div>
  );
};
