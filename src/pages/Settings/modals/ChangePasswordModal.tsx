import React, { useState } from 'react';
import { KeyRound, Lock, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { authService } from '../../../services/AuthService';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem');
      return;
    }
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = authService.getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/settings/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      } else {
        setError(data.error || 'Falha ao alterar senha');
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <KeyRound size={20} />
            </div>
            <h2 className="text-xl font-bold text-text">Alterar Senha</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="flex flex-col p-6 gap-4">
          {error && <div className="p-3 rounded-lg bg-danger/10 text-danger text-sm">{error}</div>}
          {success && <div className="p-3 rounded-lg bg-success/10 text-success text-sm">Senha alterada com sucesso!</div>}
          
          <Input 
            label="Senha atual" 
            type="password"
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            leftIcon={<Lock size={18} />} 
            required
          />
          <Input 
            label="Nova senha" 
            type="password"
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            leftIcon={<KeyRound size={18} />} 
            required
          />
          <Input 
            label="Confirmar nova senha" 
            type="password"
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            leftIcon={<KeyRound size={18} />} 
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" type="submit" disabled={isLoading || success}>
              {isLoading ? 'Salvando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
