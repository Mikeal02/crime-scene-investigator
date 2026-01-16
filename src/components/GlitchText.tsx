import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  continuous?: boolean;
}

const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▄▀■□▢▣▤▥▦▧▨▩';

export function GlitchText({ 
  text, 
  className, 
  intensity = 'medium',
  continuous = false 
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const glitchProbability = {
    low: 0.02,
    medium: 0.05,
    high: 0.1,
  };

  useEffect(() => {
    if (!continuous) return;

    const interval = setInterval(() => {
      if (Math.random() < glitchProbability[intensity]) {
        setIsGlitching(true);
        
        // Glitch the text
        const chars = text.split('');
        const glitchedChars = chars.map(char => {
          if (Math.random() < 0.3 && char !== ' ') {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        });
        setDisplayText(glitchedChars.join(''));

        // Reset after short delay
        setTimeout(() => {
          setDisplayText(text);
          setIsGlitching(false);
        }, 50 + Math.random() * 100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text, intensity, continuous]);

  const handleMouseEnter = () => {
    if (continuous) return;
    
    setIsGlitching(true);
    const glitchInterval = setInterval(() => {
      const chars = text.split('');
      const glitchedChars = chars.map(char => {
        if (Math.random() < glitchProbability[intensity] * 5 && char !== ' ') {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      });
      setDisplayText(glitchedChars.join(''));
    }, 30);

    setTimeout(() => {
      clearInterval(glitchInterval);
      setDisplayText(text);
      setIsGlitching(false);
    }, 300);
  };

  return (
    <span 
      className={cn(
        "relative inline-block",
        isGlitching && "text-blood",
        className
      )}
      onMouseEnter={handleMouseEnter}
    >
      {/* Main text */}
      <span className={cn(
        "relative z-10",
        isGlitching && "animate-glitch"
      )}>
        {displayText}
      </span>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <span 
            className="absolute top-0 left-0 text-cyan-500/50 -translate-x-0.5"
            aria-hidden
          >
            {displayText}
          </span>
          <span 
            className="absolute top-0 left-0 text-blood/50 translate-x-0.5"
            aria-hidden
          >
            {displayText}
          </span>
        </>
      )}
    </span>
  );
}
