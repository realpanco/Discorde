import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, muted = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { outputVolume } = useSettingsStore();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (videoRef.current && !muted) {
      videoRef.current.volume = outputVolume / 100;
    }
  }, [outputVolume, muted]);

  if (!stream) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className="h-full w-full object-cover rounded-2xl"
    />
  );
};
