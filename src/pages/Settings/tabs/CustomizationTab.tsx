import React, { useState } from 'react';
import { Smile, Sticker, Image as ImageIcon, Palette, Music, Layout, Check } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Button } from '../../../components/ui/Button/Button';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { EditProfileModal } from '../modals/EditProfileModal';
import { useAuthStore } from '../../../stores/useAuthStore';

export const CustomizationTab: React.FC = () => {
  const [showStatus, setShowStatus] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { chatBackground, setSetting } = useSettingsStore();

  const handleBackgroundChange = (url: string) => {
    setSetting('chatBackground', url);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Personalização</h2>

      <SettingSection title="Status">
        <SettingRow label="Status personalizado" description="Defina uma mensagem de status personalizada">
          <Button variant="secondary" size="sm" leftIcon={<Smile size={14} />} onClick={() => setShowStatus(true)}>Definir status</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Expressão">
        <SettingRow label="Emojis" description="Gerencie seus emojis personalizados">
          <Button variant="ghost" size="sm" leftIcon={<Smile size={14} />} disabled>Gerenciar</Button>
        </SettingRow>
        <SettingRow label="Stickers" description="Gerencie seus stickers">
          <Button variant="ghost" size="sm" leftIcon={<Sticker size={14} />} disabled>Gerenciar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Perfil Visual">
        <SettingRow label="Avatar" description="Altere sua foto de perfil">
          <Button variant="ghost" size="sm" leftIcon={<ImageIcon size={14} />} onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = async (ev) => {
                  try {
                    const store = useAuthStore.getState();
                    await store.updateProfile({ 
                      username: store.user?.username, 
                      email: store.user?.email, 
                      avatarUrl: ev.target?.result as string 
                    });
                  } catch (err) {
                    alert('Erro ao fazer upload do avatar.');
                  }
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            };
            input.click();
          }}>Alterar</Button>
        </SettingRow>
        <SettingRow label="Moldura do avatar" description="Adicione uma moldura decorativa ao avatar">
          <Button variant="ghost" size="sm" leftIcon={<Palette size={14} />} disabled>Escolher</Button>
        </SettingRow>
        <SettingRow label="Efeitos de perfil" description="Adicione efeitos animados ao seu perfil">
          <Button variant="ghost" size="sm" leftIcon={<Palette size={14} />} disabled>Configurar</Button>
        </SettingRow>
        <SettingRow label="Banner" description="Personalize o banner do seu perfil">
          <Button variant="ghost" size="sm" leftIcon={<ImageIcon size={14} />} onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              if (e.target.files && e.target.files[0]) {
                alert(`Upload do Banner: ${e.target.files[0].name}\n\n(Apenas simulação no momento)`);
              }
            };
            input.click();
          }}>Alterar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Interface">
        <SettingRow label="Plano de fundo das conversas" description="Personalize o fundo do chat">
          <div className="flex gap-2 items-center">
             <div className="flex gap-2">
                {['', 'https://images.unsplash.com/photo-1557682250-33bd709cbe85', 'https://images.unsplash.com/photo-1557683316-973673baf926'].map((url, i) => (
                  <button 
                    key={i}
                    className={`w-10 h-10 rounded-md border-2 overflow-hidden relative ${chatBackground === url ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => handleBackgroundChange(url)}
                    style={{ background: url ? `url(${url}) center/cover` : 'var(--color-surface)' }}
                  >
                    {chatBackground === url && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
             </div>
          </div>
        </SettingRow>
        <SettingRow label="Sons personalizados" description="Configure sons para diferentes eventos">
          <Button variant="ghost" size="sm" leftIcon={<Music size={14} />} disabled>Configurar</Button>
        </SettingRow>
        <SettingRow label="Presets de interface" description="Salve e carregue configurações de interface">
          <Button variant="ghost" size="sm" leftIcon={<Layout size={14} />} disabled>Gerenciar</Button>
        </SettingRow>
      </SettingSection>

      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      
      {showStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-border">
            <h3 className="text-xl font-bold text-text mb-4">Status Personalizado</h3>
            <p className="text-sm text-text-muted mb-4">O que está rolando?</p>
            <input 
              type="text" 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-text focus:outline-none focus:border-primary mb-4"
              placeholder="Estudando React..."
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowStatus(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => setShowStatus(false)}>Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
