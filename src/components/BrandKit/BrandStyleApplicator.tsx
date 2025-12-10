import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Check, Eye, Lightbulb } from 'lucide-react';
import { Button } from '../ui/UIComponents';
import { useBrandKit } from '../../contexts/BrandKitContext';
import { BrandKitSelector } from './BrandKitSelector';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { BrandSuggestions } from './BrandSuggestions';

interface ProcessStep {
  label: string;
  status: 'pending' | 'processing' | 'done';
}

interface ScoreImprovement {
  label: string;
  before: number;
  after: number;
}

export const BrandStyleApplicator: React.FC = () => {
  const { activeBrandKit } = useBrandKit();
  const [isApplying, setIsApplying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [scoresBefore] = useState({
    overall: 67,
    colors: 72,
    lighting: 85,
    composition: 58,
    mood: 75
  });
  const [scoresAfter, setScoresAfter] = useState<typeof scoresBefore | null>(null);
  
  // Mock images for demo
  const beforeImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800';
  const afterImage = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800';
  
  const steps: ProcessStep[] = [
    { label: 'Analyzing current image...', status: 'pending' },
    { label: 'Comparing with brand style...', status: 'pending' },
    { label: 'Adjusting colors...', status: 'pending' },
    { label: 'Modifying lighting...', status: 'pending' },
    { label: 'Optimizing composition...', status: 'pending' }
  ];

  const handleApplyStyle = async () => {
    if (!activeBrandKit) return;
    
    setIsApplying(true);
    setCurrentStep(0);
    setScoresAfter(null);
    
    // Simulate AI processing with steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Show final results (score < 90 to show suggestions)
    setScoresAfter({
      overall: 85,
      colors: 88,
      lighting: 90,
      composition: 78,
      mood: 85
    });
    
    setIsApplying(false);
  };
  
  const getStepStatus = (index: number): 'pending' | 'processing' | 'done' => {
    if (index < currentStep) return 'done';
    if (index === currentStep) return 'processing';
    return 'pending';
  };
  
  const improvements: ScoreImprovement[] = scoresAfter ? [
    { label: 'Colors', before: scoresBefore.colors, after: scoresAfter.colors },
    { label: 'Lighting', before: scoresBefore.lighting, after: scoresAfter.lighting },
    { label: 'Composition', before: scoresBefore.composition, after: scoresAfter.composition },
    { label: 'Mood', before: scoresBefore.mood, after: scoresAfter.mood }
  ] : [];

  if (!activeBrandKit) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <AlertCircle size={40} className="text-zinc-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
            No Active Brand Kit
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 px-4">
            Go to Brand Kits page to create your first brand kit
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Brand Kit Selector */}
      <div>
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
          Active Brand
        </p>
        <BrandKitSelector />
      </div>

      {/* Apply Button */}
      <Button
        onClick={handleApplyStyle}
        isLoading={isApplying}
        className="w-full gap-2"
        disabled={isApplying}
      >
        <Sparkles size={16} className={isApplying ? 'animate-spin' : ''} />
        {isApplying ? 'Applying Brand Style...' : 'Apply Brand Style'}
      </Button>

      {/* Processing Steps */}
      {isApplying && (
        <div className="bg-gradient-to-br from-repix-50 to-pink-50 dark:from-repix-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-repix-200 dark:border-repix-800">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-repix-500 animate-pulse" />
            <span className="text-xs font-bold text-repix-900 dark:text-repix-100">
              AI Processing
            </span>
          </div>
          <div className="space-y-2">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    status === 'done' 
                      ? 'bg-green-500' 
                      : status === 'processing'
                      ? 'bg-repix-500 animate-pulse'
                      : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}>
                    {status === 'done' && <Check size={10} className="text-white" />}
                    {status === 'processing' && (
                      <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    )}
                  </div>
                  <span className={`text-xs ${
                    status === 'done'
                      ? 'text-green-700 dark:text-green-300 line-through'
                      : status === 'processing'
                      ? 'text-repix-700 dark:text-repix-300 font-semibold'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info - Only show when not processing and no results */}
      {!isApplying && !scoresAfter && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <p className="flex items-center gap-2">
            <TrendingUp size={12} />
            This will adjust colors, lighting, and composition
          </p>
          <p>Estimated improvement: +28% consistency</p>
        </div>
      )}

      {/* Results - Consistency Score Improvement */}
      {scoresAfter && (
        <div className="space-y-3">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-green-900 dark:text-green-100">
                Consistency Score
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-zinc-500 dark:text-zinc-400 line-through">
                  {scoresBefore.overall}%
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {scoresAfter.overall}%
                </span>
                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">
                  +{scoresAfter.overall - scoresBefore.overall}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-green-200 dark:bg-green-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                style={{ width: `${scoresAfter.overall}%` }}
              />
            </div>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2 flex items-center gap-1">
              <Check size={12} />
              Excellent! Your image matches the brand style perfectly.
            </p>
          </div>

          {/* Detailed Improvements */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
              <TrendingUp size={12} />
              Improvements
            </p>
            <div className="space-y-2">
              {improvements.map((item, index) => {
                const improvement = item.after - item.before;
                return (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                      {item.label}:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 dark:text-zinc-500">
                        {item.before}%
                      </span>
                      <span className="text-zinc-300 dark:text-zinc-600">→</span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {item.after}%
                      </span>
                      <span className={`font-bold px-1.5 py-0.5 rounded ${
                        improvement > 20
                          ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                          : improvement > 10
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
                          : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800'
                      }`}>
                        +{improvement}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setShowComparison(true)}
              variant="secondary"
              className="gap-2"
            >
              <Eye size={16} />
              Compare
            </Button>
            
            <Button
              onClick={() => setShowSuggestions(true)}
              variant="secondary"
              className="gap-2"
            >
              <Lightbulb size={16} />
              {scoresAfter.overall < 90 ? 'View Suggestions' : 'Tips'}
            </Button>
          </div>
        </div>
      )}

      {/* Before/After Comparison Modal */}
      {showComparison && scoresAfter && (
        <BeforeAfterComparison
          beforeImage={beforeImage}
          afterImage={afterImage}
          beforeScore={scoresBefore.overall}
          afterScore={scoresAfter.overall}
          onKeep={() => {
            setShowComparison(false);
            // Keep the changes
          }}
          onUndo={() => {
            setShowComparison(false);
            setScoresAfter(null);
            // Undo the changes
          }}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Suggestions Modal */}
      {showSuggestions && scoresAfter && (
        <BrandSuggestions
          currentScore={scoresAfter.overall}
          onApplySuggestion={(suggestionId) => {
            console.log('Applying suggestion:', suggestionId);
            // Apply individual suggestion
          }}
          onApplyAll={() => {
            setShowSuggestions(false);
            // Apply all suggestions and update score
            setScoresAfter({
              overall: 100,
              colors: 100,
              lighting: 100,
              composition: 100,
              mood: 100
            });
          }}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};
