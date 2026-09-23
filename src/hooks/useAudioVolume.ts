import { useState, useEffect, useRef } from 'react';

export function useAudioVolume(stream: MediaStream | null) {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream) {
      setVolume(0);
      return;
    }

    // Check if the stream actually has audio tracks
    if (stream.getAudioTracks().length === 0) {
      setVolume(0);
      return;
    }

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5; // Smooth out the volume changes
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        
        // Calculate average volume (0 to 255)
        const average = sum / bufferLength;
        
        // Normalize to a 0-1 scale (a typical speaking voice can be very quiet)
        // We'll map 0-40 to 0-1 to make it much more sensitive
        const normalized = Math.min(Math.max(average / 40, 0), 1);
        
        // Lower the noise gate threshold so it picks up softer sounds
        setVolume(normalized > 0.01 ? normalized : 0);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.error('Error initializing audio volume detection:', err);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stream]);

  return volume;
}
