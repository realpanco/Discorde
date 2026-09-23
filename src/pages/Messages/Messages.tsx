import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Search, Plus, UserPlus } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { Chat } from '../../components/chat/Chat';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/AuthService';

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  status: string;
}

export const Messages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'friends' | string>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [addFriendId, setAddFriendId] = useState('');
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/friends`, {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      });
      if (res.ok) {
        setFriends(await res.json());
      }
    } catch(e) {}
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFriendId.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({ friendId: addFriendId })
      });
      if (res.ok) {
        setAddFriendId('');
        fetchFriends();
        alert('Amigo adicionado!');
      } else {
        alert('Erro ao adicionar amigo');
      }
    } catch(e) {
      alert('Erro de conexão');
    }
  };

  const activeFriend = friends.find(f => f.id === activeTab);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Messages Sidebar */}
      <div className="w-60 bg-surface flex flex-col border-r border-border flex-shrink-0">
        <div className="h-12 border-b border-border flex items-center px-4 shadow-sm shrink-0">
          <div className="w-full bg-background rounded text-sm px-2 py-1 text-text-muted flex items-center gap-2">
            <Search size={14} />
            <span>Encontrar ou começar conversa</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 scroll-smooth">
          <button 
            onClick={() => setActiveTab('friends')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-surface-hover transition-colors mb-4 ${activeTab === 'friends' ? 'bg-surface-hover text-text' : 'text-text-muted'}`}
          >
            <Users size={20} />
            <span className="font-medium">Amigos</span>
          </button>
          
          <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-text-muted uppercase hover:text-text cursor-pointer transition-colors">
            <span>Mensagens Diretas</span>
            <Plus size={14} />
          </div>
          
          <div className="flex flex-col gap-0.5">
            {friends.map(friend => (
              <button
                key={friend.id}
                onClick={() => setActiveTab(friend.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-surface-hover transition-colors group ${activeTab === friend.id ? 'bg-surface-hover' : ''}`}
              >
                <div className="relative">
                  <Avatar size="sm" src={friend.avatarUrl} alt={friend.username} status={friend.status as any} />
                </div>
                <div className="flex flex-col items-start truncate flex-1">
                  <span className={`text-sm font-medium truncate ${activeTab === friend.id ? 'text-text' : 'text-text-muted group-hover:text-text'}`}>
                    {friend.displayName || friend.username}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {activeTab === 'friends' ? (
          <div className="flex-1 flex flex-col p-8">
            <div className="flex items-center gap-4 mb-8">
              <Users size={24} className="text-text-muted" />
              <h2 className="text-xl font-bold text-text">Amigos</h2>
            </div>
            
            <div className="max-w-2xl">
              <h3 className="text-sm font-semibold uppercase text-text mb-4">Adicionar Amigo</h3>
              <form onSubmit={handleAddFriend} className="flex gap-4 mb-8">
                <input 
                  type="text" 
                  className="flex-1 bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-text placeholder:text-text-muted"
                  placeholder="Você pode adicionar amigos pelo ID deles"
                  value={addFriendId}
                  onChange={e => setAddFriendId(e.target.value)}
                />
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <UserPlus size={18} />
                  Adicionar
                </button>
              </form>
              
              <h3 className="text-sm font-semibold uppercase text-text mb-4">Todos os Amigos - {friends.length}</h3>
              <div className="flex flex-col gap-2">
                {friends.length === 0 ? (
                  <div className="text-center py-12 text-text-muted bg-surface rounded-xl border border-border">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Ninguém está na sua lista de amigos ainda.</p>
                  </div>
                ) : (
                  friends.map(friend => (
                    <div key={friend.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar src={friend.avatarUrl} alt={friend.username} status={friend.status as any} />
                        <div>
                          <p className="font-medium text-text">{friend.displayName || friend.username}</p>
                          <p className="text-sm text-text-muted">@{friend.username}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab(friend.id)}
                        className="p-2 bg-surface-hover hover:bg-primary hover:text-white rounded-full transition-colors text-text-muted"
                        title="Enviar Mensagem"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : activeFriend ? (
          <>
            <div className="h-12 border-b border-border flex items-center px-4 shrink-0 shadow-sm bg-background">
              <div className="flex items-center gap-3">
                <span className="text-text-muted text-xl">@</span>
                <span className="font-bold text-text">{activeFriend.displayName || activeFriend.username}</span>
                <span className="w-2 h-2 rounded-full bg-green-500 ml-2" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {user && (
                <Chat 
                  roomId={`dm_${[user.id, activeFriend.id].sort().join('_')}`} 
                  roomName={activeFriend.username} 
                />
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
