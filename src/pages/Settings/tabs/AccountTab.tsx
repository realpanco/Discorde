import React, { useState } from 'react';
import { User, Mail, Phone, KeyRound, Shield, Smartphone, Link2, BadgeCheck, Trash2, Camera, Edit3 } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { Avatar } from '../../../components/ui/Avatar/Avatar';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { EditProfileModal } from '../modals/EditProfileModal';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';
import { DeleteAccountModal } from '../modals/DeleteAccountModal';

export const AccountTab: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { developerMode, setSetting } = useSettingsStore();
  
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Conta</h2>

      {/* Profile Card */}
      <div className="rounded-xl border border-border overflow-hidden mb-8">
        {/* Banner */}
        <div 
          className="h-28 bg-gradient-to-r from-primary to-blue-500 relative group cursor-pointer"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              if (e.target.files && e.target.files[0]) {
                alert(`Upload do Banner: ${e.target.files[0].name}\n\n(Simulação concluída com sucesso!)`);
              }
            };
            input.click();
          }}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        {/* Avatar & Info */}
        <div className="bg-surface/50 px-6 pb-6 relative">
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div 
                className="-mt-10 relative group cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = async (ev) => {
                        try {
                          await useAuthStore.getState().updateProfile({ 
                            username: user?.username, 
                            email: user?.email, 
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
                }}
              >
                <div className="rounded-full border-4 border-surface">
                  <Avatar size="xxl" alt={user?.displayName || 'User'} src={user?.avatarUrl} status={user?.status} />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="mb-1">
                <h3 className="text-xl font-bold text-text">{user?.displayName || 'Usuário'}</h3>
                <p className="text-sm text-text-muted">@{user?.username || 'usuario'}</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" leftIcon={<Edit3 size={14} />} onClick={() => setShowEditProfile(true)}>
              Editar perfil
            </Button>
          </div>
        </div>
      </div>

      <SettingSection title="Informações do Perfil">
        <SettingRow label="Nome de usuário" description={`@${user?.username || 'usuario'}`}>
          <Button variant="ghost" size="sm" onClick={() => setShowEditProfile(true)}>Editar</Button>
        </SettingRow>
        <SettingRow label="Nome de exibição" description={user?.displayName || 'Não definido'}>
          <Button variant="ghost" size="sm" onClick={() => setShowEditProfile(true)}>Editar</Button>
        </SettingRow>
        <SettingRow label="E-mail" description={user?.email || 'email@exemplo.com'}>
          <Button variant="ghost" size="sm" onClick={() => setShowEditProfile(true)}>Editar</Button>
        </SettingRow>
        <SettingRow label="Telefone" description={user?.phone || 'Não vinculado'}>
          <Button variant="ghost" size="sm" leftIcon={<Phone size={14} />} onClick={() => setShowEditProfile(true)}>
            {user?.phone ? 'Editar' : 'Adicionar'}
          </Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Senha e Autenticação">
        <SettingRow label="Alterar senha" description="Recomendamos usar uma senha forte e única">
          <Button variant="secondary" size="sm" leftIcon={<KeyRound size={14} />} onClick={() => setShowChangePassword(true)}>Alterar</Button>
        </SettingRow>
        <SettingRow label="Autenticação em 2 fatores" description="Adicione uma camada extra de segurança">
          <Switch checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Sessões e Dispositivos">
        <SettingRow label="Modo Desenvolvedor" description="Exibir IDs de ferramentas no cliente">
          <Switch checked={developerMode} onChange={(v) => setSetting('developerMode', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Zona de Perigo">
        <SettingRow label="Excluir conta" description="Exclua permanentemente sua conta e todos os dados" danger>
          <Button variant="danger" size="sm" leftIcon={<Trash2 size={14} />} onClick={() => setShowDeleteAccount(true)}>Excluir</Button>
        </SettingRow>
      </SettingSection>

      {/* Modals */}
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}
      {showDeleteAccount && <DeleteAccountModal onClose={() => setShowDeleteAccount(false)} />}
    </div>
  );
};
