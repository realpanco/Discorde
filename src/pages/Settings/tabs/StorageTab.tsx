import React, { useEffect, useState } from 'react';
import { HardDrive, Trash2, FolderOpen, Download } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Select } from '../../../components/ui/Select/Select';
import { Button } from '../../../components/ui/Button/Button';
import { useSettingsStore } from '../../../stores/useSettingsStore';

const StorageBar: React.FC<{ label: string; used: number; total: number; color: string }> = ({ label, used, total, color }) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text">{label}</span>
        <span className="text-xs text-text-muted">{used.toFixed(2)} MB / {total.toFixed(2)} MB</span>
      </div>
      <div className="h-2 w-full rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};

export const StorageTab: React.FC = () => {
  const s = useSettingsStore();
  const [cacheUsed, setCacheUsed] = useState(0);
  const [totalQuota, setTotalQuota] = useState(500); // fallback
  const [isClearing, setIsClearing] = useState(false);

  const estimateStorage = async () => {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      setCacheUsed((estimate.usage || 0) / (1024 * 1024));
      setTotalQuota((estimate.quota || 500 * 1024 * 1024) / (1024 * 1024));
    }
  };

  useEffect(() => {
    estimateStorage();
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        
        // Also clear local/session storage if appropriate, but usually we just want Cache API
        // localStorage.clear();
      }
      await estimateStorage();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Armazenamento e Dados</h2>

      <SettingSection title="Uso de Armazenamento">
        <StorageBar label="Cache da Aplicação" used={cacheUsed} total={totalQuota} color="#6366f1" />
      </SettingSection>

      <SettingSection title="Gerenciamento">
        <SettingRow label="Limpar cache" description="Libere espaço removendo dados temporários e Service Workers">
          <Button variant="secondary" size="sm" leftIcon={<Trash2 size={14} />} onClick={handleClearCache} disabled={isClearing}>
            {isClearing ? 'Limpando...' : 'Limpar'}
          </Button>
        </SettingRow>
        <SettingRow label="Limpar mídia" description="Remova mídias baixadas e em cache local">
          <Button variant="secondary" size="sm" leftIcon={<Trash2 size={14} />}>Limpar</Button>
        </SettingRow>
        <SettingRow label="Gerenciar arquivos" description="Veja e gerencie seus arquivos baixados">
          <Button variant="ghost" size="sm" leftIcon={<FolderOpen size={14} />}>Abrir</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Economia de Dados">
        <SettingRow label="Economia de dados" description="Reduz o uso de dados nas conexões">
          <Switch checked={s.dataSaver} onChange={(v) => s.setSetting('dataSaver', v)} />
        </SettingRow>
        <SettingRow label="Qualidade de upload">
          <Select
            value={s.uploadQuality}
            onChange={(v) => s.setSetting('uploadQuality', v as any)}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
              { value: 'original', label: 'Original' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Qualidade de download">
          <Select
            value={s.downloadQuality}
            onChange={(v) => s.setSetting('downloadQuality', v as any)}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
              { value: 'original', label: 'Original' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Sincronização" description="Sincronizar dados entre dispositivos">
          <Switch checked={s.autoSync} onChange={(v) => s.setSetting('autoSync', v)} />
        </SettingRow>
      </SettingSection>
    </div>
  );
};
