import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { authService } from '../../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';

interface DeleteAccountModalProps {
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('A senha é obrigatória para excluir a conta');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // First, verify password by attempting a login or a specific verify endpoint
      // To keep it simple, we'll try to login with the current user's email
      const user = useAuthStore.getState().user;
      if (!user) return;
      
      const loginRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password })
      });
      
      if (!loginRes.ok) {
        setError('Senha incorreta');
        setIsLoading(false);
        return;
      }

      // Password is correct, proceed with deletion
      const token = authService.getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Account deleted successfully
        logout();
        navigate('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Falha ao excluir conta');
      }
    } catch (err) {
      setError('Erro de conexão ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-danger/30 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/20 text-danger">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-xl font-bold text-text">Excluir Conta</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleDelete} className="flex flex-col p-6 gap-4">
          <p className="text-sm text-text-muted">
            Tem certeza de que deseja excluir sua conta? Esta ação é <strong className="text-danger">irreversível</strong> e apagará permanentemente todos os seus dados, mensagens, e salas criadas.
          </p>
          
          {error && <div className="p-3 rounded-lg bg-danger/10 text-danger text-sm">{error}</div>}
          
          <Input 
            label="Digite sua senha para confirmar" 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Senha atual"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="danger" type="submit" disabled={isLoading} leftIcon={<Trash2 size={16} />}>
              {isLoading ? 'Excluindo...' : 'Excluir permanentemente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
