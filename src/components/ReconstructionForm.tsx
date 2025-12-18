import { useState } from 'react';
import { UserReconstruction } from '@/types/crime';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { 
  FileText, 
  Clock, 
  ArrowRight, 
  Search, 
  Home,
  AlertTriangle,
  Skull,
  Eye
} from 'lucide-react';

interface ReconstructionFormProps {
  onSubmit: (reconstruction: UserReconstruction) => void;
  isSubmitting?: boolean;
}

export function ReconstructionForm({ onSubmit, isSubmitting }: ReconstructionFormProps) {
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [timeline, setTimeline] = useState('');
  const [suspectDirection, setSuspectDirection] = useState<UserReconstruction['suspectDirection']>('unknown');
  const [isStaged, setIsStaged] = useState(false);
  const [isIndoor, setIsIndoor] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      causeOfDeath,
      timeline,
      suspectDirection,
      isStaged,
      isIndoor,
    });
  };

  const isComplete = causeOfDeath.trim() && timeline.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-typewriter text-lg text-blood px-4 tracking-wider">
          FILE YOUR RECONSTRUCTION
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Warning */}
      <div className="p-3 bg-warning/5 border border-warning/30 text-xs font-clinical text-muted-foreground">
        <p className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <span>
            Your reconstruction will be compared against classified case findings. 
            Inconsistencies will be noted. Incorrect accusations have consequences 
            that extend beyond this file.
          </span>
        </p>
      </div>

      {/* Cause of Death */}
      <div className="space-y-2">
        <Label htmlFor="cause" className="flex items-center gap-2 text-foreground font-typewriter text-sm">
          <Skull className="w-4 h-4 text-blood" />
          PROBABLE CAUSE OF DEATH
        </Label>
        <Textarea
          id="cause"
          placeholder="Document your assessment: blunt force trauma, exsanguination, asphyxiation, poisoning..."
          value={causeOfDeath}
          onChange={(e) => setCauseOfDeath(e.target.value)}
          className="bg-background border-border resize-none font-clinical text-sm placeholder:text-muted-foreground/30"
          rows={3}
          required
        />
        <p className="text-xs text-muted-foreground/50 font-terminal">
          Be specific. Vague assessments are flagged for review.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <Label htmlFor="timeline" className="flex items-center gap-2 text-foreground font-typewriter text-sm">
          <Clock className="w-4 h-4 text-blood" />
          RECONSTRUCTED TIMELINE
        </Label>
        <Textarea
          id="timeline"
          placeholder="Describe the sequence of events as you believe they occurred. Account for all evidence..."
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="bg-background border-border resize-none font-clinical text-sm placeholder:text-muted-foreground/30"
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground/50 font-terminal">
          Contradictions in your timeline will be cross-referenced against forensic data.
        </p>
      </div>

      {/* Suspect Direction */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground font-typewriter text-sm">
          <ArrowRight className="w-4 h-4 text-blood" />
          PERPETRATOR MOVEMENT ASSESSMENT
        </Label>
        <RadioGroup
          value={suspectDirection}
          onValueChange={(value) => setSuspectDirection(value as UserReconstruction['suspectDirection'])}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { value: 'entered_and_left', label: 'Entered & Fled', desc: 'External perpetrator' },
            { value: 'entered_only', label: 'Entered Only', desc: 'May still be present' },
            { value: 'left_only', label: 'Departed Only', desc: 'Was already inside' },
            { value: 'unknown', label: 'Indeterminate', desc: 'Insufficient evidence' },
          ].map((option) => (
            <div key={option.value} className="flex items-start space-x-2 p-2 bg-background border border-border rounded hover:border-blood/30 transition-colors">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="border-muted-foreground text-blood mt-0.5"
              />
              <Label
                htmlFor={option.value}
                className="text-sm text-foreground cursor-pointer flex-1"
              >
                <span className="block font-typewriter">{option.label}</span>
                <span className="block text-xs text-muted-foreground/70">{option.desc}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Scene Assessment Switches */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground font-typewriter text-sm">
          <Search className="w-4 h-4 text-blood" />
          SCENE INTEGRITY ASSESSMENT
        </Label>
        
        <div className="flex items-center justify-between p-4 bg-background border border-border rounded">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="staged" className="text-foreground cursor-pointer text-sm">
                Scene Appears Staged
              </Label>
              <p className="text-xs text-muted-foreground/50">Evidence of deliberate arrangement</p>
            </div>
          </div>
          <Switch
            id="staged"
            checked={isStaged}
            onCheckedChange={setIsStaged}
            className="data-[state=checked]:bg-blood"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-background border border-border rounded">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-muted-foreground" />
            <div>
              <Label htmlFor="indoor" className="text-foreground cursor-pointer text-sm">
                Indoor Crime Scene
              </Label>
              <p className="text-xs text-muted-foreground/50">Death occurred within a structure</p>
            </div>
          </div>
          <Switch
            id="indoor"
            checked={isIndoor}
            onCheckedChange={setIsIndoor}
            className="data-[state=checked]:bg-blood"
          />
        </div>
      </div>

      {/* Submission Warning */}
      <div className="p-4 border border-blood/30 bg-blood/5 space-y-3">
        <div className="flex items-center gap-2 text-blood">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-typewriter text-sm">ACCUSATION ADVISORY</span>
        </div>
        <p className="text-xs text-muted-foreground font-clinical">
          Submitting your reconstruction constitutes a formal accusation logged against this case file. 
          Your analysis will be permanently recorded. False accusations may contaminate the investigative record 
          and obscure the truth further.
        </p>
        <p className="text-xs text-blood/70 italic">
          Are you certain your conclusions are sound? Evidence lies. Memory deceives. 
          The guilty often appear innocent.
        </p>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full bg-blood hover:bg-blood/80 text-primary-foreground font-typewriter py-6 tracking-widest horror-button"
        disabled={isSubmitting || !isComplete}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            <span className="animate-pulse">PROCESSING ACCUSATION...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            SUBMIT RECONSTRUCTION
          </span>
        )}
      </Button>

      {!isComplete && (
        <p className="text-center text-xs text-muted-foreground/50 font-terminal">
          All fields must be completed before submission is permitted.
        </p>
      )}
    </form>
  );
}