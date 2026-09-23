import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Input } from '../../../components/ui/Input/Input';
import { useSettingsStore } from '../../../stores/useSettingsStore';

export const NotificationsTab: React.FC = () => {
  const s = useSettingsStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Notificações</h2>

      <SettingSection title="Geral">
        <SettingRow label="Notificações" description="Ativar ou desativar todas as notificações">
          <Switch checked={s.notificationsEnabled} onChange={(v) => s.setSetting('notificationsEnabled', v)} />
        </SettingRow>
        <SettingRow label="Notificações na área de trabalho" description="Mostrar notificações do sistema">
          <Switch checked={s.desktopNotifications} onChange={(v) => s.setSetting('desktopNotifications', v)} />
        </SettingRow>
        <SettingRow label="Sons de notificação" description="Reproduzir sons ao receber notificações">
          <Switch checked={s.notificationSound} onChange={(v) => s.setSetting('notificationSound', v)} />
        </SettingRow>
        <SettingRow label="Vibração" description="Vibrar ao receber notificações">
          <Switch checked={s.vibration} onChange={(v) => s.setSetting('vibration', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Tipos de Notificação">
        <SettingRow label="Mensagens" description="Notificações de mensagens em canais">
          <Switch checked={s.messageNotifications} onChange={(v) => s.setSetting('messageNotifications', v)} />
        </SettingRow>
        <SettingRow label="Mensagens privadas" description="Notificações de DMs">
          <Switch checked={s.dmNotifications} onChange={(v) => s.setSetting('dmNotifications', v)} />
        </SettingRow>
        <SettingRow label="Menções" description="Quando alguém mencionar você">
          <Switch checked={s.mentionNotifications} onChange={(v) => s.setSetting('mentionNotifications', v)} />
        </SettingRow>
        <SettingRow label="Solicitações de amizade" description="Novas solicitações de amizade">
          <Switch checked={s.friendRequestNotifications} onChange={(v) => s.setSetting('friendRequestNotifications', v)} />
        </SettingRow>
        <SettingRow label="Chamadas recebidas" description="Quando alguém ligar para você">
          <Switch checked={s.incomingCallNotifications} onChange={(v) => s.setSetting('incomingCallNotifications', v)} />
        </SettingRow>
        <SettingRow label="Chamadas perdidas" description="Notificações de chamadas que você não atendeu">
          <Switch checked={s.missedCallNotifications} onChange={(v) => s.setSetting('missedCallNotifications', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Prévia e Privacidade">
        <SettingRow label="Prévia da mensagem" description="Mostrar conteúdo na notificação">
          <Switch checked={s.messagePreview} onChange={(v) => s.setSetting('messagePreview', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Não Perturbe">
        <SettingRow label="Não perturbe" description="Silenciar todas as notificações">
          <Switch checked={s.doNotDisturb} onChange={(v) => s.setSetting('doNotDisturb', v)} />
        </SettingRow>
        <SettingRow label="Horários de silêncio" description="Silenciar automaticamente em horários específicos">
          <Switch checked={s.quietHoursEnabled} onChange={(v) => s.setSetting('quietHoursEnabled', v)} />
        </SettingRow>
        {s.quietHoursEnabled && (
          <>
            <SettingRow label="Início" description="Hora de início do silêncio">
              <input
                type="time"
                value={s.quietHoursStart}
                onChange={(e) => s.setSetting('quietHoursStart', e.target.value)}
                className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </SettingRow>
            <SettingRow label="Fim" description="Hora de término do silêncio">
              <input
                type="time"
                value={s.quietHoursEnd}
                onChange={(e) => s.setSetting('quietHoursEnd', e.target.value)}
                className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </SettingRow>
          </>
        )}
      </SettingSection>
    </div>
  );
};
