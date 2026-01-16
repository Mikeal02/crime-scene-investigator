import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Radio, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { LocationType } from '@/types/crime';

interface LocationAmbientAudioProps {
  location: LocationType;
  className?: string;
}

interface AudioLayer {
  type: 'base' | 'ambient' | 'effect';
  frequency: number;
  volume: number;
  modulation?: number;
  description: string;
}

const locationSoundscapes: Record<LocationType, { name: string; layers: AudioLayer[]; effects: string[] }> = {
  forest: {
    name: 'Forest',
    layers: [
      { type: 'base', frequency: 35, volume: 0.15, description: 'Deep wind through trees' },
      { type: 'ambient', frequency: 2800, volume: 0.02, modulation: 0.3, description: 'Distant bird calls' },
      { type: 'ambient', frequency: 150, volume: 0.08, modulation: 0.1, description: 'Rustling leaves' },
      { type: 'effect', frequency: 4000, volume: 0.01, modulation: 0.5, description: 'Twig snaps' },
    ],
    effects: ['owl_hoot', 'branch_crack', 'distant_howl'],
  },
  apartment: {
    name: 'Apartment',
    layers: [
      { type: 'base', frequency: 60, volume: 0.12, description: 'HVAC hum' },
      { type: 'ambient', frequency: 200, volume: 0.05, description: 'Refrigerator buzz' },
      { type: 'ambient', frequency: 3200, volume: 0.02, modulation: 0.2, description: 'Distant traffic' },
      { type: 'effect', frequency: 800, volume: 0.03, description: 'Creaking floors' },
    ],
    effects: ['door_creak', 'pipe_knock', 'muffled_voice'],
  },
  street: {
    name: 'Street',
    layers: [
      { type: 'base', frequency: 80, volume: 0.1, description: 'City drone' },
      { type: 'ambient', frequency: 400, volume: 0.06, modulation: 0.4, description: 'Traffic flow' },
      { type: 'ambient', frequency: 1200, volume: 0.03, description: 'Distant sirens' },
      { type: 'effect', frequency: 2000, volume: 0.02, description: 'Footsteps echo' },
    ],
    effects: ['car_pass', 'siren_distant', 'dog_bark'],
  },
  office: {
    name: 'Office',
    layers: [
      { type: 'base', frequency: 120, volume: 0.08, description: 'Fluorescent buzz' },
      { type: 'ambient', frequency: 55, volume: 0.1, description: 'Building hum' },
      { type: 'ambient', frequency: 3000, volume: 0.01, description: 'Keyboard clicks' },
      { type: 'effect', frequency: 600, volume: 0.02, description: 'Elevator ding' },
    ],
    effects: ['printer_whir', 'phone_ring', 'door_slam'],
  },
  factory: {
    name: 'Factory',
    layers: [
      { type: 'base', frequency: 45, volume: 0.2, description: 'Industrial machinery' },
      { type: 'ambient', frequency: 180, volume: 0.12, modulation: 0.6, description: 'Conveyor rhythm' },
      { type: 'ambient', frequency: 800, volume: 0.06, description: 'Steam vents' },
      { type: 'effect', frequency: 1500, volume: 0.04, description: 'Metal clang' },
    ],
    effects: ['machine_grind', 'steam_release', 'warning_alarm'],
  },
  hotel: {
    name: 'Hotel',
    layers: [
      { type: 'base', frequency: 50, volume: 0.08, description: 'Quiet corridor' },
      { type: 'ambient', frequency: 90, volume: 0.05, description: 'Elevator shaft' },
      { type: 'ambient', frequency: 2400, volume: 0.02, description: 'Ice machine' },
      { type: 'effect', frequency: 400, volume: 0.03, description: 'Door close' },
    ],
    effects: ['ice_machine', 'cart_roll', 'muffled_tv'],
  },
  warehouse: {
    name: 'Warehouse',
    layers: [
      { type: 'base', frequency: 30, volume: 0.18, description: 'Vast empty space' },
      { type: 'ambient', frequency: 500, volume: 0.04, modulation: 0.3, description: 'Echoing drips' },
      { type: 'ambient', frequency: 100, volume: 0.08, description: 'Wind through gaps' },
      { type: 'effect', frequency: 2500, volume: 0.02, description: 'Rat scurry' },
    ],
    effects: ['chain_rattle', 'crate_fall', 'echo_footstep'],
  },
  parking_lot: {
    name: 'Parking Lot',
    layers: [
      { type: 'base', frequency: 75, volume: 0.1, description: 'Concrete echo' },
      { type: 'ambient', frequency: 300, volume: 0.06, description: 'Car engine idle' },
      { type: 'ambient', frequency: 2000, volume: 0.03, description: 'Fluorescent flicker' },
      { type: 'effect', frequency: 1000, volume: 0.04, description: 'Key jingle' },
    ],
    effects: ['car_alarm', 'tire_squeal', 'door_echo'],
  },
  rooftop: {
    name: 'Rooftop',
    layers: [
      { type: 'base', frequency: 25, volume: 0.2, description: 'High wind' },
      { type: 'ambient', frequency: 600, volume: 0.08, modulation: 0.5, description: 'Wind gusts' },
      { type: 'ambient', frequency: 3500, volume: 0.02, description: 'Distant city' },
      { type: 'effect', frequency: 200, volume: 0.05, description: 'Ventilation fan' },
    ],
    effects: ['vent_rattle', 'pigeon_flutter', 'helicopter_distant'],
  },
  basement: {
    name: 'Basement',
    layers: [
      { type: 'base', frequency: 40, volume: 0.15, description: 'Deep underground' },
      { type: 'ambient', frequency: 350, volume: 0.06, description: 'Pipe groans' },
      { type: 'ambient', frequency: 1800, volume: 0.03, modulation: 0.2, description: 'Water drips' },
      { type: 'effect', frequency: 150, volume: 0.04, description: 'Furnace rumble' },
    ],
    effects: ['furnace_kick', 'step_creak', 'chain_drag'],
  },
  abandoned_hospital: {
    name: 'Abandoned Hospital',
    layers: [
      { type: 'base', frequency: 35, volume: 0.12, description: 'Hollow corridors' },
      { type: 'ambient', frequency: 2200, volume: 0.04, modulation: 0.4, description: 'Phantom beeps' },
      { type: 'ambient', frequency: 450, volume: 0.06, description: 'Gurney wheel' },
      { type: 'effect', frequency: 3000, volume: 0.02, description: 'Glass break' },
    ],
    effects: ['heart_monitor', 'stretcher_roll', 'whisper_echo'],
  },
  sewers: {
    name: 'Sewers',
    layers: [
      { type: 'base', frequency: 55, volume: 0.18, description: 'Water flow' },
      { type: 'ambient', frequency: 280, volume: 0.1, modulation: 0.3, description: 'Echoing drips' },
      { type: 'ambient', frequency: 1400, volume: 0.04, description: 'Rat sounds' },
      { type: 'effect', frequency: 600, volume: 0.05, description: 'Splash' },
    ],
    effects: ['splash', 'grate_scrape', 'distant_rumble'],
  },
  construction_site: {
    name: 'Construction Site',
    layers: [
      { type: 'base', frequency: 65, volume: 0.15, description: 'Wind through beams' },
      { type: 'ambient', frequency: 200, volume: 0.08, description: 'Swaying scaffolding' },
      { type: 'ambient', frequency: 2800, volume: 0.03, description: 'Distant machinery' },
      { type: 'effect', frequency: 900, volume: 0.04, description: 'Metal groan' },
    ],
    effects: ['scaffold_creak', 'debris_fall', 'cable_snap'],
  },
  cemetery: {
    name: 'Cemetery',
    layers: [
      { type: 'base', frequency: 28, volume: 0.12, description: 'Deathly quiet' },
      { type: 'ambient', frequency: 3200, volume: 0.02, modulation: 0.6, description: 'Distant crows' },
      { type: 'ambient', frequency: 180, volume: 0.05, description: 'Wind through stones' },
      { type: 'effect', frequency: 700, volume: 0.03, description: 'Gate creak' },
    ],
    effects: ['crow_caw', 'dirt_shift', 'whisper'],
  },
};

class LocationAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeLFOs: OscillatorNode[] = [];
  private isPlaying = false;
  private currentLocation: LocationType | null = null;
  private effectInterval: ReturnType<typeof setInterval> | null = null;

  initialize() {
    if (this.audioContext) return;
    
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0.2;
  }

  setVolume(value: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = value;
    }
  }

  startSoundscape(location: LocationType) {
    if (!this.audioContext || !this.masterGain) return;
    
    // Stop current soundscape if different location
    if (this.currentLocation !== location) {
      this.stopSoundscape();
    }
    
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.currentLocation = location;
    
    const soundscape = locationSoundscapes[location];
    if (!soundscape) return;

    // Create layers
    soundscape.layers.forEach(layer => {
      const osc = this.audioContext!.createOscillator();
      osc.type = layer.type === 'base' ? 'sine' : 'triangle';
      osc.frequency.value = layer.frequency;

      const gain = this.audioContext!.createGain();
      gain.gain.value = layer.volume;

      // Add modulation for ambient layers
      if (layer.modulation) {
        const lfo = this.audioContext!.createOscillator();
        lfo.frequency.value = layer.modulation;
        
        const lfoGain = this.audioContext!.createGain();
        lfoGain.gain.value = layer.frequency * 0.1;
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();
        this.activeLFOs.push(lfo);
      }

      // Add filter for texture
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = layer.type === 'effect' ? 'bandpass' : 'lowpass';
      filter.frequency.value = layer.frequency * 3;
      filter.Q.value = layer.type === 'effect' ? 2 : 0.5;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start();
      this.activeOscillators.push(osc);
    });

    // Start random effects
    this.startRandomEffects(location);
    
    // Start heartbeat for tension
    this.startHeartbeat();
  }

  private startHeartbeat() {
    if (!this.audioContext || !this.masterGain) return;

    const heartbeat = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return;

      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 45;

      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0, this.audioContext.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.start(this.audioContext.currentTime);
      osc.stop(this.audioContext.currentTime + 0.25);

      // Second beat
      setTimeout(() => {
        if (!this.isPlaying || !this.audioContext || !this.masterGain) return;
        
        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 40;

        const gain2 = this.audioContext.createGain();
        gain2.gain.setValueAtTime(0, this.audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(0.06, this.audioContext.currentTime + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        
        osc2.start(this.audioContext.currentTime);
        osc2.stop(this.audioContext.currentTime + 0.2);
      }, 180);

      const nextBeat = 1500 + Math.random() * 800;
      setTimeout(heartbeat, nextBeat);
    };

    setTimeout(heartbeat, 2000);
  }

  private startRandomEffects(location: LocationType) {
    if (!this.audioContext || !this.masterGain) return;

    const soundscape = locationSoundscapes[location];
    if (!soundscape) return;

    const playEffect = () => {
      if (!this.isPlaying || !this.audioContext || !this.masterGain) return;

      // Create noise burst for effect
      const bufferSize = this.audioContext.sampleRate * 0.15;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;

      const noiseGain = this.audioContext.createGain();
      noiseGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.04, this.audioContext.currentTime + 0.02);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800 + Math.random() * 2000;
      filter.Q.value = 1 + Math.random() * 2;

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      
      noise.start();

      const nextEffect = 8000 + Math.random() * 20000;
      setTimeout(playEffect, nextEffect);
    };

    setTimeout(playEffect, 5000);
  }

  stopSoundscape() {
    this.isPlaying = false;
    
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.activeOscillators = [];
    
    this.activeLFOs.forEach(lfo => {
      try {
        lfo.stop();
      } catch (e) {}
    });
    this.activeLFOs = [];

    if (this.effectInterval) {
      clearInterval(this.effectInterval);
      this.effectInterval = null;
    }
    
    this.currentLocation = null;
  }

  cleanup() {
    this.stopSoundscape();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  getCurrentLocation() {
    return this.currentLocation;
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export function LocationAmbientAudio({ location, className }: LocationAmbientAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([20]);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioEngineRef = useRef<LocationAudioEngine | null>(null);

  useEffect(() => {
    audioEngineRef.current = new LocationAudioEngine();
    return () => {
      audioEngineRef.current?.cleanup();
    };
  }, []);

  // Auto-update soundscape when location changes
  useEffect(() => {
    if (audioEngineRef.current && isPlaying) {
      audioEngineRef.current.startSoundscape(location);
    }
  }, [location, isPlaying]);

  const toggleAudio = useCallback(() => {
    if (!audioEngineRef.current) return;

    if (isPlaying) {
      audioEngineRef.current.stopSoundscape();
      setIsPlaying(false);
    } else {
      audioEngineRef.current.initialize();
      audioEngineRef.current.startSoundscape(location);
      setIsPlaying(true);
    }
  }, [isPlaying, location]);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value);
    audioEngineRef.current?.setVolume(value[0] / 100);
  }, []);

  const soundscape = locationSoundscapes[location];

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-2",
      className
    )}>
      {isExpanded && (
        <div className="bg-card/95 backdrop-blur-sm border border-border p-3 rounded flex flex-col gap-2 animate-fade-in min-w-[200px]">
          <div className="flex items-center gap-2 text-xs font-terminal text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{soundscape?.name || 'Unknown'} Ambience</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Radio className={cn(
              "w-3 h-3 text-muted-foreground",
              isPlaying && "text-blood animate-pulse"
            )} />
            <Slider
              value={volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs font-terminal text-muted-foreground w-8">
              {volume[0]}%
            </span>
          </div>

          {isPlaying && soundscape && (
            <div className="text-[10px] text-muted-foreground/50 font-terminal mt-1">
              Active layers: {soundscape.layers.length}
            </div>
          )}
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
          isPlaying && "border-cold/50 text-cold animate-pulse-slow"
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
