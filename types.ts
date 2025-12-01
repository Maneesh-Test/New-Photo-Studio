
export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum ToolType {
  NONE = 'NONE',
  CROP = 'CROP',
  ADJUST = 'ADJUST',
  AI_EDIT = 'AI_EDIT',
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface AdjustmentSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
}

export const DEFAULT_ADJUSTMENTS: AdjustmentSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  rotation: 0,
  flipX: false,
  flipY: false,
};

export interface HistoryItem {
  imageData: string; // Base64
  thumbnail: string;
  timestamp: number;
}

export interface CropState {
  x: number; // Normalized 0-1
  y: number; // Normalized 0-1
  w: number; // Normalized 0-1
  h: number; // Normalized 0-1
}

export interface GridConfig {
  show: boolean;
  color: string;
  thickness: number;
}

export type AspectRatio = 'FREE' | '1:1' | '16:9' | '4:3' | '3:2';
