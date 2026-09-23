import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Button } from '../../../components/ui/Button/Button';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { Terminal, FileText, Wifi, MonitorSpeaker, Cpu, Globe, RotateCcw, AlertTriangle } from 'lucide-react';

export const AdvancedTab: React.FC = () => {
  const s = useSettingsStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Avançado</h2>

      {/* Warning banner */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
        <p className="text-sm text-text-muted">
          Estas configurações são para <span className="font-semibold text-amber-500">usuários avançados</span>. Alterar esses valores pode afetar o desempenho.
        </p>
      </div>

      <SettingSection title="Desenvolvimento">
        <SettingRow label="Modo desenvolvedor" description="Habilitar ferramentas e informações de desenvolvimento">
          <Switch checked={s.developerMode} onChange={(v) => s.setSetting('developerMode', v)} />
        </SettingRow>
        <SettingRow label="Logs" description="Visualizar logs do aplicativo">
          <Button variant="ghost" size="sm" leftIcon={<FileText size={14} />}>Abrir logs</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Conexão">
        <SettingRow label="Informações de conexão" description="Detalhes da conexão atual com o servidor">
          <Button variant="ghost" size="sm" leftIcon={<Wifi size={14} />}>Ver detalhes</Button>
        </SettingRow>
        <SettingRow label="WebRTC" description="Configurações de comunicação em tempo real">
          <Button variant="ghost" size="sm" leftIcon={<Globe size={14} />}>Configurar</Button>
        </SettingRow>
        <SettingRow label="Qualidade de conexão" description="Testar a qualidade da sua conexão">
          <Button variant="ghost" size="sm" leftIcon={<Wifi size={14} />}>Testar</Button>
        </SettingRow>
        <SettingRow label="Servidor/Região" description="Servidor atual: São Paulo (BR)">
          <Button variant="ghost" size="sm" leftIcon={<Globe size={14} />}>Alterar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Performance">
        <SettingRow label="Aceleração de hardware" description="Usar GPU para renderização quando disponível">
          <Switch checked={s.hardwareAcceleration} onChange={(v) => s.setSetting('hardwareAcceleration', v)} />
        </SettingRow>
        <SettingRow label="Diagnóstico de áudio/vídeo" description="Executar testes de diagnóstico de mídia">
          <Button variant="ghost" size="sm" leftIcon={<MonitorSpeaker size={14} />}>Executar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Redefinição">
        <SettingRow label="Redefinir configurações" description="Restaurar todas as configurações para os valores padrão" danger>
          <Button variant="danger" size="sm" leftIcon={<RotateCcw size={14} />} onClick={s.resetSettings}>
            Redefinir tudo
          </Button>
        </SettingRow>
      </SettingSection>
    </div>
  );
};
