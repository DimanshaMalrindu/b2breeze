import type {
  ConversationRecording,
  ConversationSegment,
  ConversationAnalytics,
  TranscriptionSettings,
  ExportFormat
} from '@/types/conversation';

// Get conversation recordings from localStorage
export const getConversationRecordings = (): ConversationRecording[] => {
  try {
    const data = localStorage.getItem('b2breeze_conversations');
    if (!data) return [];
    
    const recordings = JSON.parse(data);
    
    // Convert date strings back to Date objects
    return recordings.map((recording: any) => ({
      ...recording,
      startTime: new Date(recording.startTime),
      endTime: recording.endTime ? new Date(recording.endTime) : undefined,
      createdAt: new Date(recording.createdAt),
      updatedAt: new Date(recording.updatedAt),
      transcript: recording.transcript.map((segment: any) => ({
        ...segment,
        timestamp: new Date(segment.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error getting conversation recordings:', error);
    return [];
  }
};

// Save conversation recordings to localStorage
export const saveConversationRecordings = (recordings: ConversationRecording[]): void => {
  try {
    localStorage.setItem('b2breeze_conversations', JSON.stringify(recordings));
  } catch (error) {
    console.error('Error saving conversation recordings:', error);
  }
};

// Get transcription settings
export const getTranscriptionSettings = (): TranscriptionSettings => {
  try {
    const settings = localStorage.getItem('b2breeze_transcription_settings');
    return settings ? JSON.parse(settings) : {
      language: 'en-US',
      autoSpeakerDetection: true,
      realTimeTranscription: true,
      saveAudioFile: true,
      noiseReduction: true,
      enhancedAccuracy: false
    };
  } catch (error) {
    console.error('Error getting transcription settings:', error);
    return {
      language: 'en-US',
      autoSpeakerDetection: true,
      realTimeTranscription: true,
      saveAudioFile: true,
      noiseReduction: true,
      enhancedAccuracy: false
    };
  }
};

// Save transcription settings
export const saveTranscriptionSettings = (settings: TranscriptionSettings): void => {
  try {
    localStorage.setItem('b2breeze_transcription_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving transcription settings:', error);
  }
};

// Create a new conversation recording
export const createConversationRecording = (
  title: string,
  clientName?: string,
  clientId?: string
): ConversationRecording => {
  return {
    id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    clientName,
    clientId,
    startTime: new Date(),
    duration: 0,
    status: 'recording',
    transcript: [],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Add transcript segment
export const addTranscriptSegment = (
  recording: ConversationRecording,
  segment: ConversationSegment
): ConversationRecording => {
  return {
    ...recording,
    transcript: [...recording.transcript, segment],
    updatedAt: new Date()
  };
};

// Update recording status
export const updateRecordingStatus = (
  recording: ConversationRecording,
  status: ConversationRecording['status'],
  endTime?: Date
): ConversationRecording => {
  const duration = endTime && recording.startTime 
    ? Math.floor((endTime.getTime() - recording.startTime.getTime()) / 1000)
    : recording.duration;

  return {
    ...recording,
    status,
    endTime,
    duration,
    updatedAt: new Date()
  };
};

// Generate conversation summary
export const generateConversationSummary = (transcript: ConversationSegment[]): string => {
  if (transcript.length === 0) return 'No conversation content available.';
  
  // Simple summary generation (in production, you'd use AI/NLP)
  const totalSegments = transcript.length;
  const clientSegments = transcript.filter(s => s.speaker === 'client').length;
  const agentSegments = transcript.filter(s => s.speaker === 'agent').length;
  
  const topics = extractKeyTopics(transcript);
  
  return `Conversation summary: ${totalSegments} segments recorded. Client spoke ${clientSegments} times, agent spoke ${agentSegments} times. Key topics discussed: ${topics.join(', ')}.`;
};

// Extract key topics from transcript
export const extractKeyTopics = (transcript: ConversationSegment[]): string[] => {
  const commonWords = new Map<string, number>();
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'among', 'around', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us',
    'them', 'my', 'your', 'his', 'its', 'our', 'their', 'this', 'that', 'these', 'those'
  ]);

  transcript.forEach(segment => {
    const words = segment.text.toLowerCase().split(/\s+/);
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
        commonWords.set(cleanWord, (commonWords.get(cleanWord) || 0) + 1);
      }
    });
  });

  return Array.from(commonWords.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

// Generate follow-up actions
export const generateFollowUpActions = (transcript: ConversationSegment[]): string[] => {
  const actions: string[] = [];
  const actionKeywords = [
    'follow up', 'call back', 'send', 'email', 'quote', 'proposal', 'meeting', 'schedule',
    'review', 'check', 'confirm', 'provide', 'deliver', 'contact', 'reach out'
  ];

  transcript.forEach(segment => {
    const text = segment.text.toLowerCase();
    actionKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        actions.push(`Follow up based on: "${segment.text.slice(0, 100)}..."`);
      }
    });
  });

  return actions.slice(0, 5); // Return top 5 actions
};

// Calculate conversation analytics
export const calculateConversationAnalytics = (recordings: ConversationRecording[]): ConversationAnalytics => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalRecordings = recordings.length;
  const totalDuration = recordings.reduce((sum, r) => sum + r.duration, 0) / 60; // Convert to minutes
  const averageDuration = totalRecordings > 0 ? totalDuration / totalRecordings : 0;
  
  const recordingsThisWeek = recordings.filter(r => new Date(r.createdAt) >= weekAgo).length;
  const recordingsThisMonth = recordings.filter(r => new Date(r.createdAt) >= monthAgo).length;
  
  // Find most active client
  const clientCounts = new Map<string, number>();
  recordings.forEach(r => {
    if (r.clientName) {
      clientCounts.set(r.clientName, (clientCounts.get(r.clientName) || 0) + 1);
    }
  });
  const mostActiveClient = Array.from(clientCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Extract common keywords
  const allTranscripts = recordings.flatMap(r => r.transcript);
  const commonKeywords = extractKeyTopics(allTranscripts);

  // Count pending follow-ups
  const followUpsPending = recordings.reduce((sum, r) => sum + (r.followUpActions?.length || 0), 0);

  return {
    totalRecordings,
    totalDuration,
    averageDuration,
    recordingsThisWeek,
    recordingsThisMonth,
    mostActiveClient,
    commonKeywords,
    followUpsPending
  };
};

// Web Speech API helper functions
export const checkSpeechRecognitionSupport = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const createSpeechRecognition = (
  settings: TranscriptionSettings,
  onResult: (text: string, confidence: number) => void,
  onError: (error: string) => void
): any | null => {
  if (!checkSpeechRecognitionSupport()) {
    onError('Speech recognition is not supported in this browser');
    return null;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = settings.realTimeTranscription;
  recognition.lang = settings.language;

  recognition.onresult = (event: any) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        onResult(result[0].transcript, result[0].confidence);
      }
    }
  };

  recognition.onerror = (event: any) => {
    onError(`Speech recognition error: ${event.error}`);
  };

  return recognition;
};

// Export conversation data
export const exportConversation = async (
  recording: ConversationRecording,
  format: ExportFormat
): Promise<void> => {
  let content = '';
  const timestamp = format.includeTimestamps;
  const speakers = format.includeSpeakerLabels;
  const confidence = format.includeConfidenceScores;

  // Generate text content
  if (format.format === 'txt' || format.format === 'docx') {
    content = `Conversation: ${recording.title}\n`;
    content += `Date: ${recording.startTime.toLocaleDateString()}\n`;
    content += `Duration: ${Math.floor(recording.duration / 60)}m ${recording.duration % 60}s\n\n`;
    
    if (format.includeSummary && recording.summary) {
      content += `Summary: ${recording.summary}\n\n`;
    }

    recording.transcript.forEach(segment => {
      let line = '';
      if (timestamp) line += `[${segment.timestamp.toLocaleTimeString()}] `;
      if (speakers) line += `${segment.speaker === 'client' ? 'Client' : 'Agent'}: `;
      line += segment.text;
      if (confidence && segment.confidence) line += ` (${(segment.confidence * 100).toFixed(1)}%)`;
      content += line + '\n';
    });
  }

  // Create and download file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${recording.title.replace(/\s+/g, '_')}.${format.format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Initialize sample conversation data
export const initializeSampleConversationData = (): void => {
  const existingData = getConversationRecordings();
  if (existingData.length > 0) {
    console.log('Sample conversation data already exists:', existingData.length, 'recordings');
    return;
  }

  console.log('Creating sample conversation data...');

  const sampleRecordings: ConversationRecording[] = [
    {
      id: 'conv_1',
      title: 'Product Demo Call - ABC Corp',
      clientName: 'John Smith',
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000),
      duration: 900, // 15 minutes
      status: 'completed',
      transcript: [
        {
          id: 'seg_1',
          speaker: 'agent',
          text: 'Good morning John, thank you for scheduling this demo call. How are you today?',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          confidence: 0.95
        },
        {
          id: 'seg_2',
          speaker: 'client',
          text: 'Good morning! I\'m doing well, thank you. I\'m excited to see what your platform can offer for our business.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 5000),
          confidence: 0.92
        },
        {
          id: 'seg_3',
          speaker: 'agent',
          text: 'Perfect! Let me start by showing you our business card scanner feature. This will help digitize all your networking contacts.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10000),
          confidence: 0.94
        }
      ],
      summary: 'Product demonstration call with ABC Corp. Discussed business card scanning, customer management, and pricing options.',
      keyPoints: ['Business card scanner demo', 'Customer management needs', 'Pricing discussion', 'Follow-up meeting scheduled'],
      specialPoints: [
        {
          id: 'sp_1',
          type: 'requirement',
          title: 'Business Card Digitization Need',
          description: 'Client requires a solution to digitize business cards from networking events',
          context: 'Let me start by showing you our business card scanner feature. This will help digitize all your networking contacts.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          importance: 'high',
          relatedSegments: ['seg_3'],
          actionRequired: true,
          followUpNeeded: true
        },
        {
          id: 'sp_2',
          type: 'opportunity',
          title: 'Enterprise Customer Management',
          description: 'ABC Corp shows interest in comprehensive customer management solution',
          context: 'I\'m excited to see what your platform can offer for our business.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          importance: 'medium',
          relatedSegments: ['seg_2'],
          actionRequired: false,
          followUpNeeded: true
        }
      ],
      followUpActions: ['Send pricing proposal', 'Schedule follow-up meeting', 'Provide trial access'],
      tags: ['demo', 'prospect', 'abc-corp'],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'conv_2',
      title: 'Support Call - TechStart Inc',
      clientName: 'Sarah Johnson',
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000),
      duration: 480, // 8 minutes
      status: 'completed',
      transcript: [
        {
          id: 'seg_4',
          speaker: 'client',
          text: 'Hi, I\'m having trouble with the invoice generator. It\'s not calculating taxes correctly.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          confidence: 0.89
        },
        {
          id: 'seg_5',
          speaker: 'agent',
          text: 'I\'m sorry to hear that Sarah. Let me help you troubleshoot this issue. Can you tell me what tax rate you\'re trying to apply?',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 3000),
          confidence: 0.96
        }
      ],
      summary: 'Technical support call regarding invoice tax calculations. Issue resolved with guidance on tax settings.',
      keyPoints: ['Tax calculation issue', 'Settings configuration', 'Problem resolved'],
      specialPoints: [
        {
          id: 'sp_3',
          type: 'concern',
          title: 'Invoice Tax Calculation Error',
          description: 'Customer experiencing issues with incorrect tax calculations in invoice generator',
          context: 'Hi, I\'m having trouble with the invoice generator. It\'s not calculating taxes correctly.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          importance: 'high',
          relatedSegments: ['seg_4'],
          actionRequired: true,
          followUpNeeded: true
        },
        {
          id: 'sp_4',
          type: 'decision',
          title: 'Support Resolution Strategy',
          description: 'Agent decided to provide step-by-step troubleshooting guidance',
          context: 'Let me help you troubleshoot this issue. Can you tell me what tax rate you\'re trying to apply?',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          importance: 'medium',
          relatedSegments: ['seg_5'],
          actionRequired: false,
          followUpNeeded: true
        }
      ],
      followUpActions: ['Follow up in 24 hours', 'Check for similar issues'],
      tags: ['support', 'invoice', 'tax-issue'],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  saveConversationRecordings(sampleRecordings);
  console.log('Sample conversation data created successfully:', sampleRecordings.length, 'recordings saved');
};

// Format duration in readable format
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Force reinitialize sample data (useful for testing)
export const forceInitializeSampleData = (): void => {
  console.log('Force clearing existing data and creating fresh sample data...');
  localStorage.removeItem('b2breeze_conversations');
  initializeSampleConversationData();
};

// Debug function to check what's in localStorage
export const debugLocalStorage = (): void => {
  const rawData = localStorage.getItem('b2breeze_conversations');
  console.log('Raw localStorage data:', rawData);
  
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      console.log('Parsed data:', parsed);
      console.log('Number of recordings:', parsed.length);
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }
  } else {
    console.log('No data found in localStorage');
  }
};

// AI Analysis Functions
export const analyzeRecordingWithAI = async (recordingId: string): Promise<void> => {
  const recordings = getConversationRecordings();
  const recordingIndex = recordings.findIndex(r => r.id === recordingId);
  
  if (recordingIndex === -1) {
    throw new Error('Recording not found');
  }

  const recording = recordings[recordingIndex];
  
  try {
    // Import the AI analyzer dynamically to avoid bundle issues
    const { ConversationAnalyzer } = await import('@/lib/ai-analysis-utils');
    
    const aiSettings = getAIAnalysisSettings();
    const analyzer = new ConversationAnalyzer(aiSettings);
    
    // Extract special points
    const specialPoints = await analyzer.analyzeRecording(recording);
    
    // Update the recording with special points
    recordings[recordingIndex] = {
      ...recording,
      specialPoints,
      updatedAt: new Date(),
    };
    
    saveConversationRecordings(recordings);
  } catch (error) {
    console.error('Error analyzing recording:', error);
    throw error;
  }
};

// Get AI analysis settings
export const getAIAnalysisSettings = () => {
  try {
    const settings = localStorage.getItem('b2breeze_ai_settings');
    if (!settings) {
      const defaultSettings = {
        provider: 'local' as const,
        model: 'gpt-4',
        analysisTypes: {
          extractSpecialPoints: true,
          generateSummary: true,
          identifyKeywords: true,
          detectSentiment: false,
          suggestFollowUps: true,
        },
        confidenceThreshold: 0.7,
      };
      saveAIAnalysisSettings(defaultSettings);
      return defaultSettings;
    }
    return JSON.parse(settings);
  } catch (error) {
    console.error('Error getting AI analysis settings:', error);
    return {
      provider: 'local' as const,
      model: 'gpt-4',
      analysisTypes: {
        extractSpecialPoints: true,
        generateSummary: true,
        identifyKeywords: true,
        detectSentiment: false,
        suggestFollowUps: true,
      },
      confidenceThreshold: 0.7,
    };
  }
};

// Save AI analysis settings
export const saveAIAnalysisSettings = (settings: any): void => {
  try {
    localStorage.setItem('b2breeze_ai_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving AI analysis settings:', error);
  }
};

// Check if recording has special points
export const hasSpecialPoints = (recordingId: string): boolean => {
  const recordings = getConversationRecordings();
  const recording = recordings.find(r => r.id === recordingId);
  return Boolean(recording?.specialPoints && recording.specialPoints.length > 0);
};

// Get special points for a recording
export const getSpecialPoints = (recordingId: string) => {
  const recordings = getConversationRecordings();
  const recording = recordings.find(r => r.id === recordingId);
  return recording?.specialPoints || [];
};
