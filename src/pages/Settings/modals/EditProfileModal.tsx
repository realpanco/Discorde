import React, { useState } from 'react';
import { User, Mail, Phone, AtSign, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { useAuthStore } from '../../../stores/useAuthStore';
import { authService } from '../../../services/AuthService';

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const user = useAuthStore((s) => s.user);
  const checkSession = useAuthStore((s) => s.checkSession);
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:3001/api/settings/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ displayName, username, email, phone, bio })
      });
      
      const data = await res.json();
      if (res.ok) {
        // Re-fetch session to update Zustand user object
        await checkSession();
        onClose();
      } else {
        setError(data.error || 'Falha ao atualizar perfil');
      }
    } catch (err) {
      setError('Erro de conexão ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">Editar Perfil</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="flex flex-col p-6 gap-4">
          {error && <div className="p-3 rounded-lg bg-danger/10 text-danger text-sm">{error}</div>}
          
          <Input 
            label="Nome de exibição" 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
            leftIcon={<User size={18} />} 
          />
          <Input 
            label="Nome de usuário" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            leftIcon={<AtSign size={18} />} 
          />
          <Input 
            label="E-mail" 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            leftIcon={<Mail size={18} />} 
          />
          <Input 
            label="Telefone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            leftIcon={<Phone size={18} />} 
            placeholder="(11) 99999-9999"
          />
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-muted">Sobre mim</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-background p-3 text-sm text-text outline-none transition-all focus:border-primary resize-none"
              rows={3}
              placeholder="Escreva algo sobre você..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
