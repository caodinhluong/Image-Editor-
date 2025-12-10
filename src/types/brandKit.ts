// Brand Kit Type Definitions

export interface BrandKit {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  
  profile: BrandProfile;
  learnedStyle: LearnedStyle;
  sampleImages: SampleImage[];
  metadata: BrandMetadata;
}

export interface BrandProfile {
  primaryColors: string[];      // Hex colors, 1-5 colors
  secondaryColors: string[];    // Optional, 0-5 colors
  logo?: {
    url: string;
    width: number;
    height: number;
  };
  styleKeywords: string[];      // e.g., ["minimalist", "modern"]
  targetMood: string;           // e.g., "energetic", "calm"
}

export interface LearnedStyle {
  colorPalette: {
    dominant: string[];         // Top 5 colors from samples
    accent: string[];           // Accent colors
    distribution: number[];     // % distribution
  };
  lighting: {
    type: 'soft' | 'hard' | 'dramatic' | 'natural';
    intensity: number;          // 0-100
    direction: 'front' | 'side' | 'back' | 'top';
    confidence: number;         // 0-100
  };
  composition: {
    pattern: 'centered' | 'rule-of-thirds' | 'asymmetric' | 'minimal';
    spacing: 'tight' | 'balanced' | 'spacious';
    confidence: number;
  };
  mood: {
    detected: string[];         // AI-detected moods
    alignment: number;          // Match with target mood (0-100)
  };
  backgroundStyle: {
    type: 'solid' | 'gradient' | 'textured' | 'contextual';
    colors: string[];
    blur: number;               // 0-100
  };
}

export interface SampleImage {
  id: string;
  url: string;
  thumbnail: string;
  uploadedAt: Date;
  analysisData: ImageAnalysis;
}

export interface ImageAnalysis {
  colors: {
    hex: string;
    percentage: number;
    rgb: [number, number, number];
  }[];
  lighting: {
    type: string;
    intensity: number;
    direction: string;
  };
  composition: {
    pattern: string;
    focalPoints: { x: number; y: number }[];
  };
  mood: string[];
}

export interface BrandMetadata {
  version: number;
  isShared: boolean;
  sharedWith: string[];         // User IDs
  permissions: {
    [userId: string]: 'read' | 'edit';
  };
  usageCount: number;           // Times applied
  lastUsed: Date;
}

export interface ConsistencyScore {
  overall: number;              // 0-100
  breakdown: {
    colors: {
      score: number;            // 0-100
      details: {
        matchedColors: string[];
        missingColors: string[];
        extraColors: string[];
      };
    };
    lighting: {
      score: number;
      details: {
        typeMatch: boolean;
        intensityDiff: number;
        directionMatch: boolean;
      };
    };
    composition: {
      score: number;
      details: {
        patternMatch: boolean;
        spacingMatch: boolean;
      };
    };
    mood: {
      score: number;
      details: {
        detectedMood: string[];
        alignment: number;
      };
    };
  };
  suggestions: Suggestion[];
}

export interface Suggestion {
  id: string;
  type: 'color' | 'lighting' | 'composition' | 'mood';
  title: string;
  description: string;
  impact: number;               // Expected improvement (0-100)
  action: {
    type: string;
    parameters: Record<string, any>;
  };
  preview?: string;             // Preview image URL
}

export interface BrandKitCache {
  activeBrandKitId: string | null;
  recentBrandKits: string[];
  lastSync: Date;
}

export type MoodType = 'energetic' | 'calm' | 'professional' | 'playful' | 'elegant' | 'bold' | 'minimal';
export type UserPlan = 'free' | 'pro' | 'team' | 'enterprise';
