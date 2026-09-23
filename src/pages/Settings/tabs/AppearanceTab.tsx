import React from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Select } from '../../../components/ui/Select/Select';
import { Slider } from '../../../components/ui/Slider/Slider';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import classNames from 'classnames';

const accentColors = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
];

export const AppearanceTab: React.FC = () => {
  const s = useSettingsStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Aparência</h2>

      <SettingSection title="Tema">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: 'light', label: 'Claro', icon: Sun },
              { value: 'dark', label: 'Escuro', icon: Moon },
              { value: 'system', label: 'Sistema', icon: Monitor },
            ] as const).map((t) => (
              <button
                key={t.value}
                onClick={() => s.setSetting('theme', t.value)}
                className={classNames(
                  'flex flex-col items-center gap-2 rounded-xl p-4 border-2 transition-all',
                  {
                    'border-primary bg-primary/10': s.theme === t.value,
                    'border-border hover:border-text-muted': s.theme !== t.value,
                  }
                )}
              >
                <t.icon size={24} className={s.theme === t.value ? 'text-primary' : 'text-text-muted'} />
                <span className={classNames('text-sm font-medium', {
                  'text-primary': s.theme === t.value,
                  'text-text-muted': s.theme !== t.value,
                })}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Cor de Destaque">
        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            {accentColors.map((c) => (
              <button
                key={c.value}
                onClick={() => s.setSetting('accentColor', c.value)}
                className={classNames(
                  'h-10 w-10 rounded-full transition-all border-2 hover:scale-110',
                  {
                    'border-white scale-110 ring-2 ring-white/30': s.accentColor === c.value,
                    'border-transparent': s.accentColor !== c.value,
                  }
                )}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Tamanho e Layout">
        <SettingRow label="Tamanho da fonte" description={`${s.fontSize}px`}>
          <div className="w-40">
            <Slider
              value={s.fontSize}
              onChange={(v) => s.setSetting('fontSize', v)}
              min={12}
              max={20}
              step={1}
              suffix="px"
            />
          </div>
        </SettingRow>
        <SettingRow label="Escala da interface" description={`${s.interfaceScale}%`}>
          <div className="w-40">
            <Slider
              value={s.interfaceScale}
              onChange={(v) => s.setSetting('interfaceScale', v)}
              min={80}
              max={120}
              step={5}
            />
          </div>
        </SettingRow>
        <SettingRow label="Densidade da interface">
          <Select
            value={s.interfaceDensity}
            onChange={(v) => s.setSetting('interfaceDensity', v as any)}
            options={[
              { value: 'compact', label: 'Compacta' },
              { value: 'comfortable', label: 'Confortável' },
              { value: 'spacious', label: 'Espaçosa' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Layout das conversas">
          <Select
            value={s.chatLayout}
            onChange={(v) => s.setSetting('chatLayout', v as any)}
            options={[
              { value: 'cozy', label: 'Aconchegante' },
              { value: 'compact', label: 'Compacto' },
            ]}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Efeitos Visuais">
        <SettingRow label="Animações" description="Ative animações de transição na interface">
          <Switch checked={s.animations} onChange={(v) => s.setSetting('animations', v)} />
        </SettingRow>
        <SettingRow label="Efeitos visuais" description="Efeitos avançados como partículas e brilho">
          <Switch checked={s.visualEffects} onChange={(v) => s.setSetting('visualEffects', v)} />
        </SettingRow>
        <SettingRow label="Transparência" description="Habilitar efeitos de transparência e blur">
          <Switch checked={s.transparency} onChange={(v) => s.setSetting('transparency', v)} />
        </SettingRow>
        <SettingRow label="Modo compacto" description="Reduz o espaçamento entre elementos">
          <Switch checked={s.compactMode} onChange={(v) => s.setSetting('compactMode', v)} />
        </SettingRow>
        <SettingRow label="Mostrar avatares" description="Exibir avatares nas listas e conversas">
          <Switch checked={s.showAvatars} onChange={(v) => s.setSetting('showAvatars', v)} />
        </SettingRow>
      </SettingSection>
    </div>
  );
};
