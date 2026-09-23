import React from 'react';
import { Keyboard, Edit3 } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { Button } from '../../../components/ui/Button/Button';

interface ShortcutItem {
  action: string;
  keys: string;
  category: string;
}

const shortcuts: ShortcutItem[] = [
  // General
  { action: 'Abrir configurações', keys: 'Ctrl + ,', category: 'Geral' },
  { action: 'Abrir busca', keys: 'Ctrl + K', category: 'Geral' },
  { action: 'Navegar entre conversas', keys: 'Alt + ↑ / ↓', category: 'Geral' },
  // Calls
  { action: 'Atender chamada', keys: 'Ctrl + Enter', category: 'Chamadas' },
  { action: 'Recusar chamada', keys: 'Ctrl + Esc', category: 'Chamadas' },
  { action: 'Mutar microfone', keys: 'Ctrl + M', category: 'Chamadas' },
  { action: 'Ativar/desativar câmera', keys: 'Ctrl + Shift + V', category: 'Chamadas' },
  { action: 'Push-to-talk', keys: 'Space', category: 'Chamadas' },
  // Messages
  { action: 'Editar última mensagem', keys: '↑', category: 'Mensagens' },
  { action: 'Responder mensagem', keys: 'R', category: 'Mensagens' },
  { action: 'Marcar como não lida', keys: 'Ctrl + Shift + U', category: 'Mensagens' },
  { action: 'Reagir à mensagem', keys: 'Ctrl + E', category: 'Mensagens' },
];

const groupedShortcuts = shortcuts.reduce((acc, s) => {
  if (!acc[s.category]) acc[s.category] = [];
  acc[s.category].push(s);
  return acc;
}, {} as Record<string, ShortcutItem[]>);

export const ShortcutsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Atalhos de Teclado</h2>

      {Object.entries(groupedShortcuts).map(([category, items]) => (
        <SettingSection key={category} title={category}>
          {items.map((shortcut) => (
            <div key={shortcut.action} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-text">{shortcut.action}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {shortcut.keys.split(' + ').map((key, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-0.5 text-text-muted text-xs">+</span>}
                      <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-border bg-surface-hover px-1.5 text-[11px] font-medium text-text-muted">
                        {key.trim()}
                      </kbd>
                    </span>
                  ))}
                </div>
                <button className="text-text-muted hover:text-text transition-colors p-1">
                  <Edit3 size={12} />
                </button>
              </div>
            </div>
          ))}
        </SettingSection>
      ))}

      <div className="mt-4 px-4">
        <Button variant="outline" fullWidth leftIcon={<Keyboard size={16} />}>
          Redefinir todos os atalhos
        </Button>
      </div>
    </div>
  );
};
