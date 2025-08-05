import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRetry?: () => void;
    message: string;
    title?: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    onClose,
    onRetry,
    message,
    title = "Error"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
                <Card className="border-0 shadow-none">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                {title}
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
                        {/* Error Message */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700">{message}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                            {onRetry && (
                                <Button
                                    onClick={onRetry}
                                    className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
