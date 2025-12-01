
import { GoogleGenAI, Modality } from "@google/genai";
import { GEMINI_MODEL_IMAGE_EDIT } from '../constants';

// Helper to strip base64 header if present
const extractBase64Data = (dataUrl: string): string => {
  return dataUrl.split(',')[1] || dataUrl;
};

const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  return match ? match[1] : 'image/png';
};

// Helper: Resize image to avoid hitting payload/token limits on Free Tier
const resizeImage = (base64Str: string, maxWidth: number = 1024): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Resize if larger than maxWidth
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxWidth / height;
          height = maxWidth;
        }
      } else {
        resolve(base64Str);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG 0.8 to further reduce size
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
    img.src = base64Str;
  });
};

// Robust API Key retrieval
export const getApiKey = (): string | undefined => {
  const candidates: string[] = [];

  // 1. Check Vite-specific import.meta.env (Prioritize for Bolt/Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    if (import.meta.env.VITE_API_KEY) candidates.push(import.meta.env.VITE_API_KEY);
    // @ts-ignore
    if (import.meta.env.VITE_GEMINI_API_KEY) candidates.push(import.meta.env.VITE_GEMINI_API_KEY);
    // @ts-ignore
    if (import.meta.env.VITE_GEMINI_API) candidates.push(import.meta.env.VITE_GEMINI_API);
    // @ts-ignore
    if (import.meta.env.API_KEY) candidates.push(import.meta.env.API_KEY);
  }

  // 2. Check standard process.env (Node/Polyfilled)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_API_KEY) candidates.push(process.env.VITE_API_KEY);
    if (process.env.VITE_GEMINI_API_KEY) candidates.push(process.env.VITE_GEMINI_API_KEY);
    if (process.env.VITE_GEMINI_API) candidates.push(process.env.VITE_GEMINI_API);
    if (process.env.API_KEY) candidates.push(process.env.API_KEY);
  }

  // Filter out obviously bad keys (empty, placeholders)
  const cleanCandidates = candidates
    .filter(k => k && typeof k === 'string')
    .map(k => k.trim())
    .filter(k => k.length > 0);

  // Priority 1: Keys that start with 'AIza' (Standard Google Format)
  const validKey = cleanCandidates.find(k => k.startsWith('AIza'));
  if (validKey) return validKey;

  // Priority 2: Any other key (Fallback)
  return cleanCandidates[0];
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processImageWithGemini = async (
  base64Image: string,
  promptText: string
): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("API Key lookup failed. Checked VITE_API_KEY, VITE_GEMINI_API and API_KEY.");
    throw new Error("API Key is missing. Please check your .env file.");
  }

  // DEBUG: Log key fragment
  const keyFragment = apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'Invalid Key';
  console.log(`[MCR Studio] Active Key Fragment: ${keyFragment}`);

  const ai = new GoogleGenAI({ apiKey });

  // Resize image before sending to reduce token usage/latency
  const processedBase64 = await resizeImage(base64Image, 1024);

  const mimeType = getMimeType(processedBase64);
  const imageBytes = extractBase64Data(processedBase64);

  // Retry Logic Configuration
  const MAX_RETRIES = 3;
  let attempt = 0;
  let lastError: any;

  while (attempt < MAX_RETRIES) {
    try {
      if (attempt > 0) {
        console.log(`[MCR Studio] Retry attempt ${attempt}/${MAX_RETRIES}...`);
      }

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL_IMAGE_EDIT,
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBytes,
                mimeType: mimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      // Extract image from response
      const candidates = response.candidates;
      if (candidates && candidates.length > 0) {
        const parts = candidates[0].content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              const resultMime = part.inlineData.mimeType || 'image/png';
              return `data:${resultMime};base64,${part.inlineData.data}`;
            }
          }
          // Check for text rejection
          if (parts.length > 0 && parts[0].text) {
            // If the model refuses (safety etc), do not retry.
            console.warn("Gemini returned text:", parts[0].text);
            throw new Error(`Model refused image generation: ${parts[0].text}`);
          }
        }
      }
      throw new Error("No image generated by the model.");

    } catch (error: any) {
      lastError = error;
      console.error(`[MCR Studio] Attempt ${attempt + 1} failed:`, error);

      // Check if we should retry
      const isQuota = error.message && (error.message.includes("429") || error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("resource exhausted"));
      const isServer = error.message && (error.message.includes("503") || error.message.includes("500"));

      if (isQuota || isServer) {
        attempt++;
        if (attempt < MAX_RETRIES) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt - 1) * 1000;
          await wait(delay);
          continue;
        }
      }

      // If it's a 400/401/403 or we ran out of retries, break loop
      break;
    }
  }

  // Final Error Handling
  const errorMsg = lastError?.message || "Unknown error";

  if (errorMsg.includes("429") || errorMsg.toLowerCase().includes("quota") || errorMsg.toLowerCase().includes("resource exhausted")) {
    throw new Error(`Quota Exceeded (429). Your API key has 0 quota for this image model. Please enable billing or check limits in Google Cloud Console.`);
  }

  if (errorMsg.includes("400") && (errorMsg.toLowerCase().includes("billing") || errorMsg.toLowerCase().includes("accessible to billed users"))) {
    throw new Error(`Billing Required (400). Image generation requires an active billing account in Google Cloud Console.`);
  }

  if (errorMsg.includes("403") || errorMsg.includes("API Key")) {
    throw new Error("Invalid API Key (403). Please check that your key is enabled in Google Cloud Console.");
  }

  throw lastError || new Error("Failed to process image.");
};
