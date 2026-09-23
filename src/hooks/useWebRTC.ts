import { useState, useEffect, useRef, useCallback } from 'react';
import { socketService } from '../services/SocketService';
import { useAuthStore } from '../stores/useAuthStore';
import { useSettingsStore } from '../stores/useSettingsStore';

interface PeerConnection {
  socketId: string;
  user: any;
  pc: RTCPeerConnection;
  stream: MediaStream | null;
}

export function useWebRTC(_roomId: string, isVideoOn: boolean, isMicOn: boolean) {
  const user = useAuthStore((state: any) => state.user);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const webcamVideoTrackRef = useRef<MediaStreamTrack | null>(null);

  const settings = useSettingsStore();
  
  // Initialize local stream
  useEffect(() => {
    async function getMedia() {
      const videoConstraints: any = {};
      if (settings.cameraDevice !== 'default') videoConstraints.deviceId = { exact: settings.cameraDevice };
      if (settings.videoQuality === '1080p') { videoConstraints.width = 1920; videoConstraints.height = 1080; }
      else if (settings.videoQuality === '720p') { videoConstraints.width = 1280; videoConstraints.height = 720; }
      else if (settings.videoQuality === '480p') { videoConstraints.width = 854; videoConstraints.height = 480; }
      if (settings.cameraFps !== 'auto') videoConstraints.frameRate = parseInt(settings.cameraFps) || 30;

      const audioConstraints: any = {
        echoCancellation: settings.echoCancellation,
        noiseSuppression: settings.noiseSuppression,
        autoGainControl: settings.autoGainControl,
      };
      if (settings.inputDevice !== 'default') audioConstraints.deviceId = { exact: settings.inputDevice };

      try {
        // Try to get both video and audio
        const stream = await navigator.mediaDevices.getUserMedia({
          video: Object.keys(videoConstraints).length > 0 ? videoConstraints : true,
          audio: audioConstraints
        });
        handleStream(stream);
      } catch (err) {
        console.warn('Failed to get video and audio, trying audio only...', err);
        try {
          // Fallback to audio only
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraints
          });
          handleStream(audioStream);
        } catch (audioErr) {
          console.error('Failed to get any local media', audioErr);
        }
      }
    }
    
    function handleStream(stream: MediaStream) {
      // Save original webcam track in case we switch back from screen sharing
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) webcamVideoTrackRef.current = videoTrack;

      // Apply initial mute/video off states
      stream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
      stream.getAudioTracks().forEach(track => track.enabled = isMicOn);

      setLocalStream(stream);
      localStreamRef.current = stream;
    }

    getMedia();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update track enabled state when toggled via buttons
  useEffect(() => {
    if (localStreamRef.current) {
      // If we are not screen sharing, apply video toggle to webcam
      if (!isScreenSharing) {
        localStreamRef.current.getVideoTracks().forEach(track => track.enabled = isVideoOn);
      }
      
      // If PTT is disabled, just use the normal mic state
      const pttEnabled = useSettingsStore.getState().pushToTalk;
      if (!pttEnabled) {
        localStreamRef.current.getAudioTracks().forEach(track => track.enabled = isMicOn);
      }
    }
  }, [isVideoOn, isMicOn, isScreenSharing]);

  // Push-To-Talk Logic
  useEffect(() => {
    const pttEnabled = useSettingsStore.getState().pushToTalk;
    const pttKey = useSettingsStore.getState().pushToTalkKey;
    
    if (!pttEnabled) return;

    // Initially mute if PTT is enabled
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // e.code maps nicely to things like "Space", "ControlLeft", etc.
      if (e.code === pttKey || e.key === pttKey || (pttKey === 'Space' && e.code === 'Space')) {
        if (localStreamRef.current && isMicOn) {
          localStreamRef.current.getAudioTracks().forEach(track => track.enabled = true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === pttKey || e.key === pttKey || (pttKey === 'Space' && e.code === 'Space')) {
        if (localStreamRef.current) {
          localStreamRef.current.getAudioTracks().forEach(track => track.enabled = false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMicOn]); // Re-bind if isMicOn changes so PTT respects the global mic mute button

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing and revert to webcam
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
        screenStreamRef.current = null;
      }

      if (webcamVideoTrackRef.current && localStreamRef.current) {
        webcamVideoTrackRef.current.enabled = isVideoOn;
        // Replace track on local stream
        const oldVideo = localStreamRef.current.getVideoTracks()[0];
        if (oldVideo) localStreamRef.current.removeTrack(oldVideo);
        localStreamRef.current.addTrack(webcamVideoTrackRef.current);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));

        // Replace track on all peer connections
        peersRef.current.forEach(peer => {
          const sender = peer.pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(webcamVideoTrackRef.current);
        });
      }
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenStreamRef.current = screenStream;

        // Listen for user stopping screen share via browser UI (e.g. "Stop sharing" button in Chrome)
        screenTrack.onended = () => {
          toggleScreenShare(); // Revert back automatically
        };

        if (localStreamRef.current) {
          // Replace track on local stream
          const oldVideo = localStreamRef.current.getVideoTracks()[0];
          if (oldVideo) localStreamRef.current.removeTrack(oldVideo);
          localStreamRef.current.addTrack(screenTrack);
          setLocalStream(new MediaStream(localStreamRef.current.getTracks()));

          // Replace track on all peer connections
          peersRef.current.forEach(peer => {
            const sender = peer.pc.getSenders().find(s => s.track?.kind === 'video');
            if (sender) sender.replaceTrack(screenTrack);
          });
        }
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Failed to start screen share', err);
      }
    }
  };

  // Helper to create a new PeerConnection
  const createPeerConnection = useCallback((targetSocketId: string, targetUser: any, _isInitiator: boolean) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.emit('webrtc-ice-candidate', {
          targetSocketId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setPeers(prev => prev.map(p => {
        if (p.socketId === targetSocketId) {
          return { ...p, stream: remoteStream };
        }
        return p;
      }));
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    const peerObj = { socketId: targetSocketId, user: targetUser, pc, stream: null };
    peersRef.current.set(targetSocketId, peerObj);
    
    setPeers(Array.from(peersRef.current.values()));

    return pc;
  }, []);

  // Socket signaling events
  useEffect(() => {
    if (!user) return;

    const handleRoomUsers = (usersInRoom: Array<{ socketId: string, user: any }>) => {
      usersInRoom.forEach(async ({ socketId, user: remoteUser }) => {
        if (!peersRef.current.has(socketId)) {
          const pc = createPeerConnection(socketId, remoteUser, true);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketService.emit('webrtc-offer', { targetSocketId: socketId, offer });
        }
      });
    };

    const handleUserJoined = async ({ user: remoteUser }: any) => {
      console.log('User joined', remoteUser.username);
    };

    const handleOffer = async ({ fromSocketId, fromUser, offer }: any) => {
      let pc = peersRef.current.get(fromSocketId)?.pc;
      if (!pc) {
        pc = createPeerConnection(fromSocketId, fromUser, false);
      }
      
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      socketService.emit('webrtc-answer', { targetSocketId: fromSocketId, answer });
    };

    const handleAnswer = async ({ fromSocketId, answer }: any) => {
      const pc = peersRef.current.get(fromSocketId)?.pc;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleIceCandidate = async ({ fromSocketId, candidate }: any) => {
      const pc = peersRef.current.get(fromSocketId)?.pc;
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('Error adding ICE candidate', e);
        }
      }
    };

    const handleUserLeft = ({ socketId }: any) => {
      const peer = peersRef.current.get(socketId);
      if (peer) {
        peer.pc.close();
        peersRef.current.delete(socketId);
        setPeers(Array.from(peersRef.current.values()));
      }
    };

    socketService.on('room-users', handleRoomUsers);
    socketService.on('user-joined', handleUserJoined);
    socketService.on('user-left', handleUserLeft);
    socketService.on('webrtc-offer', handleOffer);
    socketService.on('webrtc-answer', handleAnswer);
    socketService.on('webrtc-ice-candidate', handleIceCandidate);

    return () => {
      socketService.off('room-users', handleRoomUsers);
      socketService.off('user-joined', handleUserJoined);
      socketService.off('user-left', handleUserLeft);
      socketService.off('webrtc-offer', handleOffer);
      socketService.off('webrtc-answer', handleAnswer);
      socketService.off('webrtc-ice-candidate', handleIceCandidate);
    };
  }, [user, createPeerConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      peersRef.current.forEach(peer => peer.pc.close());
      peersRef.current.clear();
    };
  }, []);

  return { peers, localStream, isScreenSharing, toggleScreenShare };
}
