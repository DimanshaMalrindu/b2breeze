import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, X, Trash2 } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClearTranscript: () => void;
    recordingTitle: string;
    segmentCount: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    onClearTranscript,
    recordingTitle,
    segmentCount
}) => {
    const handleClearAndClose = () => {
        onClearTranscript();
        onClose();
    };

    const handleKeepAndClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
                <Card className="border-0 shadow-none">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Recording Saved Successfully!
                            </CardTitle>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-2">"{recordingTitle}"</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>✅ Saved with {segmentCount} conversation segments</li>
                                <li>✅ Summary and key points generated</li>
                                <li>✅ AI analysis started in background</li>
                                <li>✅ Available in your recordings library</li>
                            </ul>
                        </div>

                        {/* Next Steps */}
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">
                                Would you like to clear the current transcript to start a fresh recording?
                            </p>

                            <div className="flex justify-center space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={handleKeepAndClose}
                                    className="flex items-center gap-2"
                                >
                                    Keep Transcript
                                </Button>
                                <Button
                                    onClick={handleClearAndClose}
                                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear & Start Fresh
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
