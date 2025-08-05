import type { ConversationRecording, ConversationSegment, SpecialPoint, AIAnalysisSettings } from '@/types/conversation';

// OpenAI API integration
export class OpenAIAnalyzer {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyzeConversation(recording: ConversationRecording): Promise<SpecialPoint[]> {
    const transcript = this.formatTranscriptForAnalysis(recording.transcript);
    
    const prompt = `
Analyze the following business conversation transcript and extract special points that were discussed. 
Focus on identifying key business requirements, concerns, opportunities, decisions, agreements, objections, questions, and insights.

Transcript:
${transcript}

For each special point, provide:
1. Type (requirement, concern, opportunity, decision, agreement, objection, question, insight)
2. Title (brief summary)
3. Description (detailed explanation)
4. Context (exact quote from transcript)
5. Importance level (low, medium, high, critical)
6. Whether action is required
7. Whether follow-up is needed

Return the response in JSON format as an array of special points.
`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a business conversation analyst. Extract and categorize important discussion points from business conversations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const analysisResult = JSON.parse(data.choices[0].message.content);
      
      return this.formatSpecialPoints(analysisResult, recording.transcript);
    } catch (error) {
      console.error('Error analyzing conversation with OpenAI:', error);
      throw error;
    }
  }

  private formatTranscriptForAnalysis(transcript: ConversationSegment[]): string {
    return transcript.map(segment => 
      `[${segment.timestamp.toLocaleTimeString()}] ${segment.speaker.toUpperCase()}: ${segment.text}`
    ).join('\n');
  }

  private formatSpecialPoints(analysisResult: any[], transcript: ConversationSegment[]): SpecialPoint[] {
    return analysisResult.map((point, index) => ({
      id: `sp-${Date.now()}-${index}`,
      type: point.type || 'insight',
      title: point.title || 'Untitled Point',
      description: point.description || '',
      context: point.context || '',
      timestamp: new Date(),
      importance: point.importance || 'medium',
      relatedSegments: this.findRelatedSegments(point.context, transcript),
      actionRequired: point.actionRequired || false,
      followUpNeeded: point.followUpNeeded || false,
    }));
  }

  private findRelatedSegments(context: string, transcript: ConversationSegment[]): string[] {
    const keywords = context.toLowerCase().split(' ').filter(word => word.length > 3);
    return transcript
      .filter(segment => 
        keywords.some(keyword => segment.text.toLowerCase().includes(keyword))
      )
      .map(segment => segment.id)
      .slice(0, 3); // Limit to 3 most relevant segments
  }
}

// Anthropic Claude API integration
export class ClaudeAnalyzer {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-sonnet-20240229') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyzeConversation(recording: ConversationRecording): Promise<SpecialPoint[]> {
    const transcript = this.formatTranscriptForAnalysis(recording.transcript);
    
    const prompt = `
Please analyze this business conversation and extract special discussion points. Focus on:

- Key requirements mentioned by the client
- Concerns or objections raised
- Business opportunities identified
- Decisions made during the conversation
- Agreements reached
- Important questions asked
- Valuable insights shared

Conversation transcript:
${transcript}

For each special point, provide a JSON object with:
- type: one of [requirement, concern, opportunity, decision, agreement, objection, question, insight]
- title: brief summary (max 50 characters)
- description: detailed explanation
- context: exact quote from the conversation
- importance: one of [low, medium, high, critical]
- actionRequired: boolean
- followUpNeeded: boolean

Return only a valid JSON array of these objects.
`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      const analysisResult = JSON.parse(data.content[0].text);
      
      return this.formatSpecialPoints(analysisResult, recording.transcript);
    } catch (error) {
      console.error('Error analyzing conversation with Claude:', error);
      throw error;
    }
  }

  private formatTranscriptForAnalysis(transcript: ConversationSegment[]): string {
    return transcript.map(segment => 
      `[${segment.timestamp.toLocaleTimeString()}] ${segment.speaker === 'client' ? 'CLIENT' : 'AGENT'}: ${segment.text}`
    ).join('\n');
  }

  private formatSpecialPoints(analysisResult: any[], transcript: ConversationSegment[]): SpecialPoint[] {
    return analysisResult.map((point, index) => ({
      id: `sp-${Date.now()}-${index}`,
      type: point.type || 'insight',
      title: point.title || 'Untitled Point',
      description: point.description || '',
      context: point.context || '',
      timestamp: new Date(),
      importance: point.importance || 'medium',
      relatedSegments: this.findRelatedSegments(point.context, transcript),
      actionRequired: point.actionRequired || false,
      followUpNeeded: point.followUpNeeded || false,
    }));
  }

  private findRelatedSegments(context: string, transcript: ConversationSegment[]): string[] {
    const keywords = context.toLowerCase().split(' ').filter(word => word.length > 3);
    return transcript
      .filter(segment => 
        keywords.some(keyword => segment.text.toLowerCase().includes(keyword))
      )
      .map(segment => segment.id)
      .slice(0, 3);
  }
}

// Local/Mock analyzer for development and testing
export class MockAnalyzer {
  async analyzeConversation(_recording: ConversationRecording): Promise<SpecialPoint[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockPoints: SpecialPoint[] = [
      {
        id: `sp-${Date.now()}-1`,
        type: 'requirement',
        title: 'Organic Product Requirements',
        description: 'Client expressed specific need for organic certification and sustainable packaging',
        context: 'We need products that are certified organic and use eco-friendly packaging',
        timestamp: new Date(),
        importance: 'high',
        relatedSegments: [],
        actionRequired: true,
        followUpNeeded: true,
      },
      {
        id: `sp-${Date.now()}-2`,
        type: 'concern',
        title: 'Budget Constraints',
        description: 'Client mentioned budget limitations for premium products',
        context: 'Our budget is tight for premium items this quarter',
        timestamp: new Date(),
        importance: 'medium',
        relatedSegments: [],
        actionRequired: false,
        followUpNeeded: true,
      },
      {
        id: `sp-${Date.now()}-3`,
        type: 'opportunity',
        title: 'Market Expansion',
        description: 'Potential for expanding into new geographical markets',
        context: 'We\'re looking to expand our reach to European markets',
        timestamp: new Date(),
        importance: 'high',
        relatedSegments: [],
        actionRequired: true,
        followUpNeeded: true,
      },
    ];

    return mockPoints;
  }
}

// Main analyzer factory
export class ConversationAnalyzer {
  private settings: AIAnalysisSettings;

  constructor(settings: AIAnalysisSettings) {
    this.settings = settings;
  }

  async analyzeRecording(recording: ConversationRecording): Promise<SpecialPoint[]> {
    if (!this.settings.analysisTypes.extractSpecialPoints) {
      return [];
    }

    try {
      let analyzer;
      
      switch (this.settings.provider) {
        case 'openai':
          if (!this.settings.apiKey) {
            throw new Error('OpenAI API key is required');
          }
          analyzer = new OpenAIAnalyzer(this.settings.apiKey, this.settings.model);
          break;
          
        case 'anthropic':
          if (!this.settings.apiKey) {
            throw new Error('Anthropic API key is required');
          }
          analyzer = new ClaudeAnalyzer(this.settings.apiKey, this.settings.model);
          break;
          
        case 'local':
        default:
          analyzer = new MockAnalyzer();
          break;
      }

      const specialPoints = await analyzer.analyzeConversation(recording);
      return this.filterByConfidence(specialPoints);
    } catch (error) {
      console.error('Error in conversation analysis:', error);
      throw error;
    }
  }

  private filterByConfidence(points: SpecialPoint[]): SpecialPoint[] {
    // For now, return all points. In a real implementation,
    // you might filter based on confidence scores from the AI
    return points;
  }

  updateSettings(newSettings: Partial<AIAnalysisSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }
}

// Default AI settings
export const getDefaultAISettings = (): AIAnalysisSettings => ({
  provider: 'local',
  model: 'gpt-4',
  analysisTypes: {
    extractSpecialPoints: true,
    generateSummary: true,
    identifyKeywords: true,
    detectSentiment: false,
    suggestFollowUps: true,
  },
  confidenceThreshold: 0.7,
});

// Utility functions
export const formatSpecialPointType = (type: SpecialPoint['type']): string => {
  const typeMap = {
    requirement: 'Requirement',
    concern: 'Concern',
    opportunity: 'Opportunity',
    decision: 'Decision',
    agreement: 'Agreement',
    objection: 'Objection',
    question: 'Question',
    insight: 'Insight',
  };
  return typeMap[type] || type;
};

export const getImportanceColor = (importance: SpecialPoint['importance']): string => {
  const colorMap = {
    low: 'text-gray-600 bg-gray-100',
    medium: 'text-blue-600 bg-blue-100',
    high: 'text-orange-600 bg-orange-100',
    critical: 'text-red-600 bg-red-100',
  };
  return colorMap[importance] || colorMap.medium;
};

export const getTypeIcon = (type: SpecialPoint['type']): string => {
  const iconMap = {
    requirement: '📋',
    concern: '⚠️',
    opportunity: '🎯',
    decision: '✅',
    agreement: '🤝',
    objection: '❌',
    question: '❓',
    insight: '💡',
  };
  return iconMap[type] || '📝';
};
