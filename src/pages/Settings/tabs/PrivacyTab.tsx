import React, { useState } from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { UserX, VolumeX } from 'lucide-react';

export const PrivacyTab: React.FC = () => {
  const s = useSettingsStore();
  const [showBlockedList, setShowBlockedList] = useState(false);
  const [showMutedList, setShowMutedList] = useState(false);

  const privacyOptions = [
    { value: 'everyone', label: 'Todos' },
    { value: 'friends', label: 'Apenas amigos' },
    { value: 'nobody', label: 'Ninguém' },
  ];

  const addOptions = [
    { value: 'everyone', label: 'Todos' },
    { value: 'friends_of_friends', label: 'Amigos de amigos' },
    { value: 'nobody', label: 'Ninguém' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Privacidade</h2>

      <SettingSection title="Quem pode...">
        <SettingRow label="Enviar mensagens" description="Controle quem pode te enviar mensagens diretas">
          <Select value={s.whoCanMessage} onChange={(v) => s.setSetting('whoCanMessage', v as any)} options={privacyOptions} />
        </SettingRow>
        <SettingRow label="Fazer chamadas" description="Controle quem pode te ligar">
          <Select value={s.whoCanCall} onChange={(v) => s.setSetting('whoCanCall', v as any)} options={privacyOptions} />
        </SettingRow>
        <SettingRow label="Adicionar você" description="Controle quem pode te enviar solicitações">
          <Select value={s.whoCanAddYou} onChange={(v) => s.setSetting('whoCanAddYou', v as any)} options={addOptions} />
        </SettingRow>
        <SettingRow label="Ver seu perfil" description="Controle quem pode ver suas informações">
          <Select value={s.whoCanSeeProfile} onChange={(v) => s.setSetting('whoCanSeeProfile', v as any)} options={privacyOptions} />
        </SettingRow>
        <SettingRow label="Ver seu status" description="Controle quem vê seu status personalizado">
          <Select value={s.whoCanSeeStatus} onChange={(v) => s.setSetting('whoCanSeeStatus', v as any)} options={privacyOptions} />
        </SettingRow>
        <SettingRow label="Ver quando online" description="Controle quem vê que você está online">
          <Select value={s.whoCanSeeOnline} onChange={(v) => s.setSetting('whoCanSeeOnline', v as any)} options={privacyOptions} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Visibilidade">
        <SettingRow label="Mostrar última vez online" description="Permitir que outros vejam quando você esteve online">
          <Switch checked={s.showLastOnline} onChange={(v) => s.setSetting('showLastOnline', v)} />
        </SettingRow>
        <SettingRow label="Confirmação de leitura" description="Mostrar quando você leu uma mensagem">
          <Switch checked={s.readReceipts} onChange={(v) => s.setSetting('readReceipts', v)} />
        </SettingRow>
        <SettingRow label="Indicador de digitando" description="Mostrar quando você está digitando">
          <Switch checked={s.typingIndicator} onChange={(v) => s.setSetting('typingIndicator', v)} />
        </SettingRow>
        <SettingRow label="Ocultar atividade" description="Não mostrar o que você está fazendo">
          <Switch checked={s.hideActivity} onChange={(v) => s.setSetting('hideActivity', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Listas">
        <SettingRow label="Usuários bloqueados" description="Gerencie sua lista de usuários bloqueados">
          <Button variant="ghost" size="sm" leftIcon={<UserX size={14} />} onClick={() => setShowBlockedList(true)}>Gerenciar</Button>
        </SettingRow>
        <SettingRow label="Usuários silenciados" description="Gerencie sua lista de usuários silenciados">
          <Button variant="ghost" size="sm" leftIcon={<VolumeX size={14} />} onClick={() => setShowMutedList(true)}>Gerenciar</Button>
        </SettingRow>
      </SettingSection>

      {showBlockedList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold text-text mb-4">Usuários Bloqueados</h3>
            <p className="text-sm text-text-muted mb-4">Você não receberá mensagens ou chamadas das pessoas listadas aqui.</p>
            <div className="flex flex-col items-center justify-center py-8 text-text-muted">
              <UserX size={32} className="mb-2 opacity-50" />
              <p>Você não bloqueou ninguém ainda.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowBlockedList(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}

      {showMutedList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold text-text mb-4">Usuários Silenciados</h3>
            <p className="text-sm text-text-muted mb-4">Notificações desses usuários não irão emitir sons ou pop-ups.</p>
            <div className="flex flex-col items-center justify-center py-8 text-text-muted">
              <VolumeX size={32} className="mb-2 opacity-50" />
              <p>Nenhum usuário silenciado.</p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowMutedList(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
