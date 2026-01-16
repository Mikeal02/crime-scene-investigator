import { useState } from 'react';
import { CrimeCase, LocationType } from '@/types/crime';
import { 
  MapPin, 
  User, 
  Droplets, 
  Footprints, 
  Camera,
  AlertCircle,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CrimeSceneMapProps {
  crimeCase: CrimeCase;
  onEvidenceClick?: (evidenceId: string) => void;
  className?: string;
}

interface MapMarker {
  id: string;
  type: 'body' | 'evidence' | 'blood' | 'footprint' | 'camera' | 'poi';
  x: number;
  y: number;
  label: string;
  description: string;
}

const locationBackgrounds: Record<LocationType, string> = {
  forest: 'from-[#1a2f1a] to-[#0d1a0d]',
  apartment: 'from-[#2a2a3a] to-[#1a1a2a]',
  street: 'from-[#2a2a2a] to-[#1a1a1a]',
  office: 'from-[#2a3040] to-[#1a2030]',
  factory: 'from-[#3a3030] to-[#2a2020]',
  hotel: 'from-[#3a2a30] to-[#2a1a20]',
  warehouse: 'from-[#2a2520] to-[#1a1510]',
  parking_lot: 'from-[#252530] to-[#151520]',
  rooftop: 'from-[#202535] to-[#101525]',
  basement: 'from-[#1a1515] to-[#0a0505]',
  abandoned_hospital: 'from-[#253030] to-[#152020]',
  sewers: 'from-[#1a2020] to-[#0a1010]',
  construction_site: 'from-[#352a20] to-[#251a10]',
  cemetery: 'from-[#1a1a25] to-[#0a0a15]',
};

export function CrimeSceneMap({ crimeCase, onEvidenceClick, className }: CrimeSceneMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Generate markers based on evidence
  const generateMarkers = (): MapMarker[] => {
    const markers: MapMarker[] = [];
    
    // Body position (center-ish)
    markers.push({
      id: 'body',
      type: 'body',
      x: 45 + Math.random() * 10,
      y: 40 + Math.random() * 20,
      label: 'REMAINS',
      description: `Body found in ${crimeCase.evidence.bodyPosition?.replace('_', ' ') || 'unknown'} position`,
    });

    // Blood evidence
    if (crimeCase.evidence.bloodPattern !== 'none') {
      markers.push({
        id: 'blood_main',
        type: 'blood',
        x: 40 + Math.random() * 20,
        y: 50 + Math.random() * 15,
        label: 'BLOOD PATTERN',
        description: `${crimeCase.evidence.bloodPattern?.replace('_', ' ')} detected`,
      });
    }

    // Footprints
    if (crimeCase.evidence.footprintType !== 'none') {
      markers.push({
        id: 'footprint_1',
        type: 'footprint',
        x: 20 + Math.random() * 15,
        y: 60 + Math.random() * 20,
        label: 'FOOTPRINTS',
        description: `${crimeCase.evidence.footprintType} impressions, ${crimeCase.evidence.footprintDirection?.replace('_', ' ')}`,
      });
    }

    // Surveillance
    if (crimeCase.evidence.surveillance?.available) {
      markers.push({
        id: 'camera_1',
        type: 'camera',
        x: 85,
        y: 15,
        label: 'SURVEILLANCE',
        description: crimeCase.evidence.surveillance.corruption ? 'Footage corrupted' : 'Footage available',
      });
    }

    // Scene objects
    crimeCase.evidence.sceneObjects?.forEach((obj, i) => {
      markers.push({
        id: `object_${i}`,
        type: 'evidence',
        x: 15 + (i * 15) % 70,
        y: 25 + (i * 20) % 50,
        label: obj.name,
        description: obj.condition,
      });
    });

    return markers;
  };

  const markers = generateMarkers();

  const getMarkerIcon = (type: MapMarker['type']) => {
    switch (type) {
      case 'body': return <User className="w-4 h-4" />;
      case 'blood': return <Droplets className="w-4 h-4" />;
      case 'footprint': return <Footprints className="w-4 h-4" />;
      case 'camera': return <Camera className="w-4 h-4" />;
      case 'evidence': return <AlertCircle className="w-4 h-4" />;
      case 'poi': return <MapPin className="w-4 h-4" />;
    }
  };

  const getMarkerColor = (type: MapMarker['type']) => {
    switch (type) {
      case 'body': return 'bg-blood border-blood text-blood';
      case 'blood': return 'bg-blood/50 border-blood/70 text-blood';
      case 'footprint': return 'bg-forensic/50 border-forensic/70 text-forensic';
      case 'camera': return 'bg-cold/50 border-cold/70 text-cold';
      case 'evidence': return 'bg-warning/50 border-warning/70 text-warning';
      case 'poi': return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  return (
    <div className={cn("bg-card border border-border p-4 rounded", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blood" />
          <span className="font-typewriter text-sm text-foreground tracking-wider">
            CRIME SCENE LAYOUT
          </span>
        </div>
        <span className="text-xs font-terminal text-muted-foreground">
          {markers.length} MARKERS
        </span>
      </div>

      {/* Map */}
      <div 
        className={cn(
          "relative h-64 rounded border border-border overflow-hidden bg-gradient-to-br",
          locationBackgrounds[crimeCase.location]
        )}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Markers */}
        {markers.map((marker) => (
          <button
            key={marker.id}
            className={cn(
              "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              getMarkerColor(marker.type),
              "hover:scale-125 hover:z-10",
              selectedMarker === marker.id && "scale-125 z-10 ring-2 ring-blood/50",
              marker.type === 'body' && "animate-pulse-slow"
            )}
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
            onMouseEnter={() => setHoveredMarker(marker.id)}
            onMouseLeave={() => setHoveredMarker(null)}
            onClick={() => {
              setSelectedMarker(marker.id === selectedMarker ? null : marker.id);
              onEvidenceClick?.(marker.id);
            }}
          >
            {getMarkerIcon(marker.type)}
          </button>
        ))}

        {/* Tooltip */}
        {hoveredMarker && (
          <div className="absolute bottom-2 left-2 right-2 bg-background/95 border border-border p-2 rounded animate-fade-in">
            <p className="text-xs font-typewriter text-foreground">
              {markers.find(m => m.id === hoveredMarker)?.label}
            </p>
            <p className="text-xs font-terminal text-muted-foreground mt-1">
              {markers.find(m => m.id === hoveredMarker)?.description}
            </p>
          </div>
        )}

        {/* Compass */}
        <div className="absolute top-2 right-2 w-8 h-8 border border-border/50 rounded-full bg-background/50 flex items-center justify-center">
          <span className="text-[10px] font-terminal text-muted-foreground">N</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs font-terminal">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blood border border-blood" />
          <span className="text-muted-foreground">Body</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blood/50 border border-blood/70" />
          <span className="text-muted-foreground">Blood</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-warning/50 border border-warning/70" />
          <span className="text-muted-foreground">Evidence</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-forensic/50 border border-forensic/70" />
          <span className="text-muted-foreground">Tracks</span>
        </div>
      </div>

      {/* Selected info */}
      {selectedMarker && (
        <div className="mt-3 p-3 bg-background border border-border animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-sm font-typewriter text-foreground">
              {markers.find(m => m.id === selectedMarker)?.label}
            </span>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {markers.find(m => m.id === selectedMarker)?.description}
          </p>
        </div>
      )}
    </div>
  );
}
