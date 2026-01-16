import { useState, useCallback, useEffect } from 'react';
import { CrimeCase, UserReconstruction, ValidationResult } from '@/types/crime';
import { generateCrimeCase } from '@/lib/crimeGenerator';
import { validateReconstruction } from '@/lib/logicValidator';
import { CaseHeader } from '@/components/CaseHeader';
import { EvidencePanel } from '@/components/EvidencePanel';
import { ReconstructionForm } from '@/components/ReconstructionForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { DifficultySelector } from '@/components/DifficultySelector';
import { CrimeSceneMap } from '@/components/CrimeSceneMap';
import { AudioController } from '@/components/AudioController';
import { InvestigatorProfile } from '@/components/InvestigatorProfile';
import { TypewriterText } from '@/components/TypewriterText';
import { GlitchText } from '@/components/GlitchText';
import { Button } from '@/components/ui/button';
import { 
  Skull, 
  Eye, 
  RotateCcw,
  FileWarning,
  AlertTriangle,
  Shield,
  Lock,
  Terminal,
  Map
} from 'lucide-react';

type GameState = 'warning' | 'menu' | 'investigating' | 'results';

export default function Index() {
  const [gameState, setGameState] = useState<GameState>('warning');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [currentCase, setCurrentCase] = useState<CrimeCase | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warningStep, setWarningStep] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  const acknowledgeWarning = useCallback(() => {
    if (warningStep < 2) {
      setWarningStep(prev => prev + 1);
    } else {
      setGameState('menu');
    }
  }, [warningStep]);

  const startNewCase = useCallback(() => {
    const newCase = generateCrimeCase(difficulty);
    setCurrentCase(newCase);
    setResult(null);
    setGameState('investigating');
  }, [difficulty]);

  const handleSubmit = useCallback((reconstruction: UserReconstruction) => {
    if (!currentCase) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const validationResult = validateReconstruction(currentCase, reconstruction);
      setResult(validationResult);
      setGameState('results');
      setIsSubmitting(false);
    }, 3000);
  }, [currentCase]);

  const handleNewCase = useCallback(() => {
    setGameState('menu');
    setCurrentCase(null);
    setResult(null);
  }, []);

  // System Warning Screen
  if (gameState === 'warning') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center static-overlay">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          <div className="absolute w-full h-px bg-foreground/5 animate-scan-line" />
        </div>

        <div className="max-w-2xl mx-auto p-8 animate-fade-in">
          {warningStep === 0 && (
            <div className="space-y-6 text-center">
              <div className="p-4 border border-blood animate-flicker">
                <Terminal className="w-12 h-12 text-blood mx-auto mb-4" />
                <pre className="font-terminal text-xs text-blood tracking-wider leading-relaxed">
{`╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ██╗    ██╗ █████╗ ██████╗ ███╗   ██╗██╗███╗   ██╗ ██████╗ ║
║    ██║    ██║██╔══██╗██╔══██╗████╗  ██║██║████╗  ██║██╔════╝ ║
║    ██║ █╗ ██║███████║██████╔╝██╔██╗ ██║██║██╔██╗ ██║██║  ███╗║
║    ██║███╗██║██╔══██║██╔══██╗██║╚██╗██║██║██║╚██╗██║██║   ██║║
║    ╚███╔███╔╝██║  ██║██║  ██║██║ ╚████║██║██║ ╚████║╚██████╔╝║
║     ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ║
║                                                              ║
║              RESTRICTED ACCESS TERMINAL                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`}
                </pre>
              </div>

              <div className="text-left p-4 bg-card border border-border">
                <p className="font-terminal text-muted-foreground text-sm leading-relaxed">
                  <span className="text-blood">&gt;</span> SYSTEM NOTICE: You are attempting to access classified forensic case files.
                </p>
                <p className="font-terminal text-muted-foreground text-sm leading-relaxed mt-2">
                  <span className="text-blood">&gt;</span> This database contains disturbing content including detailed records of violent death, forensic photography descriptions, and psychological trauma documentation.
                </p>
                <p className="font-terminal text-muted-foreground text-sm leading-relaxed mt-2">
                  <span className="text-blood">&gt;</span> All access is logged. All actions are recorded.
                </p>
                <p className="font-terminal text-xs text-muted-foreground/50 mt-4">
                  SESSION ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}
                  {showCursor && <span className="text-blood">█</span>}
                </p>
              </div>

              <Button 
                onClick={acknowledgeWarning}
                variant="outline"
                className="border-blood/50 text-blood hover:bg-blood/10 font-terminal tracking-widest"
              >
                I UNDERSTAND THE RISKS
              </Button>
            </div>
          )}

          {warningStep === 1 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="p-6 border border-warning/50 bg-warning/5">
                <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4 animate-pulse-slow" />
                <h2 className="font-typewriter text-xl text-warning mb-4">PSYCHOLOGICAL ADVISORY</h2>
                <div className="text-left space-y-3 text-sm text-muted-foreground font-clinical">
                  <p>The following case files are reconstructions based on forensic science principles. They are designed to be psychologically unsettling.</p>
                  <p>Evidence presented may be <span className="text-blood">contaminated</span>, <span className="text-blood">misleading</span>, or <span className="text-blood">contradictory</span>. This is intentional.</p>
                  <p>You will never receive a definitive answer. Some truths remain buried.</p>
                  <p className="text-warning/80 italic">"The mind that opens to a new idea never returns to its original size."</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50 font-terminal">
                <Lock className="w-3 h-3" />
                <span>ENCRYPTION: ACTIVE</span>
                <span className="mx-2">|</span>
                <Shield className="w-3 h-3" />
                <span>CLEARANCE: PENDING</span>
              </div>

              <Button 
                onClick={acknowledgeWarning}
                variant="outline"
                className="border-warning/50 text-warning hover:bg-warning/10 font-terminal tracking-widest"
              >
                PROCEED ANYWAY
              </Button>
            </div>
          )}

          {warningStep === 2 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="p-6 border border-foreground/20 bg-card">
                <Eye className="w-16 h-16 text-foreground/50 mx-auto mb-4" />
                <h2 className="font-typewriter text-xl text-foreground mb-4">FINAL ACKNOWLEDGMENT</h2>
                <div className="text-left space-y-4 text-sm font-terminal text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-blood">□</span>
                    I accept that I may be exposed to simulated forensic content that some find disturbing.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blood">□</span>
                    I understand that no case will provide closure or definitive answers.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blood">□</span>
                    I acknowledge that the system cannot be held responsible for psychological discomfort.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blood">□</span>
                    I accept responsibility for whatever truths I uncover.
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/30 font-terminal">
                By proceeding, you waive all claims of ignorance.
              </p>

              <Button 
                onClick={acknowledgeWarning}
                className="bg-blood hover:bg-blood/80 text-primary-foreground font-terminal tracking-widest horror-button"
              >
                ENTER THE ARCHIVE
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background static-overlay">
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        <div className="absolute w-full h-px bg-foreground/5 animate-scan-line" />
      </div>

      {/* Audio Controller */}
      <AudioController />

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-blood/20 border border-blood/30">
                <Skull className="w-6 h-6 text-blood animate-pulse-slow" />
              </div>
              <div>
                <h1 className="font-typewriter text-lg md:text-xl text-foreground tracking-wider">
                  <GlitchText text="EVIDENCE ARCHIVE" intensity="low" continuous />
                </h1>
                <p className="text-xs text-muted-foreground font-terminal tracking-widest hidden sm:block">
                  CASE FILE DATABASE // CLEARANCE LEVEL: UNRESTRICTED
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <InvestigatorProfile />
              
              {gameState !== 'menu' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewCase}
                  className="border-border text-muted-foreground hover:text-foreground hover:border-blood/50 horror-button"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Abandon Investigation
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Menu State - Case File Dashboard */}
        {gameState === 'menu' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* System Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-terminal">
              <div className="p-2 bg-card border border-border text-center">
                <span className="text-muted-foreground">STATUS:</span>
                <span className="text-success ml-2 animate-pulse">ONLINE</span>
              </div>
              <div className="p-2 bg-card border border-border text-center">
                <span className="text-muted-foreground">CASES:</span>
                <span className="text-blood ml-2">∞ PENDING</span>
              </div>
              <div className="p-2 bg-card border border-border text-center">
                <span className="text-muted-foreground">SOLVED:</span>
                <span className="text-warning ml-2">CLASSIFIED</span>
              </div>
              <div className="p-2 bg-card border border-border text-center">
                <span className="text-muted-foreground">OBSERVER:</span>
                <span className="text-foreground ml-2">ACTIVE</span>
              </div>
            </div>

            {/* Advisory Banner */}
            <div className="p-4 border border-blood/30 bg-blood/5 rounded">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blood flex-shrink-0 mt-0.5 animate-pulse-slow" />
                <div className="text-sm">
                  <p className="text-blood font-semibold font-typewriter">MANDATORY DISCLOSURE</p>
                  <p className="text-muted-foreground mt-1 font-clinical">
                    These records document real forensic methodologies applied to simulated scenarios. 
                    Evidence may be incomplete, corrupted, or deliberately falsified. 
                    No case file guarantees resolution. Most remain open indefinitely.
                  </p>
                </div>
              </div>
            </div>

            {/* Main Entry */}
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-blood/10 border border-blood/20 mb-4">
                <Eye className="w-16 h-16 text-blood/70 animate-pulse-slow" />
              </div>
              <h2 className="font-typewriter text-3xl md:text-4xl text-foreground tracking-wide">
                CASE FILE DATABASE
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto font-clinical text-sm leading-relaxed">
                You have been granted access to cold case files pending review. 
                Examine evidence. Reconstruct timelines. Document your findings.
                <span className="block mt-2 text-blood/70 italic">
                  The dead cannot speak for themselves. Someone must.
                </span>
              </p>
            </div>

            {/* Clearance Selection */}
            <div className="case-file p-6 space-y-6">
              <div className="flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-blood" />
                <h3 className="font-semibold text-foreground font-typewriter tracking-wide">
                  SELECT CLEARANCE LEVEL
                </h3>
              </div>
              
              <DifficultySelector 
                selected={difficulty} 
                onSelect={setDifficulty} 
              />

              <div className="p-3 bg-background border border-border text-xs font-terminal text-muted-foreground">
                <p><span className="text-blood">&gt;</span> Higher clearance exposes you to more complex evidence.</p>
                <p><span className="text-blood">&gt;</span> Contradictions increase. Red herrings multiply.</p>
                <p><span className="text-blood">&gt;</span> The truth becomes harder to distinguish from fabrication.</p>
              </div>

              <Button 
                onClick={startNewCase}
                className="w-full bg-blood hover:bg-blood/80 text-primary-foreground font-typewriter py-6 tracking-widest horror-button"
              >
                <Eye className="w-5 h-5 mr-2" />
                ENTER THE CRIME SCENE
              </Button>

              <p className="text-center text-xs text-muted-foreground/50 font-terminal">
                WARNING: Once you begin, you cannot unknow what you learn.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {[
                { value: '∞', label: 'Unsolved Cases', sublabel: 'Waiting in silence' },
                { value: '0%', label: 'Cases Closed', sublabel: 'Without doubt' },
                { value: '???', label: 'True Perpetrators', sublabel: 'Never identified' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-card rounded border border-border">
                  <p className="text-2xl font-bold text-blood font-terminal">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-typewriter">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/50 italic">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investigating State */}
        {gameState === 'investigating' && currentCase && (
          <div className="max-w-6xl mx-auto space-y-6">
            <CaseHeader crimeCase={currentCase} />

            {/* Crime Scene Map */}
            <CrimeSceneMap crimeCase={currentCase} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="case-file p-6">
                <EvidencePanel crimeCase={currentCase} />
              </div>
              
              <div className="case-file p-6">
                <ReconstructionForm 
                  onSubmit={handleSubmit} 
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        {/* Results State */}
        {gameState === 'results' && currentCase && result && (
          <div className="max-w-4xl mx-auto space-y-6">
            <CaseHeader crimeCase={currentCase} />
            
            <div className="case-file p-6">
              <ResultsPanel result={result} onNewCase={handleNewCase} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground font-terminal tracking-widest">
          <p>EVIDENCE ARCHIVE v0.9.1 // SESSION LOGGED // MONITORING ACTIVE</p>
          <p className="mt-1 text-muted-foreground/50">
            "What has been seen cannot be unseen. What has been known cannot be unknown."
          </p>
        </div>
      </footer>
    </div>
  );
}