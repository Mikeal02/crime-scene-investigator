import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
  glitch?: boolean;
}

export function TypewriterText({ 
  text, 
  speed = 50, 
  delay = 0,
  className,
  onComplete,
  cursor = true,
  glitch = false
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [glitchChar, setGlitchChar] = useState<number | null>(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          // Occasionally glitch a character
          if (glitch && Math.random() < 0.05) {
            setGlitchChar(currentIndex);
            setTimeout(() => setGlitchChar(null), 100);
          }
          
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
      
      return () => clearInterval(typeInterval);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, onComplete, glitch]);

  const renderText = () => {
    if (glitchChar === null) return displayedText;
    
    const chars = displayedText.split('');
    if (chars[glitchChar]) {
      chars[glitchChar] = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }
    return chars.join('');
  };

  return (
    <span className={cn("font-terminal", className)}>
      {renderText()}
      {cursor && !isComplete && (
        <span className={cn("text-blood", showCursor ? "opacity-100" : "opacity-0")}>
          █
        </span>
      )}
    </span>
  );
}
