import React from 'react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Select } from '../../../components/ui/Select/Select';
import { useSettingsStore } from '../../../stores/useSettingsStore';

export const ChatsTab: React.FC = () => {
  const s = useSettingsStore();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Conversas</h2>

      <SettingSection title="Envio de Mensagens">
        <SettingRow label="Enter envia mensagem" description="Pressionar Enter envia a mensagem (desativado = quebra de linha)">
          <Switch checked={s.enterSendsMessage} onChange={(v) => s.setSetting('enterSendsMessage', v)} />
        </SettingRow>
        <SettingRow label="Editar mensagens" description="Permitir edição de mensagens enviadas">
          <Switch checked={s.editMessages} onChange={(v) => s.setSetting('editMessages', v)} />
        </SettingRow>
        <SettingRow label="Confirmação de exclusão" description="Mostrar confirmação antes de excluir uma mensagem">
          <Switch checked={s.showDeleteConfirmation} onChange={(v) => s.setSetting('showDeleteConfirmation', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Conteúdo">
        <SettingRow label="Prévia de links" description="Mostrar previews de links compartilhados">
          <Switch checked={s.linkPreview} onChange={(v) => s.setSetting('linkPreview', v)} />
        </SettingRow>
        <SettingRow label="Reprodução automática de vídeos" description="Reproduzir vídeos automaticamente no chat">
          <Switch checked={s.autoplayVideos} onChange={(v) => s.setSetting('autoplayVideos', v)} />
        </SettingRow>
        <SettingRow label="Reprodução automática de GIFs" description="Reproduzir GIFs automaticamente">
          <Switch checked={s.autoplayGifs} onChange={(v) => s.setSetting('autoplayGifs', v)} />
        </SettingRow>
        <SettingRow label="Abrir links externamente" description="Abrir links no navegador padrão">
          <Switch checked={s.openLinksExternally} onChange={(v) => s.setSetting('openLinksExternally', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Downloads e Mídia">
        <SettingRow label="Downloads automáticos" description="Baixar mídia automaticamente nas conversas">
          <Switch checked={s.autoDownload} onChange={(v) => s.setSetting('autoDownload', v)} />
        </SettingRow>
        <SettingRow label="Qualidade de mídia" description="Qualidade padrão de imagens e vídeos enviados">
          <Select
            value={s.mediaQuality}
            onChange={(v) => s.setSetting('mediaQuality', v as any)}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
              { value: 'original', label: 'Original' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Compactar imagens" description="Comprimir imagens antes de enviar para economizar dados">
          <Switch checked={s.compressImages} onChange={(v) => s.setSetting('compressImages', v)} />
        </SettingRow>
      </SettingSection>
    </div>
  );
};
