import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Card } from '../../components/ui/Card/Card';
import { useAuthStore } from '../../stores/useAuthStore';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) return;
    
    try {
      await register(username, email, password);
    } catch (err) {
      // Error is handled by store
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) clearError();
    setter(e.target.value);
  };

  return (
    <Card className="w-full bg-surface p-8 shadow-xl backdrop-blur-xl border-white/10">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-text">Create an account</h1>
        <p className="text-sm text-text-muted">Join the conversation today</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-danger/10 p-3 text-sm font-medium text-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={handleInputChange(setEmail)}
          leftIcon={<Mail size={18} />}
          required
        />

        <Input
          label="Username"
          type="text"
          value={username}
          onChange={handleInputChange(setUsername)}
          leftIcon={<User size={18} />}
          required
        />
        
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={handleInputChange(setPassword)}
          leftIcon={<Lock size={18} />}
          required
        />

        <Button 
          type="submit" 
          fullWidth 
          isLoading={isLoading}
          disabled={!email || !password || !username}
          className="mt-2"
        >
          Register
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <span className="text-text-muted">Already have an account?</span>
        <Link to="/login" className="font-medium text-primary hover:underline">Log In</Link>
      </div>
    </Card>
  );
};
