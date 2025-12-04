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
  Fingerprint, 
  PlayCircle, 
  RotateCcw,
  BookOpen
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
    
    // Simulate analysis time
    setTimeout(() => {
      const validationResult = validateReconstruction(currentCase, reconstruction);
      setResult(validationResult);
      setGameState('results');
      setIsSubmitting(false);
    }, 1500);
  }, [currentCase]);

  const handleNewCase = useCallback(() => {
    setGameState('menu');
    setCurrentCase(null);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Fingerprint className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-typewriter text-lg md:text-xl text-foreground">
                  Digital Crime Scene Simulator
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Test your forensic reasoning skills
                </p>
              </div>
            </div>
            
            {gameState !== 'menu' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewCase}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Case
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Menu State */}
        {gameState === 'menu' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Fingerprint className="w-16 h-16 text-primary" />
              </div>
              <h2 className="font-typewriter text-3xl md:text-4xl text-foreground">
                Welcome, Detective
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Analyze forensic evidence, reconstruct crime scenes, and test your logical 
                reasoning against our validation engine.
              </p>
            </div>

            <div className="case-file p-6 space-y-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Select Difficulty</h3>
              </div>
              
              <DifficultySelector 
                selected={difficulty} 
                onSelect={setDifficulty} 
              />

              <Button 
                onClick={startNewCase}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Begin Investigation
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {[
                { value: '4', label: 'Evidence Types' },
                { value: '100', label: 'Max Score' },
                { value: '∞', label: 'Random Cases' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-card rounded-lg border border-border">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
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
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Digital Crime Scene Simulator • Train Your Forensic Reasoning</p>
        </div>
      </footer>
    </div>
  );
}
