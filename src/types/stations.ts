// AI Creative Stations Types

export type TierType = 'free' | 'plus' | 'pro';
export type InputType = 'image' | 'video' | 'both';
export type OptionType = 'select' | 'slider' | 'toggle' | 'text';

export interface ToolOption {
  id: string;
  label: string;
  labelVi: string;
  type: OptionType;
  values?: string[];      // For select type
  valuesVi?: string[];    // Vietnamese labels for select values
  min?: number;           // For slider type
  max?: number;           // For slider type
  step?: number;          // For slider type
  default: string | number | boolean;
}

export interface Tool {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  icon: string;           // Lucide icon name or emoji
  creditCost: number;
  tier: TierType;
  estimatedTime: number;  // seconds
  inputType: InputType;
  options?: ToolOption[];
}

export interface Station {
  id: string;
  name: string;
  nameVi: string;
  icon: string;           // Emoji icon
  description: string;
  descriptionVi: string;
  color: string;          // Tailwind gradient classes
  bgColor: string;        // Background color class
  tools: Tool[];
}

export interface ProcessingResult {
  success: boolean;
  outputUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  errorVi?: string;
  creditsUsed: number;
  processingTime: number; // milliseconds
  toolId: string;
  stationId: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;       // 0-100
  estimatedTimeRemaining: number; // seconds
  currentStep?: string;
  currentStepVi?: string;
}

// Error types for tool execution
export type ProcessingErrorType = 
  | 'upload_failed'
  | 'processing_failed'
  | 'insufficient_credits'
  | 'file_too_large'
  | 'unsupported_format'
  | 'timeout'
  | 'unknown';

export interface ProcessingError {
  type: ProcessingErrorType;
  message: string;
  messageVi: string;
  retryable: boolean;
  refundCredits: boolean;
}
