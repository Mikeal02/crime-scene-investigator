import { useEffect, useRef, useState } from 'react';
import { LocationType } from '@/types/crime';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'dust' | 'blood' | 'fog' | 'rain' | 'ember' | 'snow' | 'ash';
  rotation: number;
  rotationSpeed: number;
}

interface ParticleSystemProps {
  location: LocationType;
  weather?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const particleConfig: Record<LocationType, { types: Particle['type'][], colors: string[] }> = {
  forest: { types: ['dust', 'fog', 'ash'], colors: ['#3d5c3d', '#2a4a2a', '#1a3a1a'] },
  apartment: { types: ['dust'], colors: ['#8b8b8b', '#6b6b6b', '#4b4b4b'] },
  street: { types: ['dust', 'fog'], colors: ['#4a4a4a', '#3a3a3a', '#2a2a2a'] },
  office: { types: ['dust'], colors: ['#6b6b8b', '#5b5b7b', '#4b4b6b'] },
  factory: { types: ['dust', 'ember', 'ash'], colors: ['#8b4b2b', '#6b3b1b', '#5b2b0b'] },
  hotel: { types: ['dust'], colors: ['#8b6b5b', '#7b5b4b', '#6b4b3b'] },
  warehouse: { types: ['dust', 'fog', 'ash'], colors: ['#5b5b5b', '#4b4b4b', '#3b3b3b'] },
  parking_lot: { types: ['dust', 'fog'], colors: ['#4a4a5a', '#3a3a4a', '#2a2a3a'] },
  rooftop: { types: ['dust', 'fog'], colors: ['#5a5a6a', '#4a4a5a', '#3a3a4a'] },
  basement: { types: ['dust', 'fog'], colors: ['#3a3a3a', '#2a2a2a', '#1a1a1a'] },
  abandoned_hospital: { types: ['dust', 'fog', 'ash'], colors: ['#4a5a5a', '#3a4a4a', '#2a3a3a'] },
  sewers: { types: ['fog', 'dust'], colors: ['#2a3a2a', '#1a2a1a', '#0a1a0a'] },
  construction_site: { types: ['dust', 'ash'], colors: ['#6a5a4a', '#5a4a3a', '#4a3a2a'] },
  cemetery: { types: ['fog', 'dust', 'ash'], colors: ['#3a3a4a', '#2a2a3a', '#1a1a2a'] },
};

export function ParticleSystem({ location, weather, intensity = 'medium', className }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const config = particleConfig[location] || particleConfig.apartment;
  
  const particleCount = intensity === 'low' ? 30 : intensity === 'medium' ? 60 : 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      
      // Add weather particles
      if (weather === 'rain') {
        for (let i = 0; i < particleCount / 2; i++) {
          particlesRef.current.push(createParticle('rain', canvas));
        }
      } else if (weather === 'snow') {
        for (let i = 0; i < particleCount / 2; i++) {
          particlesRef.current.push(createParticle('snow', canvas));
        }
      }
      
      // Add location-based particles
      for (let i = 0; i < particleCount; i++) {
        const type = config.types[Math.floor(Math.random() * config.types.length)];
        particlesRef.current.push(createParticle(type, canvas));
      }

      // Add blood particles for horror effect
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(createParticle('blood', canvas));
      }
    };

    const createParticle = (type: Particle['type'], canvas: HTMLCanvasElement): Particle => {
      return {
        id: Math.random(),
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === 'blood' ? 2 + Math.random() * 4 : 1 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * (type === 'rain' ? 1 : type === 'blood' ? 0.3 : 0.5),
        speedY: type === 'rain' ? 5 + Math.random() * 3 : 
                type === 'snow' ? 0.5 + Math.random() * 1 :
                type === 'blood' ? 0.5 + Math.random() * 1 :
                (Math.random() - 0.5) * 0.3,
        opacity: type === 'blood' ? 0.6 + Math.random() * 0.4 : 0.1 + Math.random() * 0.4,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      };
    };

    const getParticleColor = (particle: Particle): string => {
      switch (particle.type) {
        case 'blood': return `rgba(139, 0, 0, ${particle.opacity})`;
        case 'rain': return `rgba(100, 150, 200, ${particle.opacity * 0.5})`;
        case 'snow': return `rgba(255, 255, 255, ${particle.opacity})`;
        case 'ember': return `rgba(255, ${100 + Math.random() * 100}, 0, ${particle.opacity})`;
        case 'fog': return `rgba(150, 150, 170, ${particle.opacity * 0.3})`;
        case 'ash': return `rgba(80, 80, 80, ${particle.opacity})`;
        default: 
          const color = config.colors[Math.floor(Math.random() * config.colors.length)];
          return color;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Apply slight drift
        if (particle.type === 'fog' || particle.type === 'dust') {
          particle.speedX += (Math.random() - 0.5) * 0.01;
          particle.speedX = Math.max(-0.5, Math.min(0.5, particle.speedX));
        }

        // Wrap around
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        const color = getParticleColor(particle);
        ctx.fillStyle = color;
        
        if (particle.type === 'rain') {
          ctx.fillRect(-0.5, -particle.size * 2, 1, particle.size * 4);
        } else if (particle.type === 'blood') {
          // Irregular blood droplet
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
          // Blood trail
          ctx.beginPath();
          ctx.ellipse(0, particle.size * 1.5, particle.size * 0.5, particle.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'fog') {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 5);
          gradient.addColorStop(0, `rgba(150, 150, 170, ${particle.opacity * 0.2})`);
          gradient.addColorStop(1, 'rgba(150, 150, 170, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, particle.size * 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [location, weather, intensity, config, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
