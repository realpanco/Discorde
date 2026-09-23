import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Settings as SettingsIcon, Maximize2, LogOut, Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, MessageSquare } from 'lucide-react';
import { Chat } from '../../components/chat/Chat';
import { Button } from '../../components/ui/Button/Button';
import { useWebRTC } from '../../hooks/useWebRTC';
import { ParticipantView } from '../../components/calls/ParticipantView';
import { useAuthStore } from '../../stores/useAuthStore';
import { Settings as SettingsModal } from '../Settings/Settings';

export const RoomView: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize WebRTC connection for the room
  const { peers, localStream, isScreenSharing, toggleScreenShare } = useWebRTC(roomId || 'default', isVideoOn, isMicOn);
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        {/* Top Bar inside Room */}
        <div className="absolute top-0 left-0 right-0 z-20 flex h-16 items-center justify-between bg-gradient-to-b from-background/90 to-transparent px-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-full bg-surface-hover/80 px-4 py-2 border border-border backdrop-blur-md">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger" />
            <h2 className="text-sm font-bold tracking-wider text-text">Room: {roomId || 'Nexus Core'}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="bg-surface-hover/50 backdrop-blur-md" onClick={handleFullscreen}><Maximize2 size={20} /></Button>
            <Button 
              size="icon" 
              variant={isChatOpen ? 'primary' : 'ghost'} 
              className={classNames('backdrop-blur-md', { 'bg-surface-hover/50': !isChatOpen })}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageSquare size={20} />
            </Button>
            <Button variant="danger" leftIcon={<LogOut size={18} />} onClick={() => navigate('/rooms')}>
              Leave
            </Button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex flex-1 items-center justify-center p-6 pt-20 pb-28">
          <div className="grid w-full h-full gap-4" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gridAutoRows: 'minmax(200px, 1fr)'
          }}>
            {/* Local User */}
            <ParticipantView 
              stream={localStream} 
              name={`You (${user?.displayName})`} 
              isLocal 
              isMicOn={isMicOn} 
            />

            {/* Remote Peers */}
            {peers.map((p) => (
              <ParticipantView 
                key={p.socketId}
                stream={p.stream} 
                name={p.user?.displayName || 'User'} 
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-between gap-8 rounded-2xl bg-surface/80 px-8 py-4 border border-border shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button 
              className={classNames(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-all',
                isMicOn ? 'bg-surface-hover text-text hover:bg-surface-hover/80' : 'bg-danger text-white hover:bg-danger-hover shadow-lg shadow-danger/20'
              )}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button 
              className={classNames(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-all',
                isVideoOn ? 'bg-surface-hover text-text hover:bg-surface-hover/80' : 'bg-danger text-white hover:bg-danger-hover shadow-lg shadow-danger/20'
              )}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
            </button>
            <button 
              className={classNames(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-all',
                isScreenSharing ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-hover text-text hover:bg-surface-hover/80'
              )}
              onClick={toggleScreenShare}
            >
              <MonitorUp size={24} />
            </button>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-4">
            <button 
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-hover text-text transition-colors hover:bg-surface-hover/80"
              onClick={() => setIsSettingsOpen(true)}
            >
              <SettingsIcon size={24} />
            </button>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="absolute inset-0 z-[100] bg-background">
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        </div>
      )}

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="w-[340px] flex-shrink-0 border-l border-border bg-surface shadow-2xl flex flex-col z-20 transition-all duration-300">
          <Chat roomId={roomId || 'default'} roomName={roomId || 'General'} />
        </div>
      )}
    </div>
  );
};
