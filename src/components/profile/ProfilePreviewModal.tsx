import React from 'react';
import { X, UserPlus, MessageSquare } from 'lucide-react';
import { Avatar } from '../ui/Avatar/Avatar';
import { Button } from '../ui/Button/Button';

interface ProfilePreviewModalProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    bannerUrl?: string;
    bio?: string;
    pronouns?: string;
    status?: string;
  };
  onClose: () => void;
  onMessage?: () => void;
  onAddFriend?: () => void;
  isSelf?: boolean;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({ 
  user, onClose, onMessage, onAddFriend, isSelf 
}) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="w-full max-w-sm rounded-2xl bg-surface border border-border shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div 
          className="h-32 bg-gradient-to-r from-primary to-blue-500 relative"
          style={user.bannerUrl ? { backgroundImage: `url(${user.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end mb-4">
            <div className="-mt-12 rounded-full border-[6px] border-surface relative bg-surface">
              <Avatar src={user.avatarUrl} size="xl" status={user.status as any} />
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-4 bg-background p-4 rounded-xl border border-border">
            <h2 className="text-xl font-bold text-text">{user.displayName || user.username}</h2>
            <span className="text-sm text-text-muted">@{user.username} {user.pronouns ? `• ${user.pronouns}` : ''}</span>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-2">Sobre Mim</h3>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
              {user.bio || "Este usuário ainda não adicionou uma bio."}
            </p>
          </div>

          {!isSelf && (
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                className="flex-1" 
                leftIcon={<UserPlus size={18} />}
                onClick={onAddFriend}
              >
                Adicionar
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1" 
                leftIcon={<MessageSquare size={18} />}
                onClick={onMessage}
              >
                Mensagem
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
