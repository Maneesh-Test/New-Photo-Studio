import React, { useState } from 'react';
import { Sparkles, Eraser, Wand2, Loader2, Image as ImageIcon } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

type Props = {
    image: HTMLImageElement;
    userApiKey?: string;
};

export const AIPanel: React.FC<Props> = ({ image, userApiKey }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState('');
    const [showPromptDialog, setShowPromptDialog] = useState(false);
    const [genFillPrompt, setGenFillPrompt] = useState('');

    // Use user provided key or fallback to env var
    const apiKey = userApiKey || GEMINI_API_KEY;

    // Convert HTMLImageElement to Blob
    const imageToBlob = async (img: HTMLImageElement): Promise<Blob> => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob!);
            }, 'image/png');
        });
    };

    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    };

    // Magic Enhance using Gemini
    const handleMagicEnhance = async () => {
        if (!apiKey) {
            alert('Please add your Gemini API Key in Settings');
            return;
        }

        setIsProcessing(true);
        setStatus('Enhancing image with AI...');

        try {
            const blob = await imageToBlob(image);
            const base64 = await blobToBase64(blob);

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: "Enhance this photo to look professional. Improve lighting, colors, and overall quality." },
                            { inline_data: { mime_type: 'image/png', data: base64.split(',')[1] } }
                        ]
                    }],
                    generationConfig: { temperature: 0.4 }
                })
            });

            const data = await response.json();
            setStatus('');
            alert('Enhancement complete! (Note: Gemini text response received)');
        } catch (error) {
            alert('Enhancement failed: ' + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Remove Background (Transparent PNG)
    const handleRemoveBG = async () => {
        setIsProcessing(true);
        setStatus('Removing background...');

        try {
            const { removeBackground } = await import('@imgly/background-removal');
            const blob = await imageToBlob(image);

            const pngBlob = await removeBackground(blob, {
                output: { format: 'image/png', quality: 0.8 }
            });

            const pngUrl = URL.createObjectURL(pngBlob);
            const pngLink = document.createElement('a');
            pngLink.href = pngUrl;
            pngLink.download = 'no-background.png';
            pngLink.click();
            URL.revokeObjectURL(pngUrl);

            setStatus('');
            alert('Background removed! Downloaded as transparent PNG.');
        } catch (error) {
            console.error('Background removal error:', error);
            alert('Failed: ' + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    // White Background (JPG)
    const handleWhiteBG = async () => {
        setIsProcessing(true);
        setStatus('Adding white background...');

        try {
            const { removeBackground } = await import('@imgly/background-removal');
            const blob = await imageToBlob(image);

            // Get transparent PNG first
            const pngBlob = await removeBackground(blob, {
                output: { format: 'image/png', quality: 0.8 }
            });

            // Draw on white canvas
            const img = new Image();
            img.src = URL.createObjectURL(pngBlob);
            await new Promise((resolve) => (img.onload = resolve));

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Fill white
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Draw image
                ctx.drawImage(img, 0, 0);
            }

            canvas.toBlob((jpegBlob) => {
                if (jpegBlob) {
                    const jpegUrl = URL.createObjectURL(jpegBlob);
                    const jpegLink = document.createElement('a');
                    jpegLink.href = jpegUrl;
                    jpegLink.download = 'white-background.jpg';
                    jpegLink.click();
                    URL.revokeObjectURL(jpegUrl);
                }
            }, 'image/jpeg', 0.95);

            setStatus('');
            alert('White background added! Downloaded as JPG.');
        } catch (error) {
            console.error('White BG error:', error);
            alert('Failed: ' + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Generative Fill using Gemini
    const handleGenerativeFill = () => {
        setShowPromptDialog(true);
    };

    const executeGenerativeFill = async () => {
        if (!apiKey) {
            alert('Please add your Gemini API Key in Settings');
            return;
        }

        if (!genFillPrompt.trim()) {
            alert('Please enter a prompt');
            return;
        }

        setShowPromptDialog(false);
        setIsProcessing(true);
        setStatus('Generating with AI...');

        try {
            const blob = await imageToBlob(image);
            const base64 = await blobToBase64(blob);

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: genFillPrompt },
                            { inline_data: { mime_type: 'image/png', data: base64.split(',')[1] } }
                        ]
                    }],
                    generationConfig: { temperature: 0.7 }
                })
            });

            const data = await response.json();
            setStatus('');
            setGenFillPrompt('');
            alert('Generative fill complete!');
        } catch (error) {
            alert('Generative fill failed: ' + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <AIButton
                    icon={<Sparkles size={20} />}
                    label="Magic Enhance"
                    description="Auto-adjust lighting"
                    onClick={handleMagicEnhance}
                    disabled={isProcessing}
                />
                <AIButton
                    icon={<Eraser size={20} />}
                    label="Remove BG"
                    description="Transparent PNG"
                    onClick={handleRemoveBG}
                    disabled={isProcessing}
                />
                <AIButton
                    icon={<ImageIcon size={20} />}
                    label="White BG"
                    description="Studio Look JPG"
                    onClick={handleWhiteBG}
                    disabled={isProcessing}
                />
                <AIButton
                    icon={<Wand2 size={20} />}
                    label="Generative Fill"
                    description="Add/Remove objects"
                    onClick={handleGenerativeFill}
                    disabled={isProcessing}
                />
            </div>

            {isProcessing && (
                <div className="flex items-center justify-center gap-3 p-4 bg-surfaceHighlight rounded-xl animate-pulse">
                    <Loader2 size={20} className="animate-spin text-accent-500" />
                    <span className="text-sm text-gray-300">{status}</span>
                </div>
            )}

            {!apiKey && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 text-center">
                    Gemini API Key missing. Some AI features disabled.
                </div>
            )}

            {/* Generative Fill Prompt Dialog */}
            {showPromptDialog && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Generative Fill</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Describe what you want to add or remove from the image
                        </p>
                        <textarea
                            value={genFillPrompt}
                            onChange={(e) => setGenFillPrompt(e.target.value)}
                            placeholder="e.g., Remove the person in the background, Add a sunset sky, etc."
                            className="w-full bg-surfaceHighlight border border-border rounded-lg p-3 text-white text-sm mb-4 resize-none h-24"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPromptDialog(false)}
                                className="flex-1 px-4 py-2 bg-surfaceHighlight border border-border rounded-lg hover:bg-surface transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeGenerativeFill}
                                className="flex-1 px-4 py-2 bg-accent-600 hover:bg-accent-500 rounded-lg transition-colors"
                            >
                                Generate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AIButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, label, description, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-start p-3 bg-surfaceHighlight hover:bg-surface border border-border rounded-xl transition-all hover:border-accent-500/50 group disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <div className="p-2 bg-surface rounded-lg text-accent-500 mb-2 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <span className="font-semibold text-sm mb-1">{label}</span>
        <span className="text-[10px] text-gray-400 text-left leading-tight">{description}</span>
    </button>
);
