import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Search, Compass, Gamepad2, Music, BookOpen, Coffee, Cpu, Hash, Users, Radio } from 'lucide-react';
import { Input } from '../../components/ui/Input/Input';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui/Button/Button';
import { authService } from '../../services/AuthService';

const CATEGORIES = [
  { id: 'all', label: 'All Rooms', icon: Compass },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'study', label: 'Study', icon: BookOpen },
  { id: 'social', label: 'Social', icon: Coffee },
  { id: 'tech', label: 'Technology', icon: Cpu },
  { id: 'events', label: 'Events', icon: Radio },
];

interface Room {
  id: string;
  name: string;
  owner_id: string;
  category: string;
  is_private: number;
}

export const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = authService.getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/rooms`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter out private rooms for discover
          setRooms(data.filter((r: Room) => !r.is_private));
        }
      } catch (err) {
        console.error('Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesCategory = activeCategory === 'all' || room.category === activeCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <header className="flex-shrink-0 border-b border-border bg-surface px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-text">Discover Public Rooms</h1>
            <p className="text-text-muted">Find your community and join the conversation.</p>
          </div>
          
          <div className="w-full md:w-80">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for rooms..."
              leftIcon={<Search size={20} />}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-border bg-surface/50 p-6 hidden md:block">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Categories</h3>
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                className={classNames(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activeCategory === category.id 
                    ? 'bg-primary text-white' 
                    : 'text-text hover:bg-surface-hover hover:text-white'
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon size={18} />
                <span>{category.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">
              {activeCategory === 'all' ? 'Featured Rooms' : CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading ? (
              <div className="text-text-muted col-span-full">Loading rooms...</div>
            ) : filteredRooms.map(room => (
              <Card key={room.id} hoverable className="flex flex-col">
                <div className="relative aspect-video w-full overflow-hidden bg-surface-hover flex items-center justify-center">
                   <Hash size={48} className="text-primary/50" />
                </div>
                
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Hash size={14} />
                    <span className="uppercase tracking-wider">{room.category}</span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-text line-clamp-1">{room.name}</h3>
                  <p className="mb-4 text-sm text-text-muted">Hosted by User (ID: {room.owner_id.substring(0, 5)}...)</p>
                  
                  <Button fullWidth onClick={() => navigate(`/rooms/${room.id}`)}>
                    Join Room
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {!isLoading && filteredRooms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Compass size={48} className="mb-4 text-text-muted opacity-50" />
              <h3 className="mb-2 text-xl font-bold text-text">No rooms found</h3>
              <p className="mb-6 text-text-muted">Try adjusting your search or category filter.</p>
              <Button 
                variant="outline" 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
