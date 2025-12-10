import React, { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, Target, Lightbulb, Eye, 
  BarChart3, Zap, Clock, Hash, ArrowUp, Check,
  Palette, Layout, Sun, Heart, X
} from 'lucide-react';
import { Button, Card, Badge } from '../ui/UIComponents';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';

interface AIContentAdvisorProps {
  imageUrl?: string;
  onApplySuggestion?: (suggestionId: string) => void;
  onClose?: () => void;
}

interface Suggestion {
  id: string;
  category: 'color' | 'composition' | 'lighting' | 'trend';
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  impact: number;
  icon: React.ElementType;
  color: string;
}

interface ScoreBreakdown {
  composition: number;
  colorHarmony: number;
  visualInterest: number;
  platformFit: number;
  trendAlignment: number;
}

export const AIContentAdvisor: React.FC<AIContentAdvisorProps> = ({
  imageUrl,
  onApplySuggestion,
  onClose
}) => {
  const { language } = useLanguage();
  const { canAccess, triggerUpgradeModal } = useSubscription();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [predictedEngagement, setPredictedEngagement] = useState(0);
  const [estimatedReach, setEstimatedReach] = useState(0);

  // Simulate AI analysis
  useEffect(() => {
    if (imageUrl) {
      analyzeImage();
    }
  }, [imageUrl]);

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis results
    const mockBreakdown: ScoreBreakdown = {
      composition: Math.floor(Math.random() * 20) + 75,
      colorHarmony: Math.floor(Math.random() * 20) + 70,
      visualInterest: Math.floor(Math.random() * 20) + 72,
      platformFit: Math.floor(Math.random() * 20) + 68,
      trendAlignment: Math.floor(Math.random() * 20) + 78,
    };
    
    const avgScore = Math.round(
      Object.values(mockBreakdown).reduce((a, b) => a + b, 0) / 5
    );
    
    setBreakdown(mockBreakdown);
    setOverallScore(avgScore);
    setPredictedEngagement(parseFloat((Math.random() * 3 + 2).toFixed(1)));
    setEstimatedReach(Math.floor(Math.random() * 10000) + 5000);
    
    // Generate suggestions based on scores
    const mockSuggestions: Suggestion[] = [];
    
    if (mockBreakdown.colorHarmony < 85) {
      mockSuggestions.push({
        id: 'color-saturation',
        category: 'color',
        title: 'Increase Saturation',
        titleVi: 'Tăng độ bão hòa',
        description: 'Add 15% more saturation for Instagram',
        descriptionVi: 'Tăng 15% độ bão hòa cho Instagram',
        impact: 12,
        icon: Palette,
        color: 'from-pink-500 to-rose-500'
      });
    }
    
    if (mockBreakdown.composition < 85) {
      mockSuggestions.push({
        id: 'rule-of-thirds',
        category: 'composition',
        title: 'Crop to Rule of Thirds',
        titleVi: 'Cắt theo quy tắc 1/3',
        description: 'Reposition subject for better balance',
        descriptionVi: 'Đặt lại chủ thể để cân bằng hơn',
        impact: 8,
        icon: Layout,
        color: 'from-blue-500 to-cyan-500'
      });
    }
    
    if (mockBreakdown.visualInterest < 85) {
      mockSuggestions.push({
        id: 'bokeh-effect',
        category: 'trend',
        title: 'Add Bokeh Effect',
        titleVi: 'Thêm hiệu ứng Bokeh',
        description: 'Trending +45% this week',
        descriptionVi: 'Xu hướng +45% tuần này',
        impact: 18,
        icon: Sparkles,
        color: 'from-purple-500 to-violet-500'
      });
    }
    
    if (mockBreakdown.platformFit < 80) {
      mockSuggestions.push({
        id: 'lighting-adjust',
        category: 'lighting',
        title: 'Brighten Shadows',
        titleVi: 'Làm sáng vùng tối',
        description: 'Improve visibility on mobile',
        descriptionVi: 'Cải thiện hiển thị trên mobile',
        impact: 10,
        icon: Sun,
        color: 'from-amber-500 to-orange-500'
      });
    }
    
    setSuggestions(mockSuggestions);
    setIsAnalyzing(false);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    if (!canAccess('advancedAI')) {
      triggerUpgradeModal('advancedAI');
      return;
    }
    
    setAppliedSuggestions(prev => new Set([...prev, suggestionId]));
    
    // Update score after applying
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      setOverallScore(prev => Math.min(100, prev + Math.floor(suggestion.impact / 2)));
      setPredictedEngagement(prev => parseFloat((prev + suggestion.impact / 10).toFixed(1)));
    }
    
    onApplySuggestion?.(suggestionId);
  };

  const handleApplyAll = () => {
    if (!canAccess('advancedAI')) {
      triggerUpgradeModal('advancedAI');
      return;
    }
    
    suggestions.forEach(s => {
      if (!appliedSuggestions.has(s.id)) {
        handleApplySuggestion(s.id);
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return language === 'vi' ? 'Xuất sắc' : 'Excellent';
    if (score >= 70) return language === 'vi' ? 'Tốt' : 'Good';
    return language === 'vi' ? 'Cần cải thiện' : 'Needs Work';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {language === 'vi' ? 'AI Content Advisor' : 'AI Content Advisor'}
            </h2>
            <p className="text-xs text-zinc-500">
              {language === 'vi' ? 'Phân tích & tối ưu hóa ảnh' : 'Analyze & optimize your image'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        )}
      </div>


      {/* Loading State */}
      {isAnalyzing && (
        <Card className="p-8 text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Sparkles size={24} className="text-purple-500 animate-pulse" />
            </div>
          </div>
          <p className="font-bold text-zinc-900 dark:text-white mb-1">
            {language === 'vi' ? 'Đang phân tích...' : 'Analyzing...'}
          </p>
          <p className="text-sm text-zinc-500">
            {language === 'vi' ? 'AI đang đánh giá ảnh của bạn' : 'AI is evaluating your image'}
          </p>
        </Card>
      )}

      {/* Results */}
      {!isAnalyzing && breakdown && (
        <>
          {/* Overall Score */}
          <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={20} className="text-purple-500" />
                <span className="font-bold text-zinc-900 dark:text-white">
                  {language === 'vi' ? 'Điểm Hiệu Suất' : 'Performance Score'}
                </span>
              </div>
              <Badge variant="pro">{getScoreLabel(overallScore)}</Badge>
            </div>
            
            <div className="flex items-end gap-4 mb-4">
              <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}
              </div>
              <div className="text-2xl text-zinc-400 mb-1">/100</div>
            </div>

            {/* Predictions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={14} className="text-pink-500" />
                  <span className="text-xs text-zinc-500">
                    {language === 'vi' ? 'Dự đoán Engagement' : 'Predicted Engagement'}
                  </span>
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">
                  {predictedEngagement}%
                  <span className="text-xs text-green-500 ml-1">
                    ({language === 'vi' ? 'Tốt' : 'Good'})
                  </span>
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={14} className="text-blue-500" />
                  <span className="text-xs text-zinc-500">
                    {language === 'vi' ? 'Ước tính Reach' : 'Estimated Reach'}
                  </span>
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">
                  {(estimatedReach / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-zinc-500" />
              <span className="font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Chi tiết đánh giá' : 'Score Breakdown'}
              </span>
            </div>
            
            <div className="space-y-3">
              {[
                { key: 'composition', label: language === 'vi' ? 'Bố cục' : 'Composition', value: breakdown.composition },
                { key: 'colorHarmony', label: language === 'vi' ? 'Hài hòa màu' : 'Color Harmony', value: breakdown.colorHarmony },
                { key: 'visualInterest', label: language === 'vi' ? 'Độ hấp dẫn' : 'Visual Interest', value: breakdown.visualInterest },
                { key: 'platformFit', label: language === 'vi' ? 'Phù hợp nền tảng' : 'Platform Fit', value: breakdown.platformFit },
                { key: 'trendAlignment', label: language === 'vi' ? 'Theo xu hướng' : 'Trend Alignment', value: breakdown.trendAlignment },
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400">{item.label}</span>
                    <span className={`font-bold ${getScoreColor(item.value)}`}>{item.value}%</span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.value >= 85 ? 'bg-green-500' : item.value >= 70 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500" />
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {language === 'vi' ? 'Gợi ý cải thiện' : 'Improvement Suggestions'}
                  </span>
                </div>
                <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  {suggestions.length} {language === 'vi' ? 'gợi ý' : 'tips'}
                </Badge>
              </div>

              <div className="space-y-3">
                {suggestions.map((suggestion) => {
                  const isApplied = appliedSuggestions.has(suggestion.id);
                  const Icon = suggestion.icon;
                  
                  return (
                    <div
                      key={suggestion.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isApplied 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                          : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={18} className="text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                              {language === 'vi' ? suggestion.titleVi : suggestion.title}
                            </h4>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-xs font-bold text-green-600 dark:text-green-400">
                              <ArrowUp size={10} />
                              +{suggestion.impact}%
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                            {language === 'vi' ? suggestion.descriptionVi : suggestion.description}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              disabled={isApplied}
                            >
                              <Eye size={12} className="mr-1" />
                              {language === 'vi' ? 'Xem trước' : 'Preview'}
                            </Button>
                            <Button
                              size="sm"
                              className={`h-7 text-xs ${isApplied ? 'bg-green-500' : ''}`}
                              onClick={() => handleApplySuggestion(suggestion.id)}
                              disabled={isApplied}
                            >
                              {isApplied ? (
                                <>
                                  <Check size={12} className="mr-1" />
                                  {language === 'vi' ? 'Đã áp dụng' : 'Applied'}
                                </>
                              ) : (
                                <>
                                  <Sparkles size={12} className="mr-1" />
                                  {language === 'vi' ? 'Áp dụng' : 'Apply'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Apply All Button */}
              <Button
                onClick={handleApplyAll}
                className="w-full mt-4 gap-2"
                disabled={appliedSuggestions.size === suggestions.length}
              >
                <Zap size={16} />
                {language === 'vi' ? 'Áp dụng tất cả' : 'Apply All Suggestions'}
              </Button>
            </Card>
          )}

          {/* Trending Now */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-pink-500" />
              <span className="font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Xu hướng tuần này' : 'Trending This Week'}
              </span>
            </div>
            
            <div className="space-y-2">
              {[
                { name: language === 'vi' ? 'Phong cách tối giản' : 'Minimalist Style', change: '+67%' },
                { name: language === 'vi' ? 'Màu ấm' : 'Warm Color Grading', change: '+52%' },
                { name: language === 'vi' ? 'Bối cảnh lifestyle' : 'Lifestyle Context', change: '+48%' },
              ].map((trend, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                >
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{trend.name}</span>
                  <span className="text-xs font-bold text-green-500">{trend.change}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Best Post Time */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-blue-500" />
              <span className="font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Thời gian đăng tốt nhất' : 'Best Post Time'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">7:00 PM</p>
                <p className="text-xs text-zinc-500">
                  {language === 'vi' ? 'Thứ 3, Thứ 5, Thứ 7' : 'Tue, Thu, Sat'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-500">+22%</p>
                <p className="text-xs text-zinc-500">
                  {language === 'vi' ? 'reach dự kiến' : 'expected reach'}
                </p>
              </div>
            </div>
          </Card>

          {/* Hashtag Suggestions */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Hash size={18} className="text-purple-500" />
              <span className="font-bold text-zinc-900 dark:text-white">
                {language === 'vi' ? 'Hashtag gợi ý' : 'Suggested Hashtags'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['#productphotography', '#minimalist', '#aesthetic', '#smallbusiness', '#handmade'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
