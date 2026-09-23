import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, Tablet, LogOut, Crown, Globe } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Button } from '../../../components/ui/Button/Button';
import classNames from 'classnames';
import { authService } from '../../../services/AuthService';

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const deviceIcons = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

const DeviceCard: React.FC<{ device: DeviceInfo; onRevoke: (id: string) => void }> = ({ device, onRevoke }) => {
  const Icon = deviceIcons[device.type] || Monitor;
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={classNames('flex h-10 w-10 items-center justify-center rounded-lg', {
          'bg-primary/20 text-primary': device.isCurrent,
          'bg-surface-hover text-text-muted': !device.isCurrent,
        })}>
          <Icon size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text">{device.name}</span>
            {device.isCurrent && (
              <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">ATUAL</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Globe size={10} />
            <span>{device.location}</span>
            <span>·</span>
            <span>{new Date(device.lastActive).toLocaleString()}</span>
          </div>
        </div>
      </div>
      {!device.isCurrent && (
        <Button variant="ghost" size="sm" leftIcon={<LogOut size={14} />} onClick={() => onRevoke(device.id)}>
          Encerrar
        </Button>
      )}
    </div>
  );
};

export const DevicesTab: React.FC = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingAll, setRevokingAll] = useState(false);

  const fetchSessions = async () => {
    try {
      const token = authService.getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
      }
    } catch (e) {
      console.error('Failed to fetch sessions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (id: string) => {
    try {
      const token = authService.getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSessions(); // refresh
      }
    } catch (e) {
      console.error('Failed to revoke session', e);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    try {
      const token = authService.getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sessions`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSessions(); // refresh
      }
    } catch (e) {
      console.error('Failed to revoke all sessions', e);
    } finally {
      setRevokingAll(false);
    }
  };

  const currentDevice = devices.find(d => d.isCurrent);

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Dispositivos</h2>

      <SettingSection title="Sessões Ativas">
        {loading ? (
          <div className="p-4 text-text-muted">Carregando sessões...</div>
        ) : (
          devices.map((d) => (
            <DeviceCard key={d.id} device={d} onRevoke={handleRevoke} />
          ))
        )}
      </SettingSection>

      <SettingSection title="Gerenciamento">
        <SettingRow label="Dispositivo principal" description={currentDevice?.name || "Desconhecido"}>
          <Button variant="ghost" size="sm" leftIcon={<Crown size={14} />}>Alterar</Button>
        </SettingRow>
        <SettingRow label="Encerrar todas as sessões" description="Desconectar todos os dispositivos exceto este" danger>
          <Button 
            variant="danger" 
            size="sm" 
            leftIcon={<LogOut size={14} />} 
            onClick={handleRevokeAll}
            disabled={revokingAll || devices.length <= 1}
          >
            {revokingAll ? 'Encerrando...' : 'Encerrar todas'}
          </Button>
        </SettingRow>
      </SettingSection>
    </div>
  );
};
