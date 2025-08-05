export interface ConversationSegment {
  id: string;
  speaker: 'client' | 'agent';
  text: string;
  timestamp: Date;
  confidence?: number; // Transcription confidence score
  duration?: number; // Duration in seconds
}

export interface SpecialPoint {
  id: string;
  type: 'requirement' | 'concern' | 'opportunity' | 'decision' | 'agreement' | 'objection' | 'question' | 'insight';
  title: string;
  description: string;
  context: string; // Original text from transcript
  timestamp: Date;
  importance: 'low' | 'medium' | 'high' | 'critical';
  relatedSegments: string[]; // IDs of related conversation segments
  actionRequired?: boolean;
  followUpNeeded?: boolean;
}

export interface AIAnalysisSettings {
  provider: 'openai' | 'anthropic' | 'local' | 'custom';
  apiKey?: string;
  model?: string;
  endpoint?: string;
  analysisTypes: {
    extractSpecialPoints: boolean;
    generateSummary: boolean;
    identifyKeywords: boolean;
    detectSentiment: boolean;
    suggestFollowUps: boolean;
  };
  confidenceThreshold: number; // 0-1
}

export interface ConversationRecording {
  id: string;
  title: string;
  clientName?: string;
  clientId?: string; // Reference to customer directory
  startTime: Date;
  endTime?: Date;
  duration: number; // Total duration in seconds
  status: 'recording' | 'paused' | 'completed' | 'processing';
  audioFile?: string; // Path to audio file
  transcript: ConversationSegment[];
  summary?: string;
  keyPoints?: string[];
  specialPoints?: SpecialPoint[]; // AI-extracted special discussion points
  followUpActions?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TranscriptionSettings {
  language: string;
  autoSpeakerDetection: boolean;
  realTimeTranscription: boolean;
  saveAudioFile: boolean;
  noiseReduction: boolean;
  enhancedAccuracy: boolean;
}

export interface ConversationAnalytics {
  totalRecordings: number;
  totalDuration: number; // In minutes
  averageDuration: number; // In minutes
  recordingsThisWeek: number;
  recordingsThisMonth: number;
  mostActiveClient: string;
  commonKeywords: string[];
  followUpsPending: number;
}

export interface ConversationState {
  recordings: ConversationRecording[];
  currentRecording: ConversationRecording | null;
  isRecording: boolean;
  isPaused: boolean;
  settings: TranscriptionSettings;
  aiSettings: AIAnalysisSettings;
  analytics: ConversationAnalytics;
  loading: boolean;
  error: string | null;
  isAnalyzing: boolean; // For AI analysis progress
}

export type ConversationView = 'recordings' | 'active' | 'analytics' | 'settings';
export type RecordingStatus = 'recording' | 'paused' | 'completed' | 'processing';
export type SpeakerType = 'client' | 'agent';

export interface RecordingControls {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  addMarker: (text: string) => void;
  updateTranscript: (segment: ConversationSegment) => void;
}

export interface ExportFormat {
  format: 'txt' | 'docx' | 'pdf' | 'json';
  includeTimestamps: boolean;
  includeSpeakerLabels: boolean;
  includeConfidenceScores: boolean;
  includeSummary: boolean;
}
