import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, Edit3, Save, User, FileText, Bell, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { extractTextFromImage } from '@/lib/ocr-utils';
import type { ContactFormData, BusinessCardData } from '@/types/business-card';

interface BusinessCardScannerProps {
    onSave?: (cardData: BusinessCardData) => void;
    onClose?: () => void;
}

export const BusinessCardScanner: React.FC<BusinessCardScannerProps> = ({ onSave, onClose }) => {
    const [currentStep, setCurrentStep] = useState<'capture' | 'edit' | 'complete'>('capture');
    const [isProcessing, setIsProcessing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [showWebcam, setShowWebcam] = useState(false);
    const [extractedText, setExtractedText] = useState('');
    const [customerPhoto, setCustomerPhoto] = useState<string | null>(null);
    const [inquiryPhoto, setInquiryPhoto] = useState<string | null>(null);
    const [reminderDate, setReminderDate] = useState('');

    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const customerPhotoRef = useRef<HTMLInputElement>(null);
    const inquiryPhotoRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        company: '',
        title: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        notes: ''
    });

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
            setShowWebcam(false);
            processImage(imageSrc);
        }
    }, [webcamRef]);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageSrc = e.target?.result as string;
                setCapturedImage(imageSrc);
                processImage(file);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const processImage = async (imageSource: File | string) => {
        setIsProcessing(true);
        try {
            const result = await extractTextFromImage(imageSource);
            setExtractedText(result.text);
            setFormData(prev => ({
                ...prev,
                ...result.extractedData
            }));
            setCurrentStep('edit');
        } catch (error) {
            console.error('Failed to process image:', error);
            alert('Failed to process image. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePhotoUpload = (type: 'customer' | 'inquiry') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageSrc = e.target?.result as string;
                if (type === 'customer') {
                    setCustomerPhoto(imageSrc);
                } else {
                    setInquiryPhoto(imageSrc);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!capturedImage) return;

        const businessCardData: BusinessCardData = {
            id: Date.now().toString(),
            ...formData,
            customerPhoto: customerPhoto || undefined,
            inquiryPhoto: inquiryPhoto || undefined,
            originalCardImage: capturedImage,
            createdAt: new Date(),
            updatedAt: new Date(),
            reminderDate: reminderDate ? new Date(reminderDate) : undefined
        };

        // Save to local storage for demo
        const existingCards = JSON.parse(localStorage.getItem('businessCards') || '[]');
        existingCards.push(businessCardData);
        localStorage.setItem('businessCards', JSON.stringify(existingCards));

        onSave?.(businessCardData);
        setCurrentStep('complete');
    };

    const generateMyCard = () => {
        // This would typically open a modal for creating user's own digital business card
        alert('Digital business card generator coming soon!');
    };

    if (currentStep === 'complete') {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Save className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle>Contact Saved Successfully!</CardTitle>
                    <CardDescription>
                        The business card has been saved to your wallet and customer directory.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" onClick={generateMyCard} className="w-full">
                            <QrCode className="w-4 h-4 mr-2" />
                            Generate My Digital Card
                        </Button>
                        <Button onClick={onClose} className="w-full">
                            Done
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (currentStep === 'edit') {
        return (
            <div className="w-full max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Edit3 className="w-5 h-5" />
                            Edit Contact Information
                        </CardTitle>
                        <CardDescription>
                            Review and edit the extracted information from the business card.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Original Image and Extracted Text */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Scanned Business Card</Label>
                                {capturedImage && (
                                    <img
                                        src={capturedImage}
                                        alt="Scanned business card"
                                        className="w-full h-48 object-cover rounded-lg border mt-2"
                                    />
                                )}
                            </div>
                            <div>
                                <Label>Extracted Text</Label>
                                <Textarea
                                    value={extractedText}
                                    readOnly
                                    className="h-48 mt-2 text-xs"
                                    placeholder="Extracted text will appear here..."
                                />
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    value={formData.company}
                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter job title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter email address"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    placeholder="Enter website URL"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Enter address"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Additional notes about this contact"
                                rows={3}
                            />
                        </div>

                        {/* Additional Photos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label>Customer Photo</Label>
                                <div className="mt-2 space-y-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => customerPhotoRef.current?.click()}
                                        className="w-full"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        {customerPhoto ? 'Change Photo' : 'Add Customer Photo'}
                                    </Button>
                                    <input
                                        ref={customerPhotoRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload('customer')}
                                        className="hidden"
                                    />
                                    {customerPhoto && (
                                        <img
                                            src={customerPhoto}
                                            alt="Customer"
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label>Inquiry/Product Note</Label>
                                <div className="mt-2 space-y-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => inquiryPhotoRef.current?.click()}
                                        className="w-full"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        {inquiryPhoto ? 'Change Note' : 'Add Inquiry Note'}
                                    </Button>
                                    <input
                                        ref={inquiryPhotoRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload('inquiry')}
                                        className="hidden"
                                    />
                                    {inquiryPhoto && (
                                        <img
                                            src={inquiryPhoto}
                                            alt="Inquiry note"
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reminder */}
                        <div>
                            <Label htmlFor="reminder">Follow-up Reminder (Optional)</Label>
                            <div className="flex gap-2 mt-2">
                                <Bell className="w-5 h-5 text-muted-foreground mt-2" />
                                <Input
                                    id="reminder"
                                    type="datetime-local"
                                    value={reminderDate}
                                    onChange={(e) => setReminderDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button variant="outline" onClick={() => setCurrentStep('capture')} className="flex-1">
                                Back
                            </Button>
                            <Button onClick={handleSave} className="flex-1" disabled={!formData.name}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Contact
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Business Card Scanner
                    </CardTitle>
                    <CardDescription>
                        Capture or upload a business card image to extract contact information automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isProcessing && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Processing image and extracting text...</p>
                        </div>
                    )}

                    {!isProcessing && (
                        <>
                            {showWebcam ? (
                                <div className="space-y-4">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full rounded-lg"
                                        videoConstraints={{ facingMode: "environment" }}
                                    />
                                    <div className="flex gap-4">
                                        <Button onClick={capture} className="flex-1">
                                            <Camera className="w-4 h-4 mr-2" />
                                            Capture Photo
                                        </Button>
                                        <Button variant="outline" onClick={() => setShowWebcam(false)} className="flex-1">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => setShowWebcam(true)}
                                        className="h-32 flex-col gap-2"
                                        variant="outline"
                                    >
                                        <Camera className="w-8 h-8" />
                                        <span>Use Camera</span>
                                        <span className="text-xs text-muted-foreground">Take a photo of the business card</span>
                                    </Button>

                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-32 flex-col gap-2"
                                        variant="outline"
                                    >
                                        <Upload className="w-8 h-8" />
                                        <span>Upload Image</span>
                                        <span className="text-xs text-muted-foreground">Select from your device</span>
                                    </Button>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {capturedImage && !isProcessing && (
                                <div className="space-y-4">
                                    <Label>Captured Image</Label>
                                    <img
                                        src={capturedImage}
                                        alt="Captured business card"
                                        className="w-full max-h-64 object-contain rounded-lg border"
                                    />
                                    <Button onClick={() => setCapturedImage(null)} variant="outline" className="w-full">
                                        Retake Photo
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
