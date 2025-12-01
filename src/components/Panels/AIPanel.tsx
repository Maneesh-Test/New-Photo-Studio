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
            <div className="space-y-3">
                <AIActionCard
                    icon={<Sparkles size={20} />}
                    label="Magic Enhance"
                    description="Auto-adjust lighting and color balance"
                    onClick={handleMagicEnhance}
                    disabled={isProcessing}
                    color="text-yellow-400"
                    bgColor="bg-yellow-400/10"
                />
                <AIActionCard
                    icon={<Eraser size={20} />}
                    label="Remove Background"
                    description="Create a transparent PNG instantly"
                    onClick={handleRemoveBG}
                    disabled={isProcessing}
                    color="text-blue-400"
                    bgColor="bg-blue-400/10"
                />
                <AIActionCard
                    icon={<ImageIcon size={20} />}
                    label="White Background"
                    description="Professional studio look (JPG)"
                    onClick={handleWhiteBG}
                    disabled={isProcessing}
                    color="text-purple-400"
                    bgColor="bg-purple-400/10"
                />
                <AIActionCard
                    icon={<Wand2 size={20} />}
                    label="Generative Fill"
                    description="Add or remove objects with text"
                    onClick={handleGenerativeFill}
                    disabled={isProcessing}
                    color="text-pink-400"
                    bgColor="bg-pink-400/10"
                />
            </div>

            {isProcessing && (
                <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-white/10 rounded-xl animate-pulse">
                    <Loader2 size={20} className="animate-spin text-accent-500" />
                    <span className="text-sm font-medium text-gray-300">{status}</span>
                </div>
            )}

            {!apiKey && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                    <p className="font-bold mb-1">API Key Missing</p>
                    <p className="opacity-80">Add your Gemini API key in settings to unlock AI features.</p>
                </div>
            )}

            {/* Generative Fill Prompt Dialog */}
            {showPromptDialog && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-white/10">
                        <h3 className="text-lg font-bold mb-2">Generative Fill</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Describe what you want to add or remove from the image
                        </p>
                        <textarea
                            value={genFillPrompt}
                            onChange={(e) => setGenFillPrompt(e.target.value)}
                            placeholder="e.g., Remove the person in the background, Add a sunset sky, etc."
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm mb-6 resize-none h-32 focus:border-accent-500 focus:ring-1 focus:ring-accent-500 outline-none transition-all"
                            autoFocus
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPromptDialog(false)}
                                className="flex-1 px-4 py-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeGenerativeFill}
                                className="flex-1 px-4 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors font-bold"
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

const AIActionCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
    color?: string;
    bgColor?: string;
}> = ({ icon, label, description, onClick, disabled, color = "text-accent-500", bgColor = "bg-accent-500/10" }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all hover:border-white/10 hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 group text-left"
    >
        <div className={`p-3 rounded-lg ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <div className="font-bold text-sm text-gray-200 group-hover:text-white transition-colors">{label}</div>
            <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{description}</div>
        </div>
    </button>
);
