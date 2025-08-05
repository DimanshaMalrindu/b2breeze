import React, { useState, useEffect, useRef } from 'react';
import {
    Mic,
    Play,
    Pause,
    Square,
    FileText,
    Download,
    Settings,
    Users,
    Clock,
    MessageCircle,
    Filter,
    BarChart3,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Edit,
    Eye,
    Lightbulb,
    CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SaveRecordingModal } from '@/components/SaveRecordingModal';
import { SuccessModal } from '@/components/SuccessModal';
import { ErrorModal } from '@/components/ErrorModal';
import type {
    ConversationRecording,
    ConversationSegment,
    ConversationView,
    TranscriptionSettings,
    ConversationAnalytics,
    ExportFormat
} from '@/types/conversation';
import {
    getConversationRecordings,
    saveConversationRecordings,
    getTranscriptionSettings,
    saveTranscriptionSettings,
    createConversationRecording,
    addTranscriptSegment,
    updateRecordingStatus,
    calculateConversationAnalytics,
    checkSpeechRecognitionSupport,
    createSpeechRecognition,
    exportConversation,
    initializeSampleConversationData,
    forceInitializeSampleData,
    debugLocalStorage,
    formatDuration,
    generateConversationSummary,
    generateFollowUpActions,
    analyzeRecordingWithAI,
    getSpecialPoints,
    extractKeyTopics
} from '@/lib/conversation-utils';
import { ANUGA_FOOD_CATEGORIES, getSubCategoriesByCategoryId } from '@/types/food-categories';

interface ConversationRecorderPageProps {
    onNavigate: (page: string) => void;
}

interface RecordingControlsProps {
    isRecording: boolean;
    isPaused: boolean;
    duration: number;
    onStart: () => void;
    onPause: () => void;
    onStop: () => void;
    onResume: () => void;
    onClear?: () => void;
    onSave?: () => void;
    showClearButton?: boolean;
    showSaveButton?: boolean;
}

interface TranscriptDisplayProps {
    segments: ConversationSegment[];
    isRecording: boolean;
}

interface RecordingCardProps {
    recording: ConversationRecording;
    onView: (recording: ConversationRecording) => void;
    onEdit: (recording: ConversationRecording) => void;
    onDelete: (recording: ConversationRecording) => void;
    onExport: (recording: ConversationRecording) => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
    isRecording,
    isPaused,
    duration,
    onStart,
    onPause,
    onStop,
    onResume,
    onClear,
    onSave,
    showClearButton = false,
    showSaveButton = false
}) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="text-center space-y-4">
                    <div className="text-3xl font-mono">
                        {formatDuration(duration)}
                    </div>

                    <div className="flex items-center justify-center space-x-3">
                        {!isRecording ? (
                            <Button
                                onClick={onStart}
                                size="lg"
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-16 h-16"
                            >
                                <Mic className="w-8 h-8" />
                            </Button>
                        ) : (
                            <>
                                {isPaused ? (
                                    <Button
                                        onClick={onResume}
                                        size="lg"
                                        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12"
                                    >
                                        <Play className="w-6 h-6" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={onPause}
                                        size="lg"
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-12 h-12"
                                    >
                                        <Pause className="w-6 h-6" />
                                    </Button>
                                )}

                                <Button
                                    onClick={onStop}
                                    size="lg"
                                    className="bg-gray-500 hover:bg-gray-600 text-white rounded-full w-12 h-12"
                                >
                                    <Square className="w-6 h-6" />
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="text-sm text-gray-600">
                        {!isRecording ? 'Click to start recording' :
                            isPaused ? 'Recording paused' : 'Recording in progress...'}
                    </div>

                    {/* Action buttons - only show when not recording and transcript exists */}
                    {!isRecording && (showClearButton || showSaveButton) && (
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                            {showClearButton && onClear && (
                                <Button
                                    onClick={onClear}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear Transcript
                                </Button>
                            )}
                            {showSaveButton && onSave && (
                                <Button
                                    onClick={onSave}
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" />
                                    Save Recording
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ segments, isRecording }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current && isRecording) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [segments, isRecording]);

    return (
        <Card className="h-96">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Real-time Transcript
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={scrollRef} className="h-64 overflow-y-auto space-y-3 bg-gray-50 p-4 rounded-lg">
                    {segments.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            {isRecording ? 'Listening for speech...' : 'No transcript available'}
                        </div>
                    ) : (
                        segments.map((segment) => (
                            <div
                                key={segment.id}
                                className={`flex gap-3 ${segment.speaker === 'agent' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${segment.speaker === 'agent'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white border'
                                        }`}
                                >
                                    <div className="text-sm font-medium mb-1">
                                        {segment.speaker === 'agent' ? 'You' : 'Client'}
                                    </div>
                                    <div className="text-sm">{segment.text}</div>
                                    <div className="text-xs opacity-70 mt-1">
                                        {segment.timestamp.toLocaleTimeString()}
                                        {segment.confidence && (
                                            <span className="ml-2">
                                                ({(segment.confidence * 100).toFixed(0)}%)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Special Points Display Component  
interface SpecialPointsDisplayProps {
    points: any[];
    isAnalyzing: boolean;
    analysisError: string | null;
    onRetryAnalysis?: () => void;
}

const SpecialPointsDisplay: React.FC<SpecialPointsDisplayProps> = ({
    points,
    isAnalyzing,
    analysisError,
    onRetryAnalysis
}) => {
    const getTypeIcon = (type: string) => {
        const iconMap: Record<string, string> = {
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

    const getImportanceColor = (importance: string) => {
        const colorMap: Record<string, string> = {
            low: 'text-gray-600 bg-gray-100',
            medium: 'text-blue-600 bg-blue-100',
            high: 'text-orange-600 bg-orange-100',
            critical: 'text-red-600 bg-red-100',
        };
        return colorMap[importance] || colorMap.medium;
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Special Discussion Points
                    {isAnalyzing && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isAnalyzing ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Analyzing conversation for key insights...</p>
                    </div>
                ) : analysisError ? (
                    <div className="text-center py-8">
                        <div className="text-red-600 mb-4">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                            <p>Analysis failed: {analysisError}</p>
                        </div>
                        {onRetryAnalysis && (
                            <button
                                onClick={onRetryAnalysis}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Retry Analysis
                            </button>
                        )}
                    </div>
                ) : points.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No special points detected in this conversation</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {points.map((point, index) => (
                            <div
                                key={point.id || index}
                                className="border rounded-lg p-4 bg-gray-50"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{getTypeIcon(point.type)}</span>
                                        <h4 className="font-semibold text-gray-900">{point.title}</h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(point.importance)}`}
                                        >
                                            {point.importance?.toUpperCase()}
                                        </span>
                                        {point.actionRequired && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                                ACTION REQUIRED
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-2">{point.description}</p>
                                {point.context && (
                                    <div className="bg-white p-3 rounded border-l-4 border-blue-200">
                                        <p className="text-sm text-gray-600 italic">"{point.context}"</p>
                                    </div>
                                )}
                                {(point.actionRequired || point.followUpNeeded) && (
                                    <div className="mt-3 flex gap-2">
                                        {point.actionRequired && (
                                            <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                                                <CheckSquare className="w-3 h-3" />
                                                Action Required
                                            </span>
                                        )}
                                        {point.followUpNeeded && (
                                            <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                                                <Clock className="w-3 h-3" />
                                                Follow-up Needed
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const RecordingCard: React.FC<RecordingCardProps> = ({
    recording,
    onView,
    onEdit,
    onDelete,
    onExport
}) => {
    const getStatusColor = (status: ConversationRecording['status']) => {
        switch (status) {
            case 'recording': return 'bg-red-100 text-red-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{recording.title}</h3>
                        {recording.clientName && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {recording.clientName}
                            </p>
                        )}
                    </div>
                    <Badge className={getStatusColor(recording.status)}>
                        {recording.status}
                    </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(recording.duration)}
                    </div>
                    <div>
                        {recording.startTime instanceof Date
                            ? recording.startTime.toLocaleDateString()
                            : new Date(recording.startTime).toLocaleDateString()
                        }
                    </div>
                    <div>
                        {recording.transcript.length} segments
                    </div>
                </div>

                {recording.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {recording.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(recording)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit(recording)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onExport(recording)}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(recording)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

interface FoodCategorySelectProps {
    selectedCategory: string;
    selectedSubCategory: string;
    onCategoryChange: (categoryId: string) => void;
    onSubCategoryChange: (subCategoryId: string) => void;
}

const FoodCategorySelect: React.FC<FoodCategorySelectProps> = ({
    selectedCategory,
    selectedSubCategory,
    onCategoryChange,
    onSubCategoryChange
}) => {
    const availableSubCategories = selectedCategory
        ? getSubCategoriesByCategoryId(selectedCategory)
        : [];

    const handleCategoryChange = (categoryId: string) => {
        onCategoryChange(categoryId);
        // Reset subcategory when category changes
        onSubCategoryChange('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Food Category Classification</CardTitle>
                <p className="text-sm text-gray-600">
                    Select the food category and subcategory for this conversation
                </p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Main Category Dropdown */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Food Category</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            <option value="">Select a category...</option>
                            {ANUGA_FOOD_CATEGORIES.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {selectedCategory && (
                            <p className="text-xs text-gray-500 mt-1">
                                {ANUGA_FOOD_CATEGORIES.find(c => c.id === selectedCategory)?.description}
                            </p>
                        )}
                    </div>

                    {/* Sub Category Dropdown */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Sub Category</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={selectedSubCategory}
                            onChange={(e) => onSubCategoryChange(e.target.value)}
                            disabled={!selectedCategory || availableSubCategories.length === 0}
                        >
                            <option value="">
                                {!selectedCategory
                                    ? 'Select a category first...'
                                    : 'Select a subcategory...'
                                }
                            </option>
                            {availableSubCategories.map((subCategory) => (
                                <option key={subCategory.id} value={subCategory.id}>
                                    {subCategory.name}
                                </option>
                            ))}
                        </select>
                        {selectedSubCategory && (
                            <p className="text-xs text-gray-500 mt-1">
                                {availableSubCategories.find(sc => sc.id === selectedSubCategory)?.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Selected Categories Display */}
                {(selectedCategory || selectedSubCategory) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-1">Selected Classification:</p>
                        <div className="text-sm text-blue-800">
                            {selectedCategory && (
                                <span className="inline-block bg-blue-200 px-2 py-1 rounded mr-2">
                                    {ANUGA_FOOD_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                                </span>
                            )}
                            {selectedSubCategory && (
                                <span className="inline-block bg-blue-300 px-2 py-1 rounded">
                                    {availableSubCategories.find(sc => sc.id === selectedSubCategory)?.name}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

interface RecordingDetailViewProps {
    recording: ConversationRecording;
    onBack: () => void;
    onEdit: (recording: ConversationRecording) => void;
    onDelete: (recording: ConversationRecording) => void;
    onExport: (recording: ConversationRecording) => void;
}

const RecordingDetailView: React.FC<RecordingDetailViewProps> = ({
    recording,
    onBack,
    onEdit,
    onDelete,
    onExport
}) => {
    const getStatusColor = (status: ConversationRecording['status']) => {
        switch (status) {
            case 'recording': return 'bg-red-100 text-red-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with back button */}
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Recordings
                </Button>

                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(recording)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onExport(recording)}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDelete(recording)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Recording Details */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl">{recording.title}</CardTitle>
                            {recording.clientName && (
                                <p className="text-gray-600 mt-1">Client: {recording.clientName}</p>
                            )}
                        </div>
                        <Badge className={getStatusColor(recording.status)}>
                            {recording.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="font-semibold">{formatDuration(recording.duration)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Start Time</p>
                            <p className="font-semibold">{recording.startTime.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Segments</p>
                            <p className="font-semibold">{recording.transcript.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Audio File</p>
                            <p className="font-semibold">{recording.audioFile ? 'Available' : 'Not saved'}</p>
                        </div>
                    </div>

                    {recording.tags.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Tags</p>
                            <div className="flex flex-wrap gap-1">
                                {recording.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {recording.summary && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Summary</p>
                            <p className="text-sm bg-gray-50 p-3 rounded-lg">{recording.summary}</p>
                        </div>
                    )}

                    {recording.followUpActions && recording.followUpActions.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Follow-up Actions</p>
                            <ul className="text-sm space-y-1">
                                {recording.followUpActions.map((action, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        {action}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transcript Display */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Full Transcript
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="max-h-96 overflow-y-auto space-y-4">
                        {recording.transcript.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No transcript available for this recording
                            </div>
                        ) : (
                            recording.transcript.map((segment) => (
                                <div
                                    key={segment.id}
                                    className={`flex gap-3 ${segment.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${segment.speaker === 'agent'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white border'
                                            }`}
                                    >
                                        <div className="text-sm font-medium mb-1">
                                            {segment.speaker === 'agent' ? 'You' : 'Client'}
                                        </div>
                                        <div className="text-sm">{segment.text}</div>
                                        <div className="text-xs opacity-70 mt-1">
                                            {segment.timestamp.toLocaleTimeString()}
                                            {segment.confidence && (
                                                <span className="ml-2">
                                                    ({(segment.confidence * 100).toFixed(0)}%)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Special Points Section */}
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Special Discussion Points
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recording.specialPoints && recording.specialPoints.length > 0 ? (
                        <div className="space-y-4">
                            {recording.specialPoints.map((point, index) => (
                                <div key={point.id || index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">
                                                {point.type === 'requirement' ? '📋' :
                                                    point.type === 'concern' ? '⚠️' :
                                                        point.type === 'opportunity' ? '🎯' :
                                                            point.type === 'decision' ? '✅' :
                                                                point.type === 'agreement' ? '🤝' :
                                                                    point.type === 'objection' ? '❌' :
                                                                        point.type === 'question' ? '❓' : '💡'}
                                            </span>
                                            <h4 className="font-semibold text-gray-900">{point.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${point.importance === 'critical' ? 'text-red-600 bg-red-100' :
                                                point.importance === 'high' ? 'text-orange-600 bg-orange-100' :
                                                    point.importance === 'medium' ? 'text-blue-600 bg-blue-100' :
                                                        'text-gray-600 bg-gray-100'
                                                }`}>
                                                {point.importance?.toUpperCase()}
                                            </span>
                                            {point.actionRequired && (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                                    ACTION REQUIRED
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-2">{point.description}</p>
                                    {point.context && (
                                        <div className="bg-white p-3 rounded border-l-4 border-blue-200">
                                            <p className="text-sm text-gray-600 italic">"{point.context}"</p>
                                        </div>
                                    )}
                                    {(point.actionRequired || point.followUpNeeded) && (
                                        <div className="mt-3 flex gap-2">
                                            {point.actionRequired && (
                                                <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                                                    <CheckSquare className="w-3 h-3" />
                                                    Action Required
                                                </span>
                                            )}
                                            {point.followUpNeeded && (
                                                <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                                                    <Clock className="w-3 h-3" />
                                                    Follow-up Needed
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No special points available for this recording</p>
                            <p className="text-sm mt-1">AI analysis may not have been performed yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export const ConversationRecorderPage: React.FC<ConversationRecorderPageProps> = () => {
    const [currentView, setCurrentView] = useState<ConversationView>('active');
    const [recordings, setRecordings] = useState<ConversationRecording[]>([]);
    const [currentRecording, setCurrentRecording] = useState<ConversationRecording | null>(null);
    const [displayedTranscript, setDisplayedTranscript] = useState<ConversationSegment[]>([]);
    const [selectedRecording, setSelectedRecording] = useState<ConversationRecording | null>(null);
    const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const [settings, setSettings] = useState<TranscriptionSettings>(getTranscriptionSettings());
    const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [specialPoints, setSpecialPoints] = useState<any[]>([]);

    // Modal states
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ title: '', segmentCount: 0 });
    const [errorMessage, setErrorMessage] = useState('');

    const recognitionRef = useRef<any>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        // First, try to initialize sample data
        console.log('Initializing conversation data...');
        initializeSampleConversationData();
        loadData();

        // Check if recordings were loaded successfully
        const recordingData = getConversationRecordings();
        console.log('Loaded recordings:', recordingData.length);

        // If no recordings are found after loading, force create sample data
        if (recordingData.length === 0) {
            console.log('No recordings found, forcing sample data creation...');
            forceInitializeSampleData();
            // Reload after creating sample data
            setTimeout(() => {
                loadData();
            }, 100);
        }
    }, []);

    useEffect(() => {
        if (isRecording && !isPaused) {
            intervalRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRecording, isPaused]);

    const loadData = () => {
        const recordingData = getConversationRecordings();
        console.log('Loading conversation data:', recordingData);
        setRecordings(recordingData);
        setAnalytics(calculateConversationAnalytics(recordingData));
    };

    // AI Analysis function
    const handleAIAnalysis = async (recordingId: string) => {
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            console.log('Starting AI analysis for recording:', recordingId);
            await analyzeRecordingWithAI(recordingId);

            // Reload the data to get the updated recording with special points
            loadData();

            // Load special points for display
            const points = getSpecialPoints(recordingId);
            setSpecialPoints(points);

            console.log('AI analysis completed. Special points found:', points.length);
        } catch (error) {
            console.error('AI analysis failed:', error);
            setAnalysisError(error instanceof Error ? error.message : 'Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleStartRecording = async () => {
        if (!checkSpeechRecognitionSupport()) {
            alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        try {
            // Request microphone permission and get audio stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const newRecording = createConversationRecording(
                `Recording ${new Date().toLocaleString()}`,
                'Client Name' // In real app, this would come from a form
            );

            setCurrentRecording(newRecording);
            setDisplayedTranscript([]); // Clear any previous transcript from display
            setIsRecording(true);
            setIsPaused(false);
            setDuration(0);

            // Initialize audio chunks array
            audioChunksRef.current = [];

            // Start audio recording if enabled in settings
            if (settings.saveAudioFile) {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.start(1000); // Collect data every second
            }

            // Start speech recognition
            const recognition = createSpeechRecognition(
                settings,
                (text: string, confidence: number) => {
                    const segment: ConversationSegment = {
                        id: `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        speaker: 'client', // Simple implementation - alternates speakers
                        text: text.trim(),
                        timestamp: new Date(),
                        confidence
                    };

                    setCurrentRecording(prev => {
                        if (!prev) return prev;
                        return addTranscriptSegment(prev, segment);
                    });
                },
                (error: string) => {
                    console.error('Speech recognition error:', error);
                    // Don't stop recording on speech recognition errors, just log them
                }
            );

            if (recognition) {
                recognitionRef.current = recognition;
                recognition.start();
            }

        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const handlePauseRecording = () => {
        setIsPaused(true);

        // Pause speech recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        // Pause audio recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
        }
    };

    const handleResumeRecording = () => {
        setIsPaused(false);

        // Resume speech recognition
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }

        // Resume audio recording
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
        }
    };

    const handleStopRecording = async () => {
        setIsRecording(false);
        setIsPaused(false);

        // Stop speech recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        // Stop and save audio recording
        let audioFileUrl: string | undefined;
        if (mediaRecorderRef.current && settings.saveAudioFile) {
            return new Promise<void>((resolve) => {
                const mediaRecorder = mediaRecorderRef.current!;

                mediaRecorder.onstop = () => {
                    if (audioChunksRef.current.length > 0) {
                        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                        audioFileUrl = URL.createObjectURL(audioBlob);

                        // Save the audio file reference (in a real app, you'd upload to server)
                        console.log('Audio recording saved:', audioFileUrl);
                    }

                    // Complete the recording process
                    completeRecording(audioFileUrl);
                    resolve();
                };

                mediaRecorder.stop();
            });
        } else {
            // Complete recording without audio
            completeRecording(audioFileUrl);
        }
    };

    const completeRecording = (audioFileUrl?: string) => {
        if (currentRecording) {
            const completedRecording = updateRecordingStatus(
                currentRecording,
                'completed',
                new Date()
            );

            // Add audio file reference if available
            if (audioFileUrl) {
                completedRecording.audioFile = audioFileUrl;
            }

            // Generate summary and follow-up actions (preserve all transcript data)
            completedRecording.summary = generateConversationSummary(completedRecording.transcript);
            completedRecording.followUpActions = generateFollowUpActions(completedRecording.transcript);

            // IMPORTANT: Keep all transcript data and audio - do not clear/delete anything
            const updatedRecordings = [...recordings, completedRecording];
            setRecordings(updatedRecordings);
            saveConversationRecordings(updatedRecordings);

            // Show success message
            console.log('Recording completed and saved:', {
                id: completedRecording.id,
                duration: completedRecording.duration,
                transcriptSegments: completedRecording.transcript.length,
                audioFile: completedRecording.audioFile ? 'Saved' : 'Not saved',
                summary: completedRecording.summary ? 'Generated' : 'Not generated'
            });

            // Trigger AI analysis for special points
            if (completedRecording.transcript.length > 0) {
                handleAIAnalysis(completedRecording.id);
            }

            // Reset UI state but keep the completed recording transcript visible
            setDisplayedTranscript(completedRecording.transcript);
            setCurrentRecording(null);
            setDuration(0);
            loadData();

            // Clean up refs for next recording
            audioChunksRef.current = [];
            mediaRecorderRef.current = null;
        }
    };

    const handleViewRecording = (recording: ConversationRecording) => {
        // Set the selected recording to show its detailed view with transcript
        setSelectedRecording(recording);
        console.log('Viewing recording:', recording.title, 'with', recording.transcript.length, 'segments');
    };

    const handleBackToRecordingsList = () => {
        setSelectedRecording(null);
    };

    const handleEditRecording = (recording: ConversationRecording) => {
        // Implementation for editing recording details
        console.log('Edit recording:', recording);
    };

    const handleDeleteRecording = (recording: ConversationRecording) => {
        if (confirm('Are you sure you want to delete this recording?')) {
            const updatedRecordings = recordings.filter(r => r.id !== recording.id);
            setRecordings(updatedRecordings);
            saveConversationRecordings(updatedRecordings);
            loadData();
        }
    };

    const handleClearTranscript = () => {
        if (!isRecording && displayedTranscript.length > 0) {
            if (confirm('Are you sure you want to clear the displayed transcript?')) {
                setDisplayedTranscript([]);
            }
        }
    };

    const handleSaveRecording = () => {
        if (!isRecording && displayedTranscript.length > 0) {
            setShowSaveModal(true);
        } else if (isRecording) {
            setErrorMessage('Please stop the current recording before saving.');
            setShowErrorModal(true);
        } else {
            setErrorMessage('No transcript data to save. Please record a conversation first.');
            setShowErrorModal(true);
        }
    };

    const handleSaveConfirm = async (title: string, clientName?: string) => {
        try {
            // Create a new recording from the displayed transcript
            const newRecording: ConversationRecording = {
                id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title: title.trim(),
                clientName: clientName?.trim() || undefined,
                startTime: displayedTranscript[0]?.timestamp || new Date(),
                endTime: displayedTranscript[displayedTranscript.length - 1]?.timestamp || new Date(),
                duration: displayedTranscript.length > 0
                    ? Math.floor((displayedTranscript[displayedTranscript.length - 1]?.timestamp.getTime() - displayedTranscript[0]?.timestamp.getTime()) / 1000)
                    : 0,
                status: 'completed',
                transcript: displayedTranscript,
                summary: generateConversationSummary(displayedTranscript),
                keyPoints: extractKeyTopics(displayedTranscript),
                followUpActions: generateFollowUpActions(displayedTranscript),
                tags: clientName ? [clientName.toLowerCase().replace(/\s+/g, '-')] : ['manual-save'],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Save the recording
            const updatedRecordings = [...recordings, newRecording];
            setRecordings(updatedRecordings);
            saveConversationRecordings(updatedRecordings);

            // Trigger AI analysis for the saved recording if transcript is substantial
            if (newRecording.transcript.length > 0) {
                console.log('Triggering AI analysis for saved recording:', newRecording.id);
                handleAIAnalysis(newRecording.id);
            }

            // Show success message and reload data
            setSuccessMessage({ title: title, segmentCount: displayedTranscript.length });
            setShowSuccessModal(true);
            loadData();
        } catch (error) {
            console.error('Error saving recording:', error);
            setErrorMessage('Failed to save recording. Please try again.');
            setShowErrorModal(true);
        }
    };

    const handleExportRecording = (recording: ConversationRecording) => {
        const format: ExportFormat = {
            format: 'txt',
            includeTimestamps: true,
            includeSpeakerLabels: true,
            includeConfidenceScores: false,
            includeSummary: true
        };
        exportConversation(recording, format);
    };

    const filteredRecordings = recordings.filter(recording =>
        recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Conversation Recorder</h1>
                    <p className="text-gray-600">Record and transcribe client conversations in real-time with B2BBreeze</p>
                </div>

                {!checkSpeechRecognitionSupport() && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-medium">Browser Not Supported</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                            Speech recognition requires Chrome or Edge browser
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'active', label: 'Active Recording', icon: Mic },
                    { id: 'recordings', label: 'Recordings', icon: FileText },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'settings', label: 'Settings', icon: Settings }
                ].map(view => {
                    const Icon = view.icon;
                    return (
                        <Button
                            key={view.id}
                            variant={currentView === view.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                                setCurrentView(view.id as ConversationView);
                                setSelectedRecording(null); // Reset selected recording when changing views
                            }}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {view.label}
                        </Button>
                    );
                })}
            </div>

            {/* Active Recording View */}
            {currentView === 'active' && (
                <div className="space-y-6">
                    {/* Food Category Selection for Active Recording */}
                    <FoodCategorySelect
                        selectedCategory={selectedFoodCategory}
                        selectedSubCategory={selectedSubCategory}
                        onCategoryChange={setSelectedFoodCategory}
                        onSubCategoryChange={setSelectedSubCategory}
                    />

                    {/* Recording Controls and Transcript */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RecordingControls
                            isRecording={isRecording}
                            isPaused={isPaused}
                            duration={duration}
                            onStart={handleStartRecording}
                            onPause={handlePauseRecording}
                            onStop={handleStopRecording}
                            onResume={handleResumeRecording}
                            onClear={handleClearTranscript}
                            onSave={handleSaveRecording}
                            showClearButton={!isRecording && displayedTranscript.length > 0}
                            showSaveButton={!isRecording && displayedTranscript.length > 0}
                        />

                        <TranscriptDisplay
                            segments={currentRecording?.transcript || displayedTranscript}
                            isRecording={isRecording}
                        />

                        {/* Special Points Display - show only when recording is completed and has transcript */}
                        {!isRecording && displayedTranscript.length > 0 && (
                            <SpecialPointsDisplay
                                points={specialPoints}
                                isAnalyzing={isAnalyzing}
                                analysisError={analysisError}
                                onRetryAnalysis={() => {
                                    // Find the most recent completed recording and retry analysis
                                    const recentRecording = recordings.find(r =>
                                        r.status === 'completed' &&
                                        r.transcript.length > 0
                                    );
                                    if (recentRecording) {
                                        handleAIAnalysis(recentRecording.id);
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Recordings View */}
            {currentView === 'recordings' && (
                selectedRecording ? (
                    <RecordingDetailView
                        recording={selectedRecording}
                        onBack={handleBackToRecordingsList}
                        onEdit={handleEditRecording}
                        onDelete={handleDeleteRecording}
                        onExport={handleExportRecording}
                    />
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search recordings..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredRecordings.map((recording) => (
                                <RecordingCard
                                    key={recording.id}
                                    recording={recording}
                                    onView={handleViewRecording}
                                    onEdit={handleEditRecording}
                                    onDelete={handleDeleteRecording}
                                    onExport={handleExportRecording}
                                />
                            ))}
                        </div>

                        {filteredRecordings.length === 0 && (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No recordings found</h3>
                                <p className="text-gray-500 mb-4">Start your first recording to see it here</p>
                                <Button
                                    onClick={() => {
                                        console.log('Creating sample data...');
                                        debugLocalStorage();
                                        forceInitializeSampleData();
                                        debugLocalStorage();
                                        setTimeout(() => loadData(), 100);
                                    }}
                                    variant="outline"
                                    size="sm"
                                >
                                    Load Sample Recordings
                                </Button>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Analytics View */}
            {currentView === 'analytics' && analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Recordings</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalRecordings}</p>
                                </div>
                                <FileText className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Duration</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {Math.round(analytics.totalDuration)}m
                                    </p>
                                </div>
                                <Clock className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">This Week</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.recordingsThisWeek}</p>
                                </div>
                                <BarChart3 className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Follow-ups</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.followUpsPending}</p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Settings View */}
            {currentView === 'settings' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Transcription Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Language</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                value={settings.language}
                                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                            >
                                <option value="en-US">English (US)</option>
                                <option value="en-GB">English (UK)</option>
                                <option value="es-ES">Spanish</option>
                                <option value="fr-FR">French</option>
                                <option value="de-DE">German</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={settings.realTimeTranscription}
                                    onChange={(e) => setSettings(prev => ({ ...prev, realTimeTranscription: e.target.checked }))}
                                />
                                <span>Real-time transcription</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={settings.autoSpeakerDetection}
                                    onChange={(e) => setSettings(prev => ({ ...prev, autoSpeakerDetection: e.target.checked }))}
                                />
                                <span>Auto speaker detection</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={settings.saveAudioFile}
                                    onChange={(e) => setSettings(prev => ({ ...prev, saveAudioFile: e.target.checked }))}
                                />
                                <span>Save audio files</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={settings.noiseReduction}
                                    onChange={(e) => setSettings(prev => ({ ...prev, noiseReduction: e.target.checked }))}
                                />
                                <span>Noise reduction</span>
                            </label>
                        </div>

                        <Button onClick={() => saveTranscriptionSettings(settings)}>
                            Save Settings
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Modal Components */}
            <SaveRecordingModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onSave={handleSaveConfirm}
                segmentCount={displayedTranscript.length}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onClearTranscript={() => {
                    setDisplayedTranscript([]);
                    setShowSuccessModal(false);
                }}
                recordingTitle={successMessage.title}
                segmentCount={successMessage.segmentCount}
            />

            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                onRetry={() => {
                    setShowErrorModal(false);
                    if (errorMessage.includes('save')) {
                        setShowSaveModal(true);
                    }
                }}
                message={errorMessage}
                title={errorMessage.includes('save') ? 'Save Failed' : 'Cannot Save Recording'}
            />
        </div>
    );
};
