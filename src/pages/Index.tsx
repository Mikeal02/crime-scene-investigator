import { useState, useCallback } from 'react';
import { CrimeCase, UserReconstruction, ValidationResult } from '@/types/crime';
import { generateCrimeCase } from '@/lib/crimeGenerator';
import { validateReconstruction } from '@/lib/logicValidator';
import { CaseHeader } from '@/components/CaseHeader';
import { EvidencePanel } from '@/components/EvidencePanel';
import { ReconstructionForm } from '@/components/ReconstructionForm';
import { ResultsPanel } from '@/components/ResultsPanel';
import { DifficultySelector } from '@/components/DifficultySelector';
import { Button } from '@/components/ui/button';
import { 
  Skull, 
  Eye, 
  RotateCcw,
  FileWarning,
  AlertTriangle
} from 'lucide-react';

type GameState = 'menu' | 'investigating' | 'results';

export default function Index() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [currentCase, setCurrentCase] = useState<CrimeCase | null>(null);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    }, 2000);
  }, [currentCase]);

  const handleNewCase = useCallback(() => {
    setGameState('menu');
    setCurrentCase(null);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background static-overlay">
      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        <div className="absolute w-full h-px bg-foreground/5 animate-scan-line" />
      </div>

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
                  EVIDENCE ARCHIVE
                </h1>
                <p className="text-xs text-muted-foreground font-terminal tracking-widest hidden sm:block">
                  CLASSIFIED // AUTHORIZED PERSONNEL ONLY
                </p>
              </div>
            </div>
            
            {gameState !== 'menu' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewCase}
                className="border-border text-muted-foreground hover:text-foreground hover:border-blood/50 horror-button"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Abandon Case
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Warning Banner */}
            <div className="p-4 border border-blood/30 bg-blood/5 rounded flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blood flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blood font-semibold font-typewriter">PSYCHOLOGICAL ADVISORY</p>
                <p className="text-muted-foreground mt-1">
                  The following case files contain disturbing content based on forensic science principles. 
                  Proceed with caution. Some truths, once seen, cannot be unseen.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-blood/10 border border-blood/20 mb-4">
                <Eye className="w-16 h-16 text-blood/70 animate-pulse-slow" />
              </div>
              <h2 className="font-typewriter text-3xl md:text-4xl text-foreground tracking-wide">
                ACCESS GRANTED
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto font-clinical text-sm leading-relaxed">
                You are now entering a restricted forensic database. Analyze evidence. 
                Reconstruct timelines. Identify inconsistencies. The dead are waiting 
                for someone to tell their story correctly.
              </p>
            </div>

            <div className="case-file p-6 space-y-6">
              <div className="flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-blood" />
                <h3 className="font-semibold text-foreground font-typewriter tracking-wide">CLEARANCE LEVEL</h3>
              </div>
              
              <DifficultySelector 
                selected={difficulty} 
                onSelect={setDifficulty} 
              />

              <Button 
                onClick={startNewCase}
                className="w-full bg-blood hover:bg-blood/80 text-primary-foreground font-typewriter py-6 tracking-widest horror-button"
              >
                <Eye className="w-5 h-5 mr-2" />
                ENTER THE CRIME SCENE
              </Button>

              <p className="text-center text-xs text-muted-foreground font-terminal">
                By proceeding, you accept responsibility for what you uncover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {[
                { value: '∞', label: 'Unsolved Cases', sublabel: 'Waiting' },
                { value: '0', label: 'Clean Answers', sublabel: 'Expected' },
                { value: '?', label: 'Culprits', sublabel: 'Never Revealed' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-card rounded border border-border">
                  <p className="text-2xl font-bold text-blood font-terminal">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-typewriter">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/50">{stat.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investigating State */}
        {gameState === 'investigating' && currentCase && (
          <div className="max-w-6xl mx-auto space-y-6">
            <CaseHeader crimeCase={currentCase} />
            
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
          <p>EVIDENCE ARCHIVE v0.9.1 // UNAUTHORIZED ACCESS WILL BE LOGGED</p>
          <p className="mt-1 text-muted-foreground/50">The truth is rarely comfortable. Continue at your own risk.</p>
        </div>
      </footer>
    </div>
  );
}
