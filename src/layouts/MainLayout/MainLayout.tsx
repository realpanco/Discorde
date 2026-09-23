import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Home, Compass, PhoneCall, MessageSquare, Users, Calendar, LayoutGrid, Bell, Settings } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { useAuthStore } from '../../stores/useAuthStore';

export const MainLayout: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/discover', icon: Compass, label: 'Discover' },
    { to: '/calls', icon: PhoneCall, label: 'Calls' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/friends', icon: Users, label: 'Friends' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/rooms', icon: LayoutGrid, label: 'Rooms' },
  ];

  const navItemClass = ({ isActive }: { isActive: boolean }) => classNames(
    'relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 group hover:rounded-[10px]',
    {
      'bg-primary text-white rounded-[10px]': isActive,
      'bg-surface-hover text-text-muted hover:bg-primary hover:text-white': !isActive
    }
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[72px] flex-col items-center gap-4 border-r border-border bg-surface py-4 flex-shrink-0 z-10 shadow-lg">
        {/* Logo */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white transition-all hover:rounded-[10px] cursor-pointer shadow-lg shadow-primary/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="h-[2px] w-8 rounded-full bg-border" />

        {/* Top Nav Items */}
        <nav className="flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto no-scrollbar scroll-smooth">
          {navItems.map((item) => (
            <div key={item.to} className="relative group flex items-center justify-center">
              {/* Active Indicator Line */}
              <NavLink to={item.to} className={({isActive}) => classNames(
                  "absolute -left-3 h-2 w-1 rounded-r-full bg-primary transition-all duration-300",
                  { "h-10 scale-100": isActive, "scale-0 group-hover:h-5 group-hover:scale-100": !isActive }
                )} 
              />
              <NavLink
                to={item.to}
                className={navItemClass}
                title={item.label}
              >
                <item.icon size={24} strokeWidth={2} />
              </NavLink>
            </div>
          ))}
        </nav>

        {/* Bottom Nav Items */}
        <div className="flex flex-col items-center gap-2 mt-auto">
          <NavLink to="/notifications" className={navItemClass}>
            <Bell size={24} strokeWidth={2} />
          </NavLink>
          <NavLink to="/settings" className={navItemClass}>
            <Settings size={24} strokeWidth={2} />
          </NavLink>
          
          <div className="h-[2px] w-8 rounded-full bg-border my-1" />
          
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar size="md" status={user?.status || 'online'} alt={user?.displayName || 'User'} />
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-background">
        <Outlet />
      </main>
    </div>
  );
};
