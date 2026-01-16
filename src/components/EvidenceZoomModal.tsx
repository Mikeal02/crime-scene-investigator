import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Fingerprint,
  AlertTriangle,
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: {
    title: string;
    type: string;
    description: string;
    forensicNote?: string;
    hiddenDetail?: string;
  } | null;
}

export function EvidenceZoomModal({ isOpen, onClose, evidence }: EvidenceZoomModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showHidden, setShowHidden] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setZoom(100);
      setRotation(0);
      setShowHidden(false);
      setAnalysisProgress(0);
      
      // Random glitch effect
      const glitchInterval = setInterval(() => {
        if (Math.random() < 0.1) {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 100);
        }
      }, 2000);
      
      return () => clearInterval(glitchInterval);
    }
  }, [isOpen]);

  const handleAnalyze = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowHidden(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  if (!evidence) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-typewriter text-blood flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            EVIDENCE ANALYSIS: {evidence.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between p-2 bg-background border border-border">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setZoom(z => Math.min(200, z + 25))}
                className="text-muted-foreground hover:text-foreground"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <span className="text-xs font-terminal text-muted-foreground w-12 text-center">
                {zoom}%
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setZoom(z => Math.max(50, z - 25))}
                className="text-muted-foreground hover:text-foreground"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <div className="w-px h-4 bg-border mx-2" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing || showHidden}
              className={cn(
                "border-blood/50 text-blood hover:bg-blood/10",
                isAnalyzing && "animate-pulse"
              )}
            >
              <FileText className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'ANALYZING...' : showHidden ? 'ANALYZED' : 'DEEP ANALYSIS'}
            </Button>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="space-y-1">
              <div className="h-1 bg-background border border-border rounded overflow-hidden">
                <div 
                  className="h-full bg-blood transition-all duration-200"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <p className="text-xs font-terminal text-muted-foreground animate-pulse">
                Processing forensic data... {Math.floor(analysisProgress)}%
              </p>
            </div>
          )}

          {/* Evidence Display */}
          <div 
            className={cn(
              "relative bg-background border border-border p-6 min-h-[300px] overflow-hidden",
              glitchActive && "animate-glitch"
            )}
          >
            {/* Scan line effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-px bg-blood/10 animate-scan-line" />
            </div>

            <div 
              className="transition-all duration-300"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blood/10 border border-blood/30 rounded">
                    <Fingerprint className="w-8 h-8 text-blood/70" />
                  </div>
                  <div>
                    <h3 className="font-typewriter text-lg text-foreground">
                      {evidence.type.toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {evidence.description}
                    </p>
                  </div>
                </div>

                {evidence.forensicNote && (
                  <div className="p-3 bg-card border border-border">
                    <p className="text-xs font-terminal text-warning flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {evidence.forensicNote}
                    </p>
                  </div>
                )}

                {/* Hidden Detail */}
                {showHidden && evidence.hiddenDetail && (
                  <div className="p-3 bg-blood/10 border border-blood/30 animate-fade-in">
                    <p className="text-xs font-terminal text-blood flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 animate-pulse" />
                      <span>
                        <strong>HIDDEN DETAIL UNCOVERED:</strong>
                        <br />
                        {evidence.hiddenDetail}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fingerprint overlay */}
            <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
              <Fingerprint className="w-32 h-32 text-foreground" />
            </div>
          </div>

          {/* Evidence stamp */}
          <div className="flex items-center justify-between text-xs font-terminal text-muted-foreground/50">
            <span>EVIDENCE ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            <span>CHAIN OF CUSTODY: VERIFIED</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
