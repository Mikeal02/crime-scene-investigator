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
  Send
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-border" />
        <h2 className="font-typewriter text-lg text-primary px-4">YOUR RECONSTRUCTION</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Cause of Death */}
      <div className="space-y-2">
        <Label htmlFor="cause" className="flex items-center gap-2 text-foreground">
          <FileText className="w-4 h-4 text-primary" />
          Estimated Cause of Death
        </Label>
        <Textarea
          id="cause"
          placeholder="e.g., Stabbing, blunt force trauma, strangulation..."
          value={causeOfDeath}
          onChange={(e) => setCauseOfDeath(e.target.value)}
          className="bg-secondary border-border resize-none"
          rows={2}
          required
        />
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <Label htmlFor="timeline" className="flex items-center gap-2 text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          Timeline of Events
        </Label>
        <Textarea
          id="timeline"
          placeholder="Describe your theory of how events unfolded..."
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className="bg-secondary border-border resize-none"
          rows={3}
          required
        />
      </div>

      {/* Suspect Direction */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-foreground">
          <ArrowRight className="w-4 h-4 text-primary" />
          Suspect Movement
        </Label>
        <RadioGroup
          value={suspectDirection}
          onValueChange={(value) => setSuspectDirection(value as UserReconstruction['suspectDirection'])}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { value: 'entered_and_left', label: 'Entered & Left' },
            { value: 'entered_only', label: 'Entered Only' },
            { value: 'left_only', label: 'Left Only' },
            { value: 'unknown', label: 'Cannot Determine' },
          ].map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="border-primary text-primary"
              />
              <Label
                htmlFor={option.value}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Staged Assessment */}
      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          <Label htmlFor="staged" className="text-foreground cursor-pointer">
            Crime Scene is Staged
          </Label>
        </div>
        <Switch
          id="staged"
          checked={isStaged}
          onCheckedChange={setIsStaged}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      {/* Indoor/Outdoor */}
      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-primary" />
          <Label htmlFor="indoor" className="text-foreground cursor-pointer">
            Indoor Crime Scene
          </Label>
        </div>
        <Switch
          id="indoor"
          checked={isIndoor}
          onCheckedChange={setIsIndoor}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        disabled={isSubmitting || !causeOfDeath || !timeline}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Analyzing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Reconstruction
          </span>
        )}
      </Button>
    </form>
  );
}
