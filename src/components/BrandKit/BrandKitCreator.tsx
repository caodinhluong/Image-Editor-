import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, X, Palette, Image as ImageIcon, Sparkles, CheckCircle } from 'lucide-react';
import { Button, Input, Badge } from '../ui/UIComponents';
import { useBrandKit } from '../../contexts/BrandKitContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { BrandKit, MoodType } from '../../types/brandKit';

interface BrandKitCreatorProps {
  onClose: () => void;
  onComplete: (brandKit: BrandKit) => void;
}

const MOOD_OPTIONS: MoodType[] = ['energetic', 'calm', 'professional', 'playful', 'elegant', 'bold', 'minimal'];

const PRESET_COLORS = [
  '#FF0000', '#FF6B6B', '#FFA500', '#FFD700', '#00FF00',
  '#00CED1', '#0000FF', '#8B00FF', '#FF1493', '#000000',
  '#FFFFFF', '#808080', '#A0522D', '#FF69B4', '#32CD32',
];

export const BrandKitCreator: React.FC<BrandKitCreatorProps> = ({ onClose, onComplete }) => {
  const { createBrandKit } = useBrandKit();
  const { trans } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Step 1: Basic Info
  const [brandName, setBrandName] = useState('');
  const [primaryColors, setPrimaryColors] = useState<string[]>([]);
  const [secondaryColors, setSecondaryColors] = useState<string[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [styleKeywords, setStyleKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [targetMood, setTargetMood] = useState<MoodType>('professional');

  // Step 2: Sample Images
  const [sampleImages, setSampleImages] = useState<File[]>([]);
  const [samplePreviews, setSamplePreviews] = useState<string[]>([]);

  // Step 3: AI Analysis Progress
  const [analysisProgress, setAnalysisProgress] = useState({
    colors: 0,
    lighting: 0,
    composition: 0,
    mood: 0,
  });

  // Step 4: Results
  const [learnedStyle, setLearnedStyle] = useState<any>(null);

  const handleNext = () => {
    if (currentStep < 4) {
      if (currentStep === 2) {
        // Start AI analysis
        startAIAnalysis();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return brandName.trim().length >= 3 && primaryColors.length >= 1;
      case 2:
        return sampleImages.length >= 5;
      case 3:
        return learnedStyle !== null;
      default:
        return true;
    }
  };

  const handleColorAdd = (color: string, isPrimary: boolean) => {
    if (isPrimary) {
      if (primaryColors.length < 5 && !primaryColors.includes(color)) {
        setPrimaryColors([...primaryColors, color]);
      }
    } else {
      if (secondaryColors.length < 5 && !secondaryColors.includes(color)) {
        setSecondaryColors([...secondaryColors, color]);
      }
    }
  };

  const handleColorRemove = (color: string, isPrimary: boolean) => {
    if (isPrimary) {
      setPrimaryColors(primaryColors.filter(c => c !== color));
    } else {
      setSecondaryColors(secondaryColors.filter(c => c !== color));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file instanceof File && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !styleKeywords.includes(keywordInput.trim())) {
      setStyleKeywords([...styleKeywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleSampleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((f): f is File => f instanceof File && f.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (sampleImages.length + validFiles.length <= 10) {
      setSampleImages([...sampleImages, ...validFiles]);
      
      // Generate previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSamplePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSampleRemove = (index: number) => {
    setSampleImages(sampleImages.filter((_, i) => i !== index));
    setSamplePreviews(samplePreviews.filter((_, i) => i !== index));
  };

  const startAIAnalysis = async () => {
    // Simulate AI analysis with progress
    const steps = ['colors', 'lighting', 'composition', 'mood'] as const;
    
    for (const step of steps) {
      // Animate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setAnalysisProgress(prev => ({ ...prev, [step]: i }));
      }
    }

    // Mock learned style data
    const mockLearnedStyle = {
      colorPalette: {
        dominant: primaryColors.slice(0, 5),
        accent: secondaryColors,
        distribution: [30, 25, 20, 15, 10],
      },
      lighting: {
        type: 'soft' as const,
        intensity: 75,
        direction: 'front' as const,
        confidence: 92,
      },
      composition: {
        pattern: 'centered' as const,
        spacing: 'balanced' as const,
        confidence: 88,
      },
      mood: {
        detected: [targetMood, 'modern', 'clean'],
        alignment: 95,
      },
      backgroundStyle: {
        type: 'solid' as const,
        colors: primaryColors,
        blur: 0,
      },
    };

    setLearnedStyle(mockLearnedStyle);
  };

  const handleCreate = async () => {
    setIsProcessing(true);

    // Use placeholder images to avoid LocalStorage quota issues
    const placeholderImages = samplePreviews.slice(0, 3).map((_, idx) => ({
      id: `sample_${idx}`,
      url: `https://picsum.photos/seed/${brandName}_${idx}/400/400`,
      thumbnail: `https://picsum.photos/seed/${brandName}_${idx}/100/100`,
      uploadedAt: new Date(),
      analysisData: {
        colors: [],
        lighting: { type: 'soft', intensity: 75, direction: 'front' },
        composition: { pattern: 'centered', focalPoints: [] },
        mood: [targetMood],
      },
    }));

    const newBrandKit = await createBrandKit({
      userId: 'current_user', // Replace with actual user ID
      name: brandName,
      profile: {
        primaryColors,
        secondaryColors,
        logo: logoPreview ? {
          url: `https://ui-avatars.com/api/?name=${encodeURIComponent(brandName)}&size=200&background=random`,
          width: 200,
          height: 200,
        } : undefined,
        styleKeywords,
        targetMood,
      },
      learnedStyle,
      sampleImages: placeholderImages,
      metadata: {
        version: 1,
        isShared: false,
        sharedWith: [],
        permissions: {},
        usageCount: 0,
        lastUsed: new Date(),
      },
    });

    setIsProcessing(false);
    onComplete(newBrandKit);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {trans.brandkit.createTitle}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {trans.brandkit.step} {currentStep} {trans.brandkit.of} 4
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={24} className="text-zinc-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Brand Name *
                </label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g., Nike Store Vietnam"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Primary Colors * (1-5 colors)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {primaryColors.map((color) => (
                    <div
                      key={color}
                      className="relative group"
                    >
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-white dark:border-zinc-800 shadow-sm cursor-pointer"
                        style={{ backgroundColor: color }}
                      />
                      <button
                        onClick={() => handleColorRemove(color, true)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-10 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorAdd(color, true)}
                      className="w-10 h-10 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      disabled={primaryColors.length >= 5}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Logo (optional)
                </label>
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-6 text-center">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="Logo" className="w-32 h-32 object-contain mx-auto" />
                      <button
                        onClick={() => {
                          setLogo(null);
                          setLogoPreview('');
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Palette size={40} className="text-zinc-400 mx-auto mb-2" />
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Click to upload logo
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        PNG, JPG, SVG - Max 5MB
                      </p>
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Style Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleKeywordAdd()}
                    placeholder="e.g., modern, minimal"
                    className="flex-1"
                  />
                  <Button onClick={handleKeywordAdd} variant="secondary">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {styleKeywords.map((keyword) => (
                    <Badge key={keyword} className="gap-2">
                      {keyword}
                      <button onClick={() => setStyleKeywords(styleKeywords.filter(k => k !== keyword))}>
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Target Mood
                </label>
                <select
                  value={targetMood}
                  onChange={(e) => setTargetMood(e.target.value as MoodType)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  {MOOD_OPTIONS.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Sample Images */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                  Upload Sample Images
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  Upload 5-10 images that represent your brand style. Min resolution: 800x800px
                </p>
              </div>

              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSampleImagesUpload}
                    className="hidden"
                  />
                  <ImageIcon size={48} className="text-zinc-400 mx-auto mb-3" />
                  <p className="text-zinc-600 dark:text-zinc-400 mb-1">
                    Drag & Drop images here or click to browse
                  </p>
                  <p className="text-xs text-zinc-500">
                    Uploaded: {sampleImages.length}/10
                  </p>
                </label>
              </div>

              {samplePreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-4">
                  {samplePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={preview}
                        alt={`Sample ${idx + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleSampleRemove(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: AI Analysis */}
          {currentStep === 3 && (
            <div className="space-y-6 py-8">
              <div className="text-center mb-8">
                <Sparkles size={48} className="text-repix-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  AI Learning Your Brand Style
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Analyzing your sample images...
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(analysisProgress).map(([key, progress]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                        {key === 'colors' && '🎨 Color Palette Extraction'}
                        {key === 'lighting' && '💡 Lighting Analysis'}
                        {key === 'composition' && '📐 Composition Detection'}
                        {key === 'mood' && '😊 Mood Analysis'}
                      </span>
                      <span className="text-sm text-zinc-500">{progress}%</span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 via-repix-500 to-accent-blue transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {progress === 100 && key === 'colors' && (
                      <p className="text-xs text-zinc-500 mt-1">
                        Detected: {primaryColors.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && learnedStyle && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Brand Kit Ready!
                </h3>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Brand Name</p>
                  <p className="font-bold text-zinc-900 dark:text-white">{brandName}</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Colors</p>
                  <div className="flex gap-2">
                    {primaryColors.map((color) => (
                      <div
                        key={color}
                        className="w-10 h-10 rounded-lg border-2 border-white dark:border-zinc-800 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">AI Learned Style</p>
                  <div className="space-y-2 text-sm">
                    <p>✓ Lighting: {learnedStyle.lighting.type} ({learnedStyle.lighting.confidence}% confidence)</p>
                    <p>✓ Composition: {learnedStyle.composition.pattern} ({learnedStyle.composition.confidence}% confidence)</p>
                    <p>✓ Mood: {learnedStyle.mood.detected.join(', ')} ({learnedStyle.mood.alignment}% alignment)</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Sample Images</p>
                  <div className="flex gap-2">
                    {samplePreviews.slice(0, 7).map((preview, idx) => (
                      <img
                        key={idx}
                        src={preview}
                        alt={`Sample ${idx + 1}`}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={currentStep === 1 ? onClose : handleBack}
            disabled={isProcessing}
          >
            <ArrowLeft size={16} className="mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isProcessing}
            >
              Next: {currentStep === 1 ? 'Samples' : currentStep === 2 ? 'Analyze' : 'Review'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={isProcessing}
              isLoading={isProcessing}
            >
              Create Brand Kit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
