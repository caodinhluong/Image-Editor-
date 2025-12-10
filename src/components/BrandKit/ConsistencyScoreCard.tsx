import React from 'react';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { Card, Button } from '../ui/UIComponents';
import { useBrandKit } from '../../contexts/BrandKitContext';

interface ConsistencyScoreCardProps {
  score?: number;
  onViewSuggestions?: () => void;
}

export const ConsistencyScoreCard: React.FC<ConsistencyScoreCardProps> = ({ 
  score = 0,
  onViewSuggestions 
}) => {
  const { activeBrandKit } = useBrandKit();

  if (!activeBrandKit) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };

  const breakdown = {
    colors: 98,
    lighting: 95,
    composition: 92,
    mood: 96,
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Brand Consistency
          </h3>
          <TrendingUp size={20} className="text-repix-500" />
        </div>

        {/* Overall Score */}
        <div className="text-center py-6">
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            {getScoreLabel(score)}
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
            Breakdown
          </p>
          
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-700 dark:text-zinc-300 capitalize">
                  {key}
                </span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {value}%
                </span>
              </div>
              <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-repix-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {score < 100 && onViewSuggestions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewSuggestions}
            className="w-full gap-2"
          >
            <Lightbulb size={16} />
            {score < 90 ? '3 suggestions to improve' : 'View suggestions'}
          </Button>
        )}
      </div>
    </Card>
  );
};
