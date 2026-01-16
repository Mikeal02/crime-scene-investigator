import { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Clock, 
  FileText, 
  Eye, 
  AlertTriangle,
  Award,
  Skull,
  TrendingUp
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface InvestigatorStats {
  casesOpened: number;
  casesAccused: number;
  correctAccusations: number;
  totalTimeInvestigating: number;
  evidenceExamined: number;
  redHerringsIdentified: number;
}

interface InvestigatorProfileProps {
  className?: string;
}

const STORAGE_KEY = 'investigator_profile';

export function InvestigatorProfile({ className }: InvestigatorProfileProps) {
  const [stats, setStats] = useState<InvestigatorStats>({
    casesOpened: 0,
    casesAccused: 0,
    correctAccusations: 0,
    totalTimeInvestigating: 0,
    evidenceExamined: 0,
    redHerringsIdentified: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [rank, setRank] = useState('PROBATIONARY');
  const [rankProgress, setRankProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load investigator profile');
      }
    }
  }, []);

  useEffect(() => {
    // Calculate rank based on stats
    const score = stats.casesOpened * 10 + 
                  stats.correctAccusations * 50 + 
                  stats.evidenceExamined * 2;
    
    const ranks = [
      { name: 'PROBATIONARY', threshold: 0 },
      { name: 'JUNIOR DETECTIVE', threshold: 100 },
      { name: 'DETECTIVE', threshold: 300 },
      { name: 'SENIOR DETECTIVE', threshold: 600 },
      { name: 'INSPECTOR', threshold: 1000 },
      { name: 'CHIEF INSPECTOR', threshold: 2000 },
      { name: 'SUPERINTENDENT', threshold: 5000 },
    ];

    const currentRankIndex = ranks.findIndex((r, i) => {
      const next = ranks[i + 1];
      return !next || score < next.threshold;
    });

    const currentRank = ranks[currentRankIndex];
    const nextRank = ranks[currentRankIndex + 1];
    
    setRank(currentRank.name);
    
    if (nextRank) {
      const progress = ((score - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100;
      setRankProgress(Math.min(100, Math.max(0, progress)));
    } else {
      setRankProgress(100);
    }
  }, [stats]);

  const accuracyRate = stats.casesAccused > 0 
    ? Math.round((stats.correctAccusations / stats.casesAccused) * 100) 
    : 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={cn("relative", className)}>
      {/* Collapsed View */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center gap-2 p-2 bg-card/95 backdrop-blur-sm border border-border rounded transition-all hover:border-blood/50",
          isExpanded && "border-blood/50"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-blood/20 border border-blood/30 flex items-center justify-center">
          <User className="w-4 h-4 text-blood" />
        </div>
        <div className="text-left">
          <p className="text-xs font-typewriter text-foreground">{rank}</p>
          <p className="text-[10px] font-terminal text-muted-foreground">
            {stats.casesOpened} cases
          </p>
        </div>
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-card border border-border rounded p-4 shadow-xl animate-fade-in z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blood" />
              <span className="font-typewriter text-sm text-foreground">
                INVESTIGATOR PROFILE
              </span>
            </div>
            <Award className={cn(
              "w-4 h-4",
              accuracyRate >= 70 && "text-forensic",
              accuracyRate >= 40 && accuracyRate < 70 && "text-warning",
              accuracyRate < 40 && "text-blood"
            )} />
          </div>

          {/* Rank Progress */}
          <div className="mb-4 p-3 bg-background border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-terminal text-muted-foreground">CURRENT RANK</span>
              <span className="text-xs font-typewriter text-blood">{rank}</span>
            </div>
            <Progress value={rankProgress} className="h-1.5" />
            <p className="text-[10px] font-terminal text-muted-foreground/60 mt-1">
              {Math.round(rankProgress)}% to next rank
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-background border border-border">
              <FileText className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-terminal text-foreground">{stats.casesOpened}</p>
              <p className="text-[10px] text-muted-foreground">Cases Opened</p>
            </div>
            <div className="p-2 bg-background border border-border">
              <Skull className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-terminal text-foreground">{stats.casesAccused}</p>
              <p className="text-[10px] text-muted-foreground">Accusations</p>
            </div>
            <div className="p-2 bg-background border border-border">
              <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className={cn(
                "text-lg font-terminal",
                accuracyRate >= 70 && "text-forensic",
                accuracyRate >= 40 && accuracyRate < 70 && "text-warning",
                accuracyRate < 40 && "text-blood"
              )}>
                {accuracyRate}%
              </p>
              <p className="text-[10px] text-muted-foreground">Accuracy</p>
            </div>
            <div className="p-2 bg-background border border-border">
              <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-terminal text-foreground">
                {formatTime(stats.totalTimeInvestigating)}
              </p>
              <p className="text-[10px] text-muted-foreground">Time Spent</p>
            </div>
          </div>

          {/* Evidence Stats */}
          <div className="mt-3 p-2 bg-background border border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Evidence Examined
              </span>
              <span className="font-terminal text-foreground">{stats.evidenceExamined}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Red Herrings Found
              </span>
              <span className="font-terminal text-warning">{stats.redHerringsIdentified}</span>
            </div>
          </div>

          {/* Warning */}
          <p className="text-[10px] font-terminal text-muted-foreground/50 mt-3 text-center">
            Every case leaves its mark.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to update stats (export for use in other components)
export function updateInvestigatorStats(update: Partial<InvestigatorStats>) {
  const saved = localStorage.getItem(STORAGE_KEY);
  const current: InvestigatorStats = saved ? JSON.parse(saved) : {
    casesOpened: 0,
    casesAccused: 0,
    correctAccusations: 0,
    totalTimeInvestigating: 0,
    evidenceExamined: 0,
    redHerringsIdentified: 0,
  };

  const updated = {
    ...current,
    casesOpened: current.casesOpened + (update.casesOpened || 0),
    casesAccused: current.casesAccused + (update.casesAccused || 0),
    correctAccusations: current.correctAccusations + (update.correctAccusations || 0),
    totalTimeInvestigating: current.totalTimeInvestigating + (update.totalTimeInvestigating || 0),
    evidenceExamined: current.evidenceExamined + (update.evidenceExamined || 0),
    redHerringsIdentified: current.redHerringsIdentified + (update.redHerringsIdentified || 0),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
