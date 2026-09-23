import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Hash } from 'lucide-react';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { authService } from '../../services/AuthService';

interface Room {
  id: string;
  name: string;
  owner_id: string;
  category: string;
}

export const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = authService.getToken();
        const res = await fetch('http://localhost:3001/api/rooms', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (err) {
        console.error('Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    const name = prompt('Enter room name:');
    if (!name) return;
    
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:3001/api/rooms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const newRoom = await res.json();
        navigate(`/rooms/${newRoom.id}`);
      }
    } catch (err) {
      alert('Failed to create room');
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <header className="flex-shrink-0 border-b border-border bg-surface px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-text">Community Rooms</h1>
            <p className="text-text-muted">Discover and manage the spaces.</p>
          </div>
          <Button leftIcon={<PlusCircle size={20} />} onClick={createRoom}>
            Create Room
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="mb-8 w-full max-w-md">
          <Input 
            placeholder="Search rooms" 
            leftIcon={<Search size={18} />} 
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            <div className="text-text-muted col-span-full">Loading rooms...</div>
          ) : (
            rooms.map(room => (
              <Card key={room.id} hoverable className="flex flex-col p-6" onClick={() => navigate(`/rooms/${room.id}`)}>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Hash size={24} />
                  </div>
                  <div className="rounded-full bg-surface-hover px-2.5 py-1 text-xs font-semibold text-text-muted">
                    {room.category}
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-text">{room.name}</h3>
                <p className="mt-auto text-sm font-medium text-success">Join to see members</p>
              </Card>
            ))
          )}

          <Card 
            hoverable 
            className="flex min-h-[200px] flex-col items-center justify-center border-2 border-dashed border-border bg-transparent p-6 text-center hover:border-primary/50"
            onClick={createRoom}
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-hover text-text-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <PlusCircle size={32} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-text">Create a new room</h3>
            <p className="text-sm text-text-muted">Start a new community or private space.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};
