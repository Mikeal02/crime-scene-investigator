import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioControllerProps {
  className?: string;
}

// Audio context for generating sounds programmatically
class HorrorAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private isPlaying = false;

  initialize() {
    if (this.audioContext) return;
    
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.15;
  }

  setVolume(value: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = value;
    }
  }

  startAmbience() {
    if (!this.audioContext || !this.masterGain || this.isPlaying) return;
    this.isPlaying = true;

    // Deep drone
    const drone = this.audioContext.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 40;
    
    const droneGain = this.audioContext.createGain();
    droneGain.gain.value = 0.3;
    
    drone.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start();
    this.activeOscillators.push(drone);

    // Unsettling high frequency
    const high = this.audioContext.createOscillator();
    high.type = 'sine';
    high.frequency.value = 2400;
    
    const highGain = this.audioContext.createGain();
    highGain.gain.value = 0.02;
    
    // LFO for the high frequency
    const lfo = this.audioContext.createOscillator();
    lfo.frequency.value = 0.1;
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(high.frequency);
    lfo.start();
    
    high.connect(highGain);
    highGain.connect(this.masterGain);
    high.start();
    this.activeOscillators.push(high, lfo);

    // Heartbeat effect
    this.startHeartbeat();

    // Random static bursts
    this.startRandomStatic();
  }

  private startHeartbeat() {
    if (!this.audioContext || !this.masterGain) return;

    const heartbeat = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return;

      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 50;

      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.3);

      // Second beat
      setTimeout(() => {
        if (!this.isPlaying || !this.audioContext || !this.masterGain) return;
        
        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 45;

        const gain2 = this.audioContext.createGain();
        gain2.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25);

        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        
        osc2.start(this.audioContext.currentTime);
        osc2.stop(this.audioContext.currentTime + 0.25);
      }, 200);

      // Random interval for unease
      const nextBeat = 1200 + Math.random() * 600;
      setTimeout(heartbeat, nextBeat);
    };

    setTimeout(heartbeat, 2000);
  }

  private startRandomStatic() {
    if (!this.audioContext || !this.masterGain) return;

    const playStatic = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return;

      // Create white noise
      const bufferSize = this.audioContext.sampleRate * 0.1;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;

      const noiseGain = this.audioContext.createGain();
      noiseGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3000;

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      
      noise.start();

      // Random next static
      const nextStatic = 5000 + Math.random() * 15000;
      setTimeout(playStatic, nextStatic);
    };

    setTimeout(playStatic, 3000);
  }

  stopAmbience() {
    this.isPlaying = false;
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeOscillators = [];
  }

  cleanup() {
    this.stopAmbience();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export function AudioController({ className }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([15]);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioEngineRef = useRef<HorrorAudioEngine | null>(null);

  useEffect(() => {
    audioEngineRef.current = new HorrorAudioEngine();
    return () => {
      audioEngineRef.current?.cleanup();
    };
  }, []);

  const toggleAudio = () => {
    if (!audioEngineRef.current) return;

    if (isPlaying) {
      audioEngineRef.current.stopAmbience();
      setIsPlaying(false);
    } else {
      audioEngineRef.current.initialize();
      audioEngineRef.current.startAmbience();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    audioEngineRef.current?.setVolume(value[0] / 100);
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-2",
      className
    )}>
      {isExpanded && (
        <div className="bg-card/95 backdrop-blur-sm border border-border p-3 rounded flex items-center gap-3 animate-fade-in">
          <Radio className="w-3 h-3 text-muted-foreground animate-pulse" />
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
          />
          <span className="text-xs font-terminal text-muted-foreground w-8">
            {volume[0]}%
          </span>
        </div>
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={toggleAudio}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !isPlaying && setIsExpanded(false)}
        className={cn(
          "border-border bg-card/95 backdrop-blur-sm",
          isPlaying && "border-blood/50 text-blood animate-pulse-slow"
        )}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
