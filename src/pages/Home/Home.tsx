import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { Video, Users, Hash, PhoneCall, MessageSquare } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { useAuthStore } from '../../stores/useAuthStore';
import { authService } from '../../services/AuthService';

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  status: string;
}

export const Home: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = authService.getToken();
        const res = await fetch('http://localhost:3001/api/friends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFriends(data);
        }
      } catch (err) {
        console.error('Failed to fetch friends');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);
  
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-8 border border-primary/20">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Welcome back, {user?.displayName || 'User'}!</h1>
          <p className="text-lg text-text-muted">Ready to start connecting with your community?</p>
        </div>
        <div className="flex gap-4">
          <Button leftIcon={<Video size={20} />} size="lg" onClick={() => navigate(`/rooms/call_${Date.now()}`)}>Start Call</Button>
          <Button variant="secondary" size="lg" leftIcon={<Hash size={20} />} onClick={() => navigate('/rooms')}>Create Room</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-primary" /> Active Friends
          </h2>
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <p className="text-text-muted">Loading friends...</p>
            ) : friends.length === 0 ? (
              <Card className="flex flex-col items-center justify-center p-8 text-center bg-surface/50 border-dashed border-2">
                <p className="text-text font-medium mb-4">You haven't added any friends yet.</p>
                <Button variant="outline" onClick={() => navigate('/discover')}>Find Friends</Button>
              </Card>
            ) : (
              friends.map((friend) => (
                <Card key={friend.id} hoverable className="flex items-center justify-between p-4 bg-surface/50">
                  <div className="flex items-center gap-4">
                    <Avatar size="md" status={friend.status as any} alt={friend.displayName} src={friend.avatarUrl || undefined} />
                    <div>
                      <div className="font-medium text-white">{friend.displayName}</div>
                      <div className="text-sm text-text-muted">@{friend.username}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="text-text-muted hover:text-primary">
                      <MessageSquare size={18} />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-text-muted hover:text-primary bg-primary/10">
                      <Video size={18} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <PhoneCall size={20} className="text-primary" /> Recent Calls
          </h2>
          <div className="flex flex-col gap-3">
            <Card className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 border-dashed border-2">
              <Users size={48} className="text-text-muted mb-4 opacity-50" />
              <p className="text-text font-medium mb-4">No recent calls found</p>
              <Button variant="outline" onClick={() => navigate('/calls')}>View History</Button>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};
