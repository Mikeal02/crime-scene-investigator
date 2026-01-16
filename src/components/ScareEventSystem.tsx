import { useEffect, useState, useCallback } from 'react';
import { Skull, Eye, AlertTriangle, Radio, Zap } from 'lucide-react';

interface ScareEvent {
  id: string;
  type: 'flash' | 'whisper' | 'glitch' | 'apparition' | 'static' | 'subliminal';
  message?: string;
  duration: number;
  position?: { x: number; y: number };
}

interface ScareEventSystemProps {
  enabled?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  onScare?: (event: ScareEvent) => void;
}

const scareMessages = [
  "THEY'RE WATCHING",
  "BEHIND YOU",
  "DON'T LOOK",
  "IT KNOWS",
  "HELP ME",
  "NOT ALONE",
  "REMEMBER",
  "GUILTY",
  "TOO LATE",
  "RUN",
  "LIAR",
  "TRUTH HURTS",
  "YOU'RE NEXT",
  "CAN'T ESCAPE",
  "WRONG PATH",
];

const subliminalImages = [
  '👁️', '💀', '🩸', '⚰️', '🔪', '☠️'
];

export function ScareEventSystem({ enabled = true, intensity = 'medium', onScare }: ScareEventSystemProps) {
  const [activeEvent, setActiveEvent] = useState<ScareEvent | null>(null);
  const [screenFlash, setScreenFlash] = useState(false);
  const [staticOverlay, setStaticOverlay] = useState(false);
  const [glitchText, setGlitchText] = useState<string | null>(null);
  const [apparition, setApparition] = useState<{ x: number; y: number } | null>(null);
  const [subliminal, setSubliminal] = useState<string | null>(null);

  const getInterval = () => {
    switch (intensity) {
      case 'low': return 45000 + Math.random() * 60000; // 45-105 seconds
      case 'medium': return 25000 + Math.random() * 35000; // 25-60 seconds
      case 'high': return 10000 + Math.random() * 20000; // 10-30 seconds
    }
  };

  const triggerScareEvent = useCallback(() => {
    if (!enabled) return;

    const eventTypes: ScareEvent['type'][] = ['flash', 'whisper', 'glitch', 'apparition', 'static', 'subliminal'];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const event: ScareEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message: scareMessages[Math.floor(Math.random() * scareMessages.length)],
      duration: type === 'subliminal' ? 50 : type === 'flash' ? 100 : 2000,
      position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    };

    setActiveEvent(event);
    onScare?.(event);

    switch (type) {
      case 'flash':
        setScreenFlash(true);
        setTimeout(() => setScreenFlash(false), event.duration);
        break;
      
      case 'static':
        setStaticOverlay(true);
        setTimeout(() => setStaticOverlay(false), event.duration);
        break;
      
      case 'glitch':
        setGlitchText(event.message || null);
        setTimeout(() => setGlitchText(null), event.duration);
        break;
      
      case 'apparition':
        setApparition(event.position || null);
        setTimeout(() => setApparition(null), event.duration);
        break;
      
      case 'subliminal':
        setSubliminal(subliminalImages[Math.floor(Math.random() * subliminalImages.length)]);
        setTimeout(() => setSubliminal(null), event.duration);
        break;
      
      case 'whisper':
        // Just visual whisper effect
        setGlitchText(event.message || null);
        setTimeout(() => setGlitchText(null), event.duration);
        break;
    }

    setTimeout(() => setActiveEvent(null), event.duration);
  }, [enabled, onScare]);

  useEffect(() => {
    if (!enabled) return;

    // Initial delay before first scare
    const initialDelay = setTimeout(() => {
      triggerScareEvent();
    }, 15000 + Math.random() * 15000);

    // Recurring scares
    const scheduleNextScare = () => {
      return setTimeout(() => {
        triggerScareEvent();
        clearTimeout(scheduleNextScare());
      }, getInterval());
    };

    let scareTimeout = scheduleNextScare();

    // Random mouse movement triggers (rare)
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < 0.0005 && enabled) { // 0.05% chance per mouse move
        triggerScareEvent();
      }
    };

    // Random click triggers (very rare)
    const handleClick = () => {
      if (Math.random() < 0.01 && enabled) { // 1% chance per click
        triggerScareEvent();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(scareTimeout);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, [enabled, intensity, triggerScareEvent]);

  if (!enabled) return null;

  return (
    <>
      {/* Screen flash */}
      {screenFlash && (
        <div 
          className="fixed inset-0 z-[100] pointer-events-none animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, rgba(139,0,0,0.3) 0%, transparent 70%)',
            animation: 'flash 0.1s ease-out'
          }}
        />
      )}

      {/* Static overlay */}
      {staticOverlay && (
        <div 
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.3,
            mixBlendMode: 'overlay',
            animation: 'static 0.05s steps(10) infinite'
          }}
        />
      )}

      {/* Glitch text */}
      {glitchText && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{ animation: 'glitch 0.1s steps(2) infinite' }}
        >
          <span 
            className="text-4xl md:text-6xl font-typewriter text-blood font-bold"
            style={{
              textShadow: '2px 0 #00ffff, -2px 0 #ff0000, 0 0 20px rgba(139,0,0,0.8)',
              animation: 'textGlitch 0.1s steps(2) infinite'
            }}
          >
            {glitchText}
          </span>
        </div>
      )}

      {/* Apparition */}
      {apparition && (
        <div 
          className="fixed z-[100] pointer-events-none"
          style={{ 
            left: `${apparition.x}%`, 
            top: `${apparition.y}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'fadeInOut 2s ease-out'
          }}
        >
          <div 
            className="text-6xl md:text-8xl opacity-20"
            style={{ filter: 'blur(1px)' }}
          >
            <Skull className="w-24 h-24 text-blood/30" />
          </div>
        </div>
      )}

      {/* Subliminal flash */}
      {subliminal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-background/90"
        >
          <span className="text-8xl">{subliminal}</span>
        </div>
      )}

      {/* Persistent corner watcher (very subtle) */}
      <div 
        className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-10 transition-opacity duration-1000 pointer-events-none"
      >
        <Eye className="w-8 h-8 text-blood" />
      </div>

      <style>{`
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        @keyframes static {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
          100% { transform: translate(2px, 2px); }
        }
        
        @keyframes textGlitch {
          0% { clip-path: inset(0 0 85% 0); }
          25% { clip-path: inset(15% 0 65% 0); }
          50% { clip-path: inset(35% 0 45% 0); }
          75% { clip-path: inset(55% 0 25% 0); }
          100% { clip-path: inset(75% 0 0 0); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          20% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </>
  );
}
