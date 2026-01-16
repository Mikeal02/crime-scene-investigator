import { useState, useCallback, useMemo, useEffect } from 'react';
import { CrimeCase, LocationType } from '@/types/crime';
import { ParticleSystem } from './ParticleSystem';
import { cn } from '@/lib/utils';
import { 
  MapPin, 
  User, 
  Droplets, 
  Footprints, 
  Camera,
  AlertCircle,
  Eye,
  Fingerprint,
  FileText,
  ThermometerSun,
  Clock,
  Skull,
  Radio,
  Microscope,
  Search,
  ZoomIn,
  Lock,
  Unlock,
  ChevronRight,
  X,
  Crosshair,
  Scan
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface AdvancedCrimeSceneProps {
  crimeCase: CrimeCase;
  onEvidenceClick?: (evidenceId: string) => void;
  onInvestigationProgress?: (progress: number) => void;
  className?: string;
}

interface EvidenceMarker {
  id: string;
  type: 'body' | 'blood' | 'footprint' | 'weapon' | 'object' | 'camera' | 'dna' | 'digital' | 'environmental';
  x: number;
  y: number;
  z: number; // Layer depth
  label: string;
  description: string;
  examined: boolean;
  locked: boolean;
  requiresExam?: string;
  forensicData?: {
    collected: boolean;
    analyzed: boolean;
    result?: string;
    contradiction?: string;
  };
  hiddenInfo?: string;
}

interface InvestigationTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  uses: number;
  maxUses: number;
}

const locationBackgrounds: Record<LocationType, { gradient: string; texture: string; ambiance: string }> = {
  forest: { gradient: 'from-[#0d1f0d] via-[#1a2f1a] to-[#0a1a0a]', texture: 'forest', ambiance: 'Rustling leaves, distant owls' },
  apartment: { gradient: 'from-[#1a1a2a] via-[#2a2a3a] to-[#151525]', texture: 'interior', ambiance: 'Buzzing fluorescent, dripping faucet' },
  street: { gradient: 'from-[#1a1a1a] via-[#2a2a2a] to-[#101010]', texture: 'urban', ambiance: 'Distant sirens, flickering streetlight' },
  office: { gradient: 'from-[#1a2030] via-[#2a3040] to-[#152030]', texture: 'interior', ambiance: 'Humming computers, ventilation drone' },
  factory: { gradient: 'from-[#2a2020] via-[#3a3030] to-[#1a1010]', texture: 'industrial', ambiance: 'Clanking metal, hissing steam' },
  hotel: { gradient: 'from-[#2a1a20] via-[#3a2a30] to-[#1a0a10]', texture: 'interior', ambiance: 'Muffled TV, creaking floors' },
  warehouse: { gradient: 'from-[#1a1510] via-[#2a2520] to-[#0a0500]', texture: 'industrial', ambiance: 'Echoing drips, scurrying rats' },
  parking_lot: { gradient: 'from-[#151520] via-[#252530] to-[#0a0a10]', texture: 'concrete', ambiance: 'Flickering lights, engine echoes' },
  rooftop: { gradient: 'from-[#101525] via-[#202535] to-[#050a15]', texture: 'urban', ambiance: 'Wind gusts, distant traffic' },
  basement: { gradient: 'from-[#0a0505] via-[#1a1515] to-[#050202]', texture: 'underground', ambiance: 'Pipes groaning, water dripping' },
  abandoned_hospital: { gradient: 'from-[#152020] via-[#253030] to-[#0a1515]', texture: 'decay', ambiance: 'Flickering lights, distant moans' },
  sewers: { gradient: 'from-[#0a1010] via-[#1a2020] to-[#050a0a]', texture: 'underground', ambiance: 'Rushing water, echoes' },
  construction_site: { gradient: 'from-[#251a10] via-[#352a20] to-[#150a00]', texture: 'industrial', ambiance: 'Creaking structures, wind' },
  cemetery: { gradient: 'from-[#0a0a15] via-[#1a1a25] to-[#050510]', texture: 'outdoor', ambiance: 'Silence, occasional crows' },
};

export function AdvancedCrimeScene({ crimeCase, onEvidenceClick, onInvestigationProgress, className }: AdvancedCrimeSceneProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [examiningMarker, setExaminingMarker] = useState<string | null>(null);
  const [markers, setMarkers] = useState<EvidenceMarker[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [investigationLog, setInvestigationLog] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [scanMode, setScanMode] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());

  const [tools] = useState<InvestigationTool[]>([
    { id: 'uv', name: 'UV Light', icon: <Scan className="w-4 h-4" />, description: 'Reveal hidden biological evidence', uses: 3, maxUses: 3 },
    { id: 'magnify', name: 'Magnifier', icon: <ZoomIn className="w-4 h-4" />, description: 'Examine minute details', uses: 5, maxUses: 5 },
    { id: 'dna', name: 'DNA Kit', icon: <Fingerprint className="w-4 h-4" />, description: 'Collect biological samples', uses: 2, maxUses: 2 },
    { id: 'digital', name: 'Data Extractor', icon: <Radio className="w-4 h-4" />, description: 'Access digital evidence', uses: 2, maxUses: 2 },
    { id: 'thermometer', name: 'Thermometer', icon: <ThermometerSun className="w-4 h-4" />, description: 'Check body temperature', uses: 1, maxUses: 1 },
  ]);

  const background = locationBackgrounds[crimeCase.location];

  // Generate complex markers based on evidence
  useEffect(() => {
    const generateMarkers = (): EvidenceMarker[] => {
      const newMarkers: EvidenceMarker[] = [];
      
      // Body - always present
      newMarkers.push({
        id: 'body_primary',
        type: 'body',
        x: 45 + Math.random() * 10,
        y: 40 + Math.random() * 15,
        z: 10,
        label: 'PRIMARY REMAINS',
        description: `Body found in ${crimeCase.evidence.bodyPosition?.replace('_', ' ') || 'unknown'} position`,
        examined: false,
        locked: false,
        forensicData: {
          collected: false,
          analyzed: false,
        },
        hiddenInfo: 'Rigor mortis suggests death occurred earlier than initially estimated',
      });

      // Blood evidence - multiple patterns
      if (crimeCase.evidence.bloodPattern !== 'none') {
        newMarkers.push({
          id: 'blood_primary',
          type: 'blood',
          x: 40 + Math.random() * 15,
          y: 50 + Math.random() * 10,
          z: 5,
          label: 'BLOOD PATTERN ALPHA',
          description: `Primary ${crimeCase.evidence.bloodPattern?.replace('_', ' ')} pattern`,
          examined: false,
          locked: false,
          forensicData: {
            collected: false,
            analyzed: false,
            contradiction: 'Spatter angle inconsistent with body position',
          },
        });

        // Secondary blood (hidden until examined)
        newMarkers.push({
          id: 'blood_secondary',
          type: 'blood',
          x: 65 + Math.random() * 10,
          y: 35 + Math.random() * 10,
          z: 3,
          label: 'BLOOD PATTERN BETA',
          description: 'Secondary blood source - different type detected',
          examined: false,
          locked: true,
          requiresExam: 'blood_primary',
          hiddenInfo: 'Blood type does not match victim. Unknown second individual.',
        });
      }

      // Footprints with complex trail
      if (crimeCase.evidence.footprintType !== 'none') {
        const footprintPositions = [
          { x: 20, y: 70 },
          { x: 28, y: 62 },
          { x: 35, y: 55 },
          { x: 42, y: 48 },
        ];

        footprintPositions.forEach((pos, i) => {
          newMarkers.push({
            id: `footprint_${i}`,
            type: 'footprint',
            x: pos.x + Math.random() * 5,
            y: pos.y + Math.random() * 5,
            z: 2,
            label: `IMPRESSION ${String.fromCharCode(65 + i)}`,
            description: i === 0 
              ? `${crimeCase.evidence.footprintType} prints, ${crimeCase.evidence.footprintDirection?.replace('_', ' ')}`
              : 'Additional impression in sequence',
            examined: false,
            locked: i > 0,
            requiresExam: i > 0 ? `footprint_${i - 1}` : undefined,
            hiddenInfo: i === 2 ? 'Stride length changes here - running? Limping?' : undefined,
          });
        });
      }

      // Weapon evidence
      if (crimeCase.evidence.weaponFound && crimeCase.evidence.weaponFound !== 'none') {
        newMarkers.push({
          id: 'weapon_primary',
          type: 'weapon',
          x: 55 + Math.random() * 15,
          y: 60 + Math.random() * 10,
          z: 8,
          label: 'WEAPON LOCATED',
          description: `${crimeCase.evidence.weaponFound.replace('_', ' ').toUpperCase()} found at scene`,
          examined: false,
          locked: false,
          forensicData: {
            collected: false,
            analyzed: false,
            contradiction: 'Weapon position inconsistent with attack angle',
          },
          hiddenInfo: 'Serial number filed off. Trace evidence pending.',
        });
      }

      // Surveillance
      if (crimeCase.evidence.surveillance?.available) {
        newMarkers.push({
          id: 'surveillance_cam',
          type: 'camera',
          x: 88,
          y: 12,
          z: 15,
          label: 'SURVEILLANCE POINT',
          description: crimeCase.evidence.surveillance.corruption 
            ? 'Footage integrity compromised' 
            : 'Recording available for review',
          examined: false,
          locked: false,
          hiddenInfo: crimeCase.evidence.surveillance.anomaly || 'Timestamp shows 23-minute gap during incident window',
        });
      }

      // Scene objects
      crimeCase.evidence.sceneObjects?.forEach((obj, i) => {
        const positions = [
          { x: 15, y: 25 },
          { x: 75, y: 35 },
          { x: 25, y: 75 },
          { x: 70, y: 70 },
          { x: 50, y: 20 },
        ];
        const pos = positions[i % positions.length];
        
        newMarkers.push({
          id: `object_${i}`,
          type: 'object',
          x: pos.x + Math.random() * 8,
          y: pos.y + Math.random() * 8,
          z: 6,
          label: obj.name.toUpperCase(),
          description: obj.condition,
          examined: false,
          locked: obj.relevance === 'key' && i > 1,
          requiresExam: obj.relevance === 'key' && i > 1 ? `object_${i - 1}` : undefined,
          forensicData: {
            collected: false,
            analyzed: false,
            result: obj.forensicNote,
          },
          hiddenInfo: obj.hiddenMeaning,
        });
      });

      // Biological evidence
      crimeCase.evidence.biologicalEvidence?.forEach((bio, i) => {
        newMarkers.push({
          id: `bio_${i}`,
          type: 'dna',
          x: 30 + Math.random() * 40,
          y: 30 + Math.random() * 40,
          z: 4,
          label: `${bio.type.toUpperCase()} SAMPLE`,
          description: `${bio.quality} quality - ${bio.matchStatus || 'pending analysis'}`,
          examined: false,
          locked: true,
          requiresExam: 'body_primary',
          hiddenInfo: bio.forensicNote,
        });
      });

      // Digital evidence
      crimeCase.evidence.digitalEvidence?.forEach((digital, i) => {
        newMarkers.push({
          id: `digital_${i}`,
          type: 'digital',
          x: 80 + Math.random() * 10,
          y: 50 + Math.random() * 20,
          z: 7,
          label: digital.type.replace('_', ' ').toUpperCase(),
          description: digital.corrupted ? 'Data corruption detected' : 'Data available for extraction',
          examined: false,
          locked: true,
          requiresExam: 'surveillance_cam',
          hiddenInfo: digital.forensicNote,
        });
      });

      return newMarkers;
    };

    setMarkers(generateMarkers());
  }, [crimeCase]);

  // Calculate investigation progress
  const progress = useMemo(() => {
    const totalMarkers = markers.length;
    const examinedMarkers = markers.filter(m => m.examined).length;
    return totalMarkers > 0 ? Math.round((examinedMarkers / totalMarkers) * 100) : 0;
  }, [markers]);

  useEffect(() => {
    onInvestigationProgress?.(progress);
  }, [progress, onInvestigationProgress]);

  const examineMarker = useCallback((markerId: string) => {
    setMarkers(prev => prev.map(marker => {
      if (marker.id === markerId) {
        const updated = { ...marker, examined: true };
        
        // Add to investigation log
        setInvestigationLog(log => [
          ...log,
          `[${new Date().toLocaleTimeString()}] Examined: ${marker.label}`,
        ]);

        // Reveal hidden info
        if (marker.hiddenInfo) {
          setRevealedHints(hints => new Set([...hints, marker.hiddenInfo!]));
        }

        // Unlock dependent markers
        setTimeout(() => {
          setMarkers(m => m.map(other => {
            if (other.requiresExam === markerId && other.locked) {
              setInvestigationLog(log => [
                ...log,
                `[${new Date().toLocaleTimeString()}] Unlocked: ${other.label}`,
              ]);
              return { ...other, locked: false };
            }
            return other;
          }));
        }, 500);

        return updated;
      }
      return marker;
    }));

    onEvidenceClick?.(markerId);
  }, [onEvidenceClick]);

  const getMarkerIcon = (type: EvidenceMarker['type']) => {
    switch (type) {
      case 'body': return <Skull className="w-4 h-4" />;
      case 'blood': return <Droplets className="w-4 h-4" />;
      case 'footprint': return <Footprints className="w-4 h-4" />;
      case 'weapon': return <AlertCircle className="w-4 h-4" />;
      case 'camera': return <Camera className="w-4 h-4" />;
      case 'dna': return <Fingerprint className="w-4 h-4" />;
      case 'digital': return <Radio className="w-4 h-4" />;
      case 'object': return <Search className="w-4 h-4" />;
      case 'environmental': return <ThermometerSun className="w-4 h-4" />;
    }
  };

  const getMarkerColor = (marker: EvidenceMarker) => {
    if (marker.locked) return 'bg-muted/50 border-muted text-muted-foreground';
    if (marker.examined) return 'bg-forensic/30 border-forensic text-forensic';
    
    switch (marker.type) {
      case 'body': return 'bg-blood/80 border-blood text-blood animate-pulse-slow';
      case 'blood': return 'bg-blood/50 border-blood/70 text-blood';
      case 'footprint': return 'bg-cold/50 border-cold/70 text-cold';
      case 'weapon': return 'bg-warning/60 border-warning text-warning';
      case 'camera': return 'bg-cold/50 border-cold/70 text-cold';
      case 'dna': return 'bg-forensic/50 border-forensic/70 text-forensic';
      case 'digital': return 'bg-cold/60 border-cold text-cold';
      case 'object': return 'bg-warning/50 border-warning/70 text-warning';
      case 'environmental': return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  return (
    <div className={cn("bg-card border border-border rounded overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blood/20 border border-blood/30">
            <Crosshair className="w-5 h-5 text-blood" />
          </div>
          <div>
            <h3 className="font-typewriter text-sm text-foreground tracking-wider">
              CRIME SCENE RECONSTRUCTION
            </h3>
            <p className="text-xs text-muted-foreground font-terminal">
              {background.ambiance}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-muted-foreground font-terminal block">EVIDENCE COLLECTED</span>
            <span className="text-sm font-bold text-forensic">{markers.filter(m => m.examined).length}/{markers.length}</span>
          </div>
          <Progress value={progress} className="w-24 h-2" />
        </div>
      </div>

      {/* Tool bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border/50 bg-background/30">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant={activeTool === tool.id ? "default" : "outline"}
            size="sm"
            disabled={tool.uses === 0}
            onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
            className="text-xs font-terminal"
            title={tool.description}
          >
            {tool.icon}
            <span className="ml-1 hidden sm:inline">{tool.name}</span>
            <span className="ml-1 text-muted-foreground">({tool.uses})</span>
          </Button>
        ))}
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className="text-xs"
        >
          Grid: {showGrid ? 'ON' : 'OFF'}
        </Button>
        
        <Button
          variant={scanMode ? "default" : "ghost"}
          size="sm"
          onClick={() => setScanMode(!scanMode)}
          className="text-xs"
        >
          <Scan className="w-4 h-4 mr-1" />
          Scan
        </Button>
      </div>

      {/* Main scene */}
      <div 
        className="relative h-[500px] overflow-hidden"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
          background.gradient
        )} />

        {/* Particle system */}
        <ParticleSystem 
          location={crimeCase.location}
          weather={crimeCase.evidence.weather}
          intensity="medium"
        />

        {/* Grid overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="evidence-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#evidence-grid)" />
            </svg>
          </div>
        )}

        {/* Crime scene tape effect on edges */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-warning/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blood/20 to-transparent pointer-events-none" />

        {/* Evidence markers */}
        {markers.map((marker) => (
          <button
            key={marker.id}
            disabled={marker.locked}
            className={cn(
              "absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 flex items-center justify-center transition-all duration-300",
              getMarkerColor(marker),
              "hover:scale-110 hover:z-20",
              selectedMarker === marker.id && "scale-125 z-30 ring-2 ring-foreground/50 ring-offset-2 ring-offset-background",
              scanMode && !marker.examined && !marker.locked && "animate-pulse",
              marker.locked && "cursor-not-allowed opacity-50"
            )}
            style={{ 
              left: `${marker.x}%`, 
              top: `${marker.y}%`,
              zIndex: marker.z + (selectedMarker === marker.id ? 50 : 0),
            }}
            onClick={() => {
              if (!marker.locked) {
                setSelectedMarker(marker.id === selectedMarker ? null : marker.id);
              }
            }}
          >
            {marker.locked ? (
              <Lock className="w-4 h-4" />
            ) : (
              getMarkerIcon(marker.type)
            )}
            
            {/* Examined indicator */}
            {marker.examined && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-forensic rounded-full border border-background">
                <span className="text-[8px] text-background font-bold flex items-center justify-center h-full">✓</span>
              </div>
            )}
          </button>
        ))}

        {/* Compass */}
        <div className="absolute top-4 right-4 w-12 h-12 border border-foreground/20 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <span className="text-xs font-terminal text-foreground/60 block">N</span>
            <div className="w-px h-4 bg-blood mx-auto" />
          </div>
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-terminal text-foreground/50">
          <div className="w-16 h-px bg-foreground/30" />
          <span>2m</span>
        </div>
      </div>

      {/* Evidence detail panel */}
      {selectedMarker && (
        <div className="border-t border-border bg-background/90 backdrop-blur-sm p-4 animate-fade-in">
          {(() => {
            const marker = markers.find(m => m.id === selectedMarker);
            if (!marker) return null;

            return (
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-typewriter text-foreground tracking-wider flex items-center gap-2">
                      {getMarkerIcon(marker.type)}
                      {marker.label}
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedMarker(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 font-clinical">{marker.description}</p>
                  
                  {marker.forensicData?.contradiction && marker.examined && (
                    <div className="p-2 bg-blood/10 border border-blood/30 rounded mb-3">
                      <p className="text-xs text-blood font-terminal">
                        ⚠ CONTRADICTION: {marker.forensicData.contradiction}
                      </p>
                    </div>
                  )}

                  {marker.hiddenInfo && marker.examined && (
                    <div className="p-2 bg-warning/10 border border-warning/30 rounded mb-3">
                      <p className="text-xs text-warning font-terminal">
                        🔍 HIDDEN DETAIL: {marker.hiddenInfo}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!marker.examined && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setExaminingMarker(marker.id);
                          setTimeout(() => {
                            examineMarker(marker.id);
                            setExaminingMarker(null);
                          }, 1500);
                        }}
                        disabled={examiningMarker !== null}
                        className="bg-forensic hover:bg-forensic/80 text-background font-terminal"
                      >
                        {examiningMarker === marker.id ? (
                          <>
                            <Microscope className="w-4 h-4 mr-2 animate-pulse" />
                            EXAMINING...
                          </>
                        ) : (
                          <>
                            <Microscope className="w-4 h-4 mr-2" />
                            EXAMINE EVIDENCE
                          </>
                        )}
                      </Button>
                    )}
                    
                    {marker.examined && (
                      <span className="text-xs text-forensic font-terminal flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        EVIDENCE CATALOGUED
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini investigation log */}
                <div className="w-64 hidden lg:block">
                  <h5 className="text-xs font-terminal text-muted-foreground mb-2">INVESTIGATION LOG</h5>
                  <div className="h-24 overflow-y-auto bg-card border border-border rounded p-2 text-xs font-terminal text-muted-foreground space-y-1">
                    {investigationLog.slice(-5).map((log, i) => (
                      <p key={i} className="truncate">{log}</p>
                    ))}
                    {investigationLog.length === 0 && (
                      <p className="text-muted-foreground/50 italic">No entries yet...</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Revealed hints panel */}
      {revealedHints.size > 0 && (
        <div className="border-t border-border p-3 bg-warning/5">
          <h5 className="text-xs font-terminal text-warning mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            INVESTIGATOR NOTES ({revealedHints.size})
          </h5>
          <div className="flex flex-wrap gap-2">
            {Array.from(revealedHints).map((hint, i) => (
              <span 
                key={i} 
                className="text-xs bg-background border border-border rounded px-2 py-1 font-clinical text-muted-foreground"
              >
                {hint}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
