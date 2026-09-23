import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { Sparkles } from 'lucide-react';

export const SmartFeaturesTab: React.FC = () => {
  const s = useSettingsStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Recursos Inteligentes</h2>

      {/* Beta badge */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
        <Sparkles size={18} className="text-primary" />
        <p className="text-sm text-text-muted">
          Alguns recursos usam inteligência artificial e estão em <span className="font-semibold text-primary">beta</span>.
        </p>
      </div>

      <SettingSection title="Transcrição e Resumo">
        <SettingRow label="Transcrição automática de chamadas" description="Transcrever chamadas de voz automaticamente">
          <Switch checked={s.autoTranscription} onChange={(v) => s.setSetting('autoTranscription', v)} />
        </SettingRow>
        <SettingRow label="Resumo de conversas" description="Gerar resumos automáticos de conversas longas">
          <Switch checked={s.conversationSummary} onChange={(v) => s.setSetting('conversationSummary', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Tradução">
        <SettingRow label="Tradução automática" description="Traduzir mensagens em outros idiomas automaticamente">
          <Switch checked={s.autoTranslation} onChange={(v) => s.setSetting('autoTranslation', v)} />
        </SettingRow>
        <SettingRow label="Tradução de mensagens" description="Mostrar botão para traduzir mensagens individuais">
          <Switch checked={s.messageTranslation} onChange={(v) => s.setSetting('messageTranslation', v)} />
        </SettingRow>
        <SettingRow label="Legendas em tempo real" description="Exibir legendas traduzidas durante chamadas">
          <Switch checked={s.realtimeCaptions} onChange={(v) => s.setSetting('realtimeCaptions', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Filtros e Sugestões">
        <SettingRow label="Filtros inteligentes de spam" description="Detectar e filtrar mensagens de spam">
          <Switch checked={s.spamFilters} onChange={(v) => s.setSetting('spamFilters', v)} />
        </SettingRow>
        <SettingRow label="Sugestões de respostas" description="Sugerir respostas rápidas baseadas no contexto">
          <Switch checked={s.replySuggestions} onChange={(v) => s.setSetting('replySuggestions', v)} />
        </SettingRow>
        <SettingRow label="Detecção de conteúdo indesejado" description="Identificar e alertar sobre conteúdo potencialmente nocivo">
          <Switch checked={s.contentDetection} onChange={(v) => s.setSetting('contentDetection', v)} />
        </SettingRow>
      </SettingSection>
    </div>
  );
};
