import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { useSettingsStore } from '../../../stores/useSettingsStore';

export const AccessibilityTab: React.FC = () => {
  const s = useSettingsStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Acessibilidade</h2>

      <SettingSection title="Texto e Exibição">
        <SettingRow label="Texto maior" description="Aumentar o tamanho padrão do texto">
          <Switch checked={s.largerText} onChange={(v) => s.setSetting('largerText', v)} />
        </SettingRow>
        <SettingRow label="Alto contraste" description="Aumentar o contraste entre elementos da interface">
          <Switch checked={s.highContrast} onChange={(v) => s.setSetting('highContrast', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Movimento">
        <SettingRow label="Reduzir animações" description="Minimizar animações em toda a interface">
          <Switch checked={s.reduceAnimations} onChange={(v) => s.setSetting('reduceAnimations', v)} />
        </SettingRow>
        <SettingRow label="Reduzir efeitos" description="Desativar efeitos visuais como blur e partículas">
          <Switch checked={s.reduceEffects} onChange={(v) => s.setSetting('reduceEffects', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Legendas">
        <SettingRow label="Legendas automáticas" description="Gerar legendas automaticamente para mídias">
          <Switch checked={s.autoCaptions} onChange={(v) => s.setSetting('autoCaptions', v)} />
        </SettingRow>
        <SettingRow label="Legendas em chamadas" description="Exibir legendas em tempo real durante chamadas">
          <Switch checked={s.callCaptions} onChange={(v) => s.setSetting('callCaptions', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Navegação">
        <SettingRow label="Navegação por teclado" description="Navegar pela interface usando apenas o teclado">
          <Switch checked={s.keyboardNavigation} onChange={(v) => s.setSetting('keyboardNavigation', v)} />
        </SettingRow>
        <SettingRow label="Leitor de tela" description="Otimizar a interface para leitores de tela">
          <Switch checked={s.screenReader} onChange={(v) => s.setSetting('screenReader', v)} />
        </SettingRow>
      </SettingSection>
    </div>
  );
};
