import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Button } from '../../../components/ui/Button/Button';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { Bug, RefreshCw, Info } from 'lucide-react';

export const ApplicationTab: React.FC = () => {
  const s = useSettingsStore();

  // Simple heuristic: if we're in an electron or tauri app
  // In a real app we'd inject a global window.isElectron or similar
  const isDesktop = typeof process !== 'undefined' && process?.versions?.electron !== undefined;

  const DesktopBadge = () => (
    <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">APP DESKTOP</span>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Aplicativo</h2>

      <SettingSection title="Inicialização">
        <SettingRow label={<span className="flex items-center">Abrir com o sistema {!isDesktop && <DesktopBadge />}</span>} description="Iniciar o aplicativo automaticamente ao ligar o computador">
          <Switch checked={s.startWithSystem} onChange={(v) => s.setSetting('startWithSystem', v)} disabled={!isDesktop} />
        </SettingRow>
        <SettingRow label={<span className="flex items-center">Minimizar para bandeja {!isDesktop && <DesktopBadge />}</span>} description="Ao fechar, minimizar para a área de notificação">
          <Switch checked={s.minimizeToTray} onChange={(v) => s.setSetting('minimizeToTray', v)} disabled={!isDesktop} />
        </SettingRow>
        <SettingRow label={<span className="flex items-center">Executar em segundo plano {!isDesktop && <DesktopBadge />}</span>} description="Manter o aplicativo rodando em background">
          <Switch checked={s.runInBackground} onChange={(v) => s.setSetting('runInBackground', v)} disabled={!isDesktop} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Atualizações">
        <SettingRow label="Atualizações automáticas" description="Baixar e instalar atualizações automaticamente">
          <Switch checked={s.autoUpdates} onChange={(v) => s.setSetting('autoUpdates', v)} disabled={!isDesktop} />
        </SettingRow>
        <SettingRow label="Verificar atualizações" description="Verificar se há uma nova versão disponível">
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />} disabled={!isDesktop}>Verificar</Button>
        </SettingRow>
        <SettingRow label="Versão atual" description="v2.0.0-beta">
          <span className="text-xs text-text-muted">Atualizado</span>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Diagnóstico">
        <SettingRow label="Diagnóstico" description="Executar verificação de integridade do aplicativo">
          <Button variant="ghost" size="sm" leftIcon={<Info size={14} />}>Executar</Button>
        </SettingRow>
        <SettingRow label="Relatório de problemas" description="Enviar relatório para a equipe de suporte">
          <Button variant="ghost" size="sm" leftIcon={<Bug size={14} />}>Enviar</Button>
        </SettingRow>
      </SettingSection>
    </div>
  );
};
