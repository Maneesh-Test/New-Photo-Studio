//
//  FilterPreset.swift
//  PhotoStudio
//
//  Predefined filter configurations
//

import Foundation
import CoreImage

struct FilterPreset: Identifiable, Equatable {
    let id = UUID()
    let name: String
    let adjustments: AdjustmentSettings
    let ciFilters: [String: [String: Any]]  // CIFilter name -> parameters
    
    static let allPresets: [FilterPreset] = [
        // Original (no filter)
        FilterPreset(
            name: "Original",
            adjustments: AdjustmentSettings(),
            ciFilters: [:]
        ),
        
        // Black & White
        FilterPreset(
            name: "B&W",
            adjustments: AdjustmentSettings(
                contrast: 1.2,
                saturation: 0.0,
                clarity: 0.3
            ),
            ciFilters: [:]
        ),
        
        // Vintage
        FilterPreset(
            name: "Vintage",
            adjustments: AdjustmentSettings(
                contrast: 0.9,
                saturation: 0.7,
                temperature: 0.2,
                vignette: 0.3,
                grain: 0.2
            ),
            ciFilters: [
                "CISepiaTone": ["inputIntensity": 0.5]
            ]
        ),
        
        // Vivid
        FilterPreset(
            name: "Vivid",
            adjustments: AdjustmentSettings(
                contrast: 1.3,
                saturation: 1.5,
                vibrance: 0.5,
                clarity: 0.4
            ),
            ciFilters: [:]
        ),
        
        // Warm
        FilterPreset(
            name: "Warm",
            adjustments: AdjustmentSettings(
                brightness: 0.1,
                saturation: 1.2,
                temperature: 0.4,
                tint: 0.1
            ),
            ciFilters: [:]
        ),
        
        // Cool
        FilterPreset(
            name: "Cool",
            adjustments: AdjustmentSettings(
                saturation: 1.1,
                temperature: -0.4,
                tint: -0.1
            ),
            ciFilters: [:]
        ),
        
        // Dramatic
        FilterPreset(
            name: "Dramatic",
            adjustments: AdjustmentSettings(
                brightness: -0.1,
                contrast: 1.5,
                saturation: 0.8,
                highlights: -0.3,
                shadows: 0.3,
                clarity: 0.6,
                vignette: 0.4
            ),
            ciFilters: [:]
        ),
        
        // Fade
        FilterPreset(
            name: "Fade",
            adjustments: AdjustmentSettings(
                brightness: 0.2,
                contrast: 0.7,
                saturation: 0.8,
                highlights: 0.2
            ),
            ciFilters: [:]
        ),
        
        // Chrome
        FilterPreset(
            name: "Chrome",
            adjustments: AdjustmentSettings(
                contrast: 1.4,
                saturation: 1.3,
                clarity: 0.5
            ),
            ciFilters: [
                "CIPhotoEffectChrome": [:]
            ]
        ),
        
        // Noir
        FilterPreset(
            name: "Noir",
            adjustments: AdjustmentSettings(
                brightness: -0.2,
                contrast: 1.6,
                saturation: 0.0,
                vignette: 0.5
            ),
            ciFilters: [
                "CIPhotoEffectNoir": [:]
            ]
        ),
        
        // Mono
        FilterPreset(
            name: "Mono",
            adjustments: AdjustmentSettings(
                contrast: 1.3,
                saturation: 0.0,
                clarity: 0.4
            ),
            ciFilters: [
                "CIPhotoEffectMono": [:]
            ]
        ),
        
        // Tonal
        FilterPreset(
            name: "Tonal",
            adjustments: AdjustmentSettings(
                contrast: 1.2,
                saturation: 0.0
            ),
            ciFilters: [
                "CIPhotoEffectTonal": [:]
            ]
        )
    ]
}
