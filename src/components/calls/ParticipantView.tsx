import React from 'react';
import classNames from 'classnames';
import { MicOff } from 'lucide-react';
import { Avatar } from '../ui/Avatar/Avatar';
import { VideoPlayer } from './VideoPlayer';
import { useAudioVolume } from '../../hooks/useAudioVolume';

interface ParticipantViewProps {
  stream: MediaStream | null;
  name: string;
  isLocal?: boolean;
  isMicOn?: boolean;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({ 
  stream, 
  name, 
  isLocal = false,
  isMicOn = true 
}) => {
  const volume = useAudioVolume(stream);
  const hasVideo = stream && stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled;
  
  const scale = 1 + (volume * 0.1); 
  const glow = volume > 0 ? `0 0 ${30 + (volume * 60)}px rgba(74, 222, 128, ${0.4 + (volume * 0.6)})` : 'none';
  const borderColor = volume > 0 ? `rgba(74, 222, 128, ${0.6 + (volume * 0.4)})` : '#27272a'; // tailwind border color

  return (
    <div 
      className={classNames(
        'relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-surface border-2 transition-all duration-100',
        volume > 0.01 ? 'z-10' : 'z-0'
      )}
      style={{
        transform: `scale(${scale})`,
        boxShadow: glow,
        borderColor: borderColor,
      }}
    >
      {hasVideo ? (
        <VideoPlayer stream={stream} muted={isLocal} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-surface-hover/30">
          <div style={{
            transform: `scale(${1 + (volume * 0.25)})`,
            transition: 'transform 0.1s ease-out'
          }}>
            <Avatar size="xl" alt={name} />
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-background/80 px-4 py-2 backdrop-blur-md border border-white/5">
        <span className="font-semibold text-white drop-shadow-md">{name}</span>
        {!isMicOn && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger text-white shadow-lg">
            <MicOff size={16} />
          </div>
        )}
      </div>
    </div>
  );
};
