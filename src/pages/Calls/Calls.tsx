import React, { useState, useEffect } from 'react';
import { Phone, PhoneMissed, PhoneCall, Clock, Video } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { authService } from '../../services/AuthService';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTranslation } from '../../components/providers/I18nProvider';

interface Call {
  id: string;
  roomId: string;
  status: string;
  duration: number;
  createdAt: string;
  callerId: string;
  callerUsername: string;
  callerName: string;
  callerAvatar: string;
}

export const Calls: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const user = useAuthStore(s => s.user);
  const { formatDate } = useTranslation();

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/calls`, {
          headers: { Authorization: `Bearer ${authService.getToken()}` }
        });
        if (res.ok) {
          setCalls(await res.json());
        }
      } catch(e) {}
    };
    fetchCalls();
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="h-12 border-b border-border flex items-center px-4 shrink-0 shadow-sm bg-surface">
        <h2 className="font-bold text-text flex items-center gap-2">
          <Phone size={20} /> Histórico de Chamadas
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {calls.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-text-muted bg-surface rounded-xl border border-border p-12">
              <PhoneCall size={64} className="mb-6 opacity-50" />
              <h3 className="text-xl font-bold text-text mb-2">Nenhuma chamada recente</h3>
              <p>O seu histórico de chamadas em salas ou DMs aparecerá aqui.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {calls.map(call => {
                const isIncoming = call.callerId !== user?.id;
                return (
                  <div key={call.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Avatar src={call.callerAvatar} alt={call.callerUsername} />
                      <div>
                        <p className="font-medium text-text">
                          {isIncoming ? (call.callerName || call.callerUsername) : 'Você ligou'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          {isIncoming ? <PhoneIncomingIcon /> : <PhoneOutgoingIcon />}
                          <span>{formatDate(new Date(call.createdAt).getTime())}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {call.duration > 0 && (
                        <div className="flex items-center gap-1 text-text-muted text-sm bg-background px-3 py-1 rounded-full">
                          <Clock size={14} />
                          {Math.floor(call.duration / 60)}m {call.duration % 60}s
                        </div>
                      )}
                      <button 
                        onClick={() => window.location.href = `/rooms/${call.roomId}`}
                        className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full transition-colors"
                        title="Juntar-se à sala novamente"
                      >
                        <Video size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PhoneIncomingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
    <polyline points="16 2 16 8 22 8"></polyline>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const PhoneOutgoingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
    <polyline points="22 16 22 22 16 22"></polyline>
    <line x1="11" y1="13" x2="22" y2="22"></line>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
