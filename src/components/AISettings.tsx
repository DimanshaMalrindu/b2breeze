import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Key, Zap } from 'lucide-react';
import { getAIAnalysisSettings, saveAIAnalysisSettings } from '@/lib/conversation-utils';

interface AISettingsProps {
    onClose: () => void;
}

export const AISettings: React.FC<AISettingsProps> = ({ onClose }) => {
    const [settings, setSettings] = useState(() => getAIAnalysisSettings());
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            saveAIAnalysisSettings(settings);
            setTimeout(() => {
                setIsSaving(false);
                onClose();
            }, 500);
        } catch (error) {
            console.error('Error saving AI settings:', error);
            setIsSaving(false);
        }
    };

    const handleProviderChange = (provider: string) => {
        setSettings((prev: any) => ({ ...prev, provider: provider as any }));
    };

    const handleAnalysisTypeChange = (type: string, enabled: boolean) => {
        setSettings((prev: any) => ({
            ...prev,
            analysisTypes: {
                ...prev.analysisTypes,
                [type]: enabled
            }
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
                <Card className="border-0 shadow-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            AI Analysis Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* AI Provider Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-3">AI Provider</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                    { id: 'local', name: 'Local/Mock', description: 'For testing and development' },
                                    { id: 'openai', name: 'OpenAI', description: 'GPT-4 powered analysis' },
                                    { id: 'anthropic', name: 'Claude', description: 'Anthropic Claude AI' }
                                ].map((provider) => (
                                    <div
                                        key={provider.id}
                                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${settings.provider === provider.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleProviderChange(provider.id)}
                                    >
                                        <div className="font-medium">{provider.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{provider.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* API Configuration */}
                        {settings.provider !== 'local' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        <Key className="w-4 h-4 inline mr-1" />
                                        API Key
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="Enter your API key"
                                        value={settings.apiKey || ''}
                                        onChange={(e) => setSettings((prev: any) => ({ ...prev, apiKey: e.target.value }))}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {settings.provider === 'openai'
                                            ? 'Get your API key from platform.openai.com'
                                            : 'Get your API key from console.anthropic.com'
                                        }
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Model</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={settings.model || ''}
                                        onChange={(e) => setSettings((prev: any) => ({ ...prev, model: e.target.value }))}
                                    >
                                        {settings.provider === 'openai' ? (
                                            <>
                                                <option value="gpt-4">GPT-4</option>
                                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                                                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                                                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Analysis Types */}
                        <div>
                            <label className="block text-sm font-medium mb-3">
                                <Zap className="w-4 h-4 inline mr-1" />
                                Analysis Features
                            </label>
                            <div className="space-y-3">
                                {[
                                    { key: 'extractSpecialPoints', label: 'Extract Special Points', description: 'Identify key discussion points, requirements, and insights' },
                                    { key: 'generateSummary', label: 'Generate Summary', description: 'Create conversation summaries' },
                                    { key: 'identifyKeywords', label: 'Identify Keywords', description: 'Extract important keywords and topics' },
                                    { key: 'detectSentiment', label: 'Detect Sentiment', description: 'Analyze conversation sentiment' },
                                    { key: 'suggestFollowUps', label: 'Suggest Follow-ups', description: 'Recommend follow-up actions' }
                                ].map((feature) => (
                                    <div key={feature.key} className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            id={feature.key}
                                            checked={settings.analysisTypes[feature.key as keyof typeof settings.analysisTypes]}
                                            onChange={(e) => handleAnalysisTypeChange(feature.key, e.target.checked)}
                                            className="mt-1"
                                        />
                                        <div>
                                            <label htmlFor={feature.key} className="font-medium cursor-pointer">
                                                {feature.label}
                                            </label>
                                            <p className="text-xs text-gray-500">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confidence Threshold */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Confidence Threshold: {(settings.confidenceThreshold * 100).toFixed(0)}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.confidenceThreshold}
                                onChange={(e) => setSettings((prev: any) => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }))}
                                className="w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum confidence level for AI analysis results
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
