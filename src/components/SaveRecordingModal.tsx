import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Save, User, FileText } from 'lucide-react';

interface SaveRecordingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, clientName?: string) => void;
    segmentCount: number;
}

export const SaveRecordingModal: React.FC<SaveRecordingModalProps> = ({
    isOpen,
    onClose,
    onSave,
    segmentCount
}) => {
    const [title, setTitle] = useState(`Recording ${new Date().toLocaleString()}`);
    const [clientName, setClientName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title.trim()) {
            alert('Please enter a title for the recording.');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(title.trim(), clientName.trim() || undefined);
            onClose();
            // Reset form
            setTitle(`Recording ${new Date().toLocaleString()}`);
            setClientName('');
        } catch (error) {
            console.error('Error saving recording:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (!isSaving) {
            onClose();
            // Reset form
            setTitle(`Recording ${new Date().toLocaleString()}`);
            setClientName('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
                <Card className="border-0 shadow-none">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Save className="w-5 h-5 text-blue-500" />
                                Save Recording
                            </CardTitle>
                            <button
                                onClick={handleClose}
                                disabled={isSaving}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Save your conversation with {segmentCount} segments to your recordings library.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Recording Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Recording Title *
                            </label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter recording title"
                                className="w-full"
                                disabled={isSaving}
                                required
                            />
                        </div>

                        {/* Client Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-1" />
                                Client Name (Optional)
                            </label>
                            <Input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                placeholder="Enter client name"
                                className="w-full"
                                disabled={isSaving}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This will help you organize and search your recordings
                            </p>
                        </div>

                        {/* Recording Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h4 className="font-medium text-blue-900 mb-1">Recording Details</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• {segmentCount} conversation segments</li>
                                <li>• Auto-generated summary and key points</li>
                                <li>• AI analysis will be performed</li>
                                <li>• Saved to your recordings library</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSaving}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || !title.trim()}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Recording
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
