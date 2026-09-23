import React from 'react';
import { Globe, Clock, Calendar } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Select } from '../../../components/ui/Select/Select';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { useTranslation } from '../../../components/providers/I18nProvider';

export const LanguageTab: React.FC = () => {
  const s = useSettingsStore();
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">{t('language.title', 'Idioma e Região')}</h2>

      <SettingSection title="IDIOMA">
        <SettingRow label={t('language.app_language', 'Idioma do aplicativo')} description="Idioma da interface do usuário">
          <Select
            value={s.language}
            onChange={(v) => s.setSetting('language', v as any)}
            options={[
              { value: 'pt-BR', label: 'Português (Brasil)' },
              { value: 'en-US', label: 'English (US)' },
              { value: 'es-ES', label: 'Español' },
            ]}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title="REGIÃO">
        <SettingRow label={t('language.region', 'Região')} description="Configurações regionais padrão">
          <Select
            value={s.region}
            onChange={(v) => s.setSetting('region', v as any)}
            options={[
              { value: 'BR', label: 'Brasil' },
              { value: 'US', label: 'United States' },
              { value: 'PT', label: 'Portugal' },
            ]}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title="FORMATO">
        <SettingRow label={t('language.date_format', 'Formato de data')}>
          <Select
            value={s.dateFormat}
            onChange={(v) => s.setSetting('dateFormat', v as any)}
            options={[
              { value: 'dd/mm/yyyy', label: 'DD/MM/AAAA' },
              { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
              { value: 'yyyy-mm-dd', label: 'AAAA-MM-DD' },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('language.time_format', 'Formato de hora')}>
          <Select
            value={s.timeFormat}
            onChange={(v) => s.setSetting('timeFormat', v as any)}
            options={[
              { value: '24h', label: '24 horas' },
              { value: '12h', label: '12 horas (AM/PM)' },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('language.timezone', 'Fuso horário')}>
          <Select
            value={s.timezone}
            onChange={(v) => s.setSetting('timezone', v)}
            options={[
              { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
              { value: 'America/New_York', label: 'Eastern Time (GMT-5)' },
              { value: 'Europe/London', label: 'London (GMT+0)' },
            ]}
          />
        </SettingRow>
        <SettingRow label={t('language.first_day', 'Primeiro dia da semana')}>
          <Select
            value={s.firstDayOfWeek}
            onChange={(v) => s.setSetting('firstDayOfWeek', v as any)}
            options={[
              { value: 'sunday', label: 'Domingo' },
              { value: 'monday', label: 'Segunda-feira' },
            ]}
          />
        </SettingRow>
      </SettingSection>
    </div>
  );
};
