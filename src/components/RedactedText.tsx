import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RedactedTextProps {
  text: string;
  revealOnHover?: boolean;
  revealDelay?: number;
  className?: string;
  unredactable?: boolean;
}

export function RedactedText({ 
  text, 
  revealOnHover = true,
  revealDelay = 500,
  className,
  unredactable = false
}: RedactedTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (!revealOnHover || unredactable) return;
    setIsHovering(true);
    timeoutRef.current = setTimeout(() => {
      setIsRevealed(true);
    }, revealDelay);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Keep revealed for a bit longer
    setTimeout(() => {
      setIsRevealed(false);
    }, 1000);
  };

  if (unredactable) {
    return (
      <span 
        className={cn(
          "bg-foreground text-foreground select-none cursor-not-allowed inline-block px-1",
          className
        )}
        title="[PERMANENTLY REDACTED]"
      >
        {text.replace(/./g, '█')}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative inline-block px-1 cursor-pointer transition-all duration-300",
        isRevealed 
          ? "bg-blood/20 text-blood" 
          : "bg-foreground text-foreground",
        isHovering && !isRevealed && "animate-pulse",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={cn(
        "transition-opacity duration-300",
        isRevealed ? "opacity-100" : "opacity-0"
      )}>
        {text}
      </span>
      <span className={cn(
        "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
        isRevealed ? "opacity-0" : "opacity-100"
      )}>
        {text.replace(/./g, '█')}
      </span>
      
      {/* Reveal progress indicator */}
      {isHovering && !isRevealed && (
        <span className="absolute -bottom-1 left-0 h-0.5 bg-blood/50 animate-pulse" 
          style={{ 
            width: '100%',
            animation: `progressFill ${revealDelay}ms linear`
          }} 
        />
      )}
    </span>
  );
}
