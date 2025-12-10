import React, { useState } from 'react';
import { X, Eye, Sparkles } from 'lucide-react';

interface Suggestion {
  id: string;
  number: string;
  title: string;
  description: string;
  impact: string;
  color: string;
}

interface BrandSuggestionsProps {
  currentScore: number;
  onApplySuggestion: (suggestionId: string) => void;
  onApplyAll: () => void;
  onClose: () => void;
}

export const BrandSuggestions: React.FC<BrandSuggestionsProps> = ({
  currentScore,
  onApplySuggestion,
  onApplyAll,
  onClose
}) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  const suggestions: Suggestion[] = [
    {
      id: 'color-temp',
      number: '1',
      title: 'Adjust Color Temperature',
      description: 'Add +10% warmth to match brand palette',
      impact: '+3%',
      color: 'from-purple-500 to-fuchsia-500'
    },
    {
      id: 'contrast',
      number: '2',
      title: 'Increase Contrast',
      description: 'Boost contrast by 15% for better clarity',
      impact: '+2%',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'composition',
      number: '3',
      title: 'Center Composition',
      description: 'Crop to center subject',
      impact: '+5%',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const potentialScore = 100;

  const handleApply = (suggestionId: string) => {
    setAppliedSuggestions(prev => new Set([...prev, suggestionId]));
    onApplySuggestion(suggestionId);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-pink-600 px-6 py-6">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-1.5">
              Improve
            </h2>
            <p className="text-white/90 text-xs leading-relaxed mb-4">
              Apply these suggestions<br />to reach {potentialScore}% consistency
            </p>

            {/* Score Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-white/70 font-medium">
                <span>Current Score</span>
                <span>Potential Score</span>
              </div>
              <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-white transition-all duration-500"
                  style={{ width: `${potentialScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{currentScore}%</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/60">+10%</span>
                  <span className="text-2xl font-bold text-white">{potentialScore}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="p-3 space-y-2 bg-black">
          {suggestions.map((suggestion) => {
            const isApplied = appliedSuggestions.has(suggestion.id);

            return (
              <div
                key={suggestion.id}
                className="rounded-xl p-3 bg-zinc-900 border border-zinc-800"
              >
                <div className="flex items-start gap-3">
                  {/* Number Badge */}
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-base font-bold text-white">{suggestion.number}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-xs font-bold text-white leading-tight">
                        {suggestion.title}
                      </h3>
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500/20 rounded text-[10px] font-bold text-green-400">
                        <span>↗</span>
                        <span>{suggestion.impact}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 mb-2.5 leading-snug">
                      {suggestion.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
                        disabled={isApplied}
                      >
                        <Eye size={12} />
                        Preview
                      </button>
                      <button
                        onClick={() => handleApply(suggestion.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                          isApplied
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                        }`}
                        disabled={isApplied}
                      >
                        <Sparkles size={12} />
                        {isApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black">
          <p className="text-[10px] text-zinc-500 text-center mb-2 leading-relaxed">
            Apply all suggestions to maximize<br />consistency
          </p>
          <button
            onClick={onApplyAll}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 hover:from-purple-500 hover:via-pink-400 hover:to-pink-500 rounded-lg transition-all disabled:opacity-50"
            disabled={appliedSuggestions.size === suggestions.length}
          >
            <Sparkles size={14} />
            Apply All
          </button>
        </div>
      </div>
    </div>
  );
};
