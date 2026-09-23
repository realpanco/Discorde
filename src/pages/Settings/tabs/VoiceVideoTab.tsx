import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Video, Keyboard } from 'lucide-react';
import { SettingSection } from '../components/SettingSection';
import { SettingRow } from '../components/SettingRow';
import { Switch } from '../../../components/ui/Switch/Switch';
import { Select } from '../../../components/ui/Select/Select';
import { Slider } from '../../../components/ui/Slider/Slider';
import { Button } from '../../../components/ui/Button/Button';
import { useSettingsStore } from '../../../stores/useSettingsStore';

export const VoiceVideoTab: React.FC = () => {
  const s = useSettingsStore();
  const [micTesting, setMicTesting] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  // Audio Output Test
  const handleTestAudio = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      
      // Apply output volume setting (0 to 1)
      gain.gain.setValueAtTime((s.outputVolume / 100), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch (e) {
      console.error("Audio test failed", e);
    }
  };

  // Mic Test
  const startMicTest = async () => {
    if (micTesting) {
      stopMicTest();
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      
      const source = ctx.createMediaStreamSource(stream);
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      analyzerRef.current = analyzer;
      
      setMicTesting(true);
      
      const updateLevel = () => {
        if (!analyzerRef.current) return;
        const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Apply input volume setting (0 to 100)
        const adjustedLevel = Math.min((average / 255) * 100 * (s.inputVolume / 100), 100);
        
        setMicLevel(adjustedLevel);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      
      updateLevel();
    } catch (e) {
      console.error("Mic test failed", e);
    }
  };

  const stopMicTest = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setMicTesting(false);
    setMicLevel(0);
  };

  useEffect(() => {
    return () => stopMicTest(); // cleanup
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-6">Voz e Vídeo</h2>

      <SettingSection title="Dispositivos de Entrada">
        <SettingRow label="Microfone padrão">
          <Select
            value={s.inputDevice}
            onChange={(v) => s.setSetting('inputDevice', v)}
            options={[
              { value: 'default', label: 'Padrão do sistema' },
              { value: 'mic1', label: 'Microfone (Realtek)' },
              { value: 'mic2', label: 'Microfone (USB)' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Volume de entrada">
          <div className="w-44">
            <Slider
              value={s.inputVolume}
              onChange={(v) => s.setSetting('inputVolume', v)}
            />
          </div>
        </SettingRow>
        <SettingRow label="Testar microfone" description="Verifique se seu microfone está funcionando">
          <div className="flex items-center gap-3">
            {micTesting && (
              <div className="h-2 w-24 rounded-full bg-surface-hover overflow-hidden">
                <div className="h-full bg-success transition-all duration-75" style={{ width: `${micLevel}%` }} />
              </div>
            )}
            <Button 
              variant={micTesting ? 'primary' : 'secondary'} 
              size="sm" 
              leftIcon={<Mic size={14} />} 
              onClick={startMicTest}
            >
              {micTesting ? 'Parar Teste' : 'Testar'}
            </Button>
          </div>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Dispositivos de Saída">
        <SettingRow label="Alto-falante padrão">
          <Select
            value={s.outputDevice}
            onChange={(v) => s.setSetting('outputDevice', v)}
            options={[
              { value: 'default', label: 'Padrão do sistema' },
              { value: 'speaker1', label: 'Alto-falantes (Realtek)' },
              { value: 'speaker2', label: 'Fones de ouvido (Bluetooth)' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Volume de saída">
          <div className="w-44">
            <Slider
              value={s.outputVolume}
              onChange={(v) => s.setSetting('outputVolume', v)}
            />
          </div>
        </SettingRow>
        <SettingRow label="Testar áudio" description="Reproduza um som de teste">
          <Button variant="secondary" size="sm" leftIcon={<Volume2 size={14} />} onClick={handleTestAudio}>Testar</Button>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Processamento de Voz">
        <SettingRow label="Supressão de ruído" description="Remove ruídos de fundo automaticamente">
          <Switch checked={s.noiseSuppression} onChange={(v) => s.setSetting('noiseSuppression', v)} />
        </SettingRow>
        <SettingRow label="Cancelamento de eco" description="Evita eco durante chamadas">
          <Switch checked={s.echoCancellation} onChange={(v) => s.setSetting('echoCancellation', v)} />
        </SettingRow>
        <SettingRow label="Controle automático de ganho" description="Ajusta o volume automaticamente">
          <Switch checked={s.autoGainControl} onChange={(v) => s.setSetting('autoGainControl', v)} />
        </SettingRow>
        <SettingRow label="Sensibilidade automática" description="Detecta quando você está falando">
          <Switch checked={s.autoSensitivity} onChange={(v) => s.setSetting('autoSensitivity', v)} />
        </SettingRow>
        <SettingRow label="Detecção de voz" description="Ativa o microfone quando detecta voz">
          <Switch checked={s.voiceDetection} onChange={(v) => s.setSetting('voiceDetection', v)} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Push-to-Talk">
        <SettingRow label="Push-to-talk" description="Pressione uma tecla para falar">
          <Switch checked={s.pushToTalk} onChange={(v) => s.setSetting('pushToTalk', v)} />
        </SettingRow>
        {s.pushToTalk && (
          <SettingRow label="Atalho" description="Tecla usada para push-to-talk">
            <Button variant="outline" size="sm" leftIcon={<Keyboard size={14} />}>
              {s.pushToTalkKey}
            </Button>
          </SettingRow>
        )}
      </SettingSection>

      <SettingSection title="Qualidade">
        <SettingRow label="Qualidade de áudio">
          <Select
            value={s.audioQuality}
            onChange={(v) => s.setSetting('audioQuality', v as any)}
            options={[
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Qualidade de vídeo">
          <Select
            value={s.videoQuality}
            onChange={(v) => s.setSetting('videoQuality', v as any)}
            options={[
              { value: 'auto', label: 'Automático' },
              { value: '360p', label: '360p' },
              { value: '480p', label: '480p' },
              { value: '720p', label: '720p' },
              { value: '1080p', label: '1080p' },
            ]}
          />
        </SettingRow>
        <SettingRow label="FPS da câmera">
          <Select
            value={s.cameraFps}
            onChange={(v) => s.setSetting('cameraFps', v as any)}
            options={[
              { value: '15', label: '15 FPS' },
              { value: '30', label: '30 FPS' },
              { value: '60', label: '60 FPS' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Resolução máxima">
          <Select
            value={s.maxResolution}
            onChange={(v) => s.setSetting('maxResolution', v as any)}
            options={[
              { value: '480p', label: '480p' },
              { value: '720p', label: '720p' },
              { value: '1080p', label: '1080p' },
              { value: '1440p', label: '1440p' },
              { value: '4k', label: '4K' },
            ]}
          />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Câmera">
        <SettingRow label="Câmera padrão">
          <Select
            value={s.cameraDevice}
            onChange={(v) => s.setSetting('cameraDevice', v)}
            options={[
              { value: 'default', label: 'Padrão do sistema' },
              { value: 'cam1', label: 'Câmera integrada' },
              { value: 'cam2', label: 'Webcam USB' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Desfoque de fundo" description="Desfoca o fundo durante videochamadas">
          <Switch checked={s.backgroundBlur} onChange={(v) => s.setSetting('backgroundBlur', v)} />
        </SettingRow>
        <SettingRow label="Câmera virtual" description="Permite usar aplicativos de câmera virtual">
          <Switch checked={s.virtualCamera} onChange={(v) => s.setSetting('virtualCamera', v)} />
        </SettingRow>
        <SettingRow label="Preview da câmera" description="Visualize como sua câmera aparecerá">
          <Button variant="secondary" size="sm" leftIcon={<Video size={14} />}>Abrir preview</Button>
        </SettingRow>
      </SettingSection>
    </div>
  );
};
