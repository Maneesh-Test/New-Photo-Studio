//
//  AdjustmentSettings.swift
//  PhotoStudio
//
//  Data models for all adjustment parameters
//

import Foundation

struct AdjustmentSettings: Codable, Equatable {
    var brightness: Double = 0.0        // -1.0 to 1.0
    var contrast: Double = 1.0          // 0.0 to 2.0
    var saturation: Double = 1.0        // 0.0 to 2.0
    var exposure: Double = 0.0          // -2.0 to 2.0
    var highlights: Double = 0.0        // -1.0 to 1.0
    var shadows: Double = 0.0           // -1.0 to 1.0
    var temperature: Double = 0.0       // -1.0 to 1.0
    var tint: Double = 0.0              // -1.0 to 1.0
    var sharpness: Double = 0.0         // 0.0 to 2.0
    var clarity: Double = 0.0           // -1.0 to 1.0
    var vibrance: Double = 0.0          // -1.0 to 1.0
    var vignette: Double = 0.0          // 0.0 to 1.0
    var grain: Double = 0.0             // 0.0 to 1.0
    
    static let defaultSettings = AdjustmentSettings()
    
    mutating func reset() {
        self = AdjustmentSettings.defaultSettings
    }
}

// Individual adjustment parameter
struct AdjustmentParameter: Identifiable {
    let id = UUID()
    let name: String
    let keyPath: WritableKeyPath<AdjustmentSettings, Double>
    let min: Double
    let max: Double
    let defaultValue: Double
    let iconName: String
    
    static let allParameters: [AdjustmentParameter] = [
        AdjustmentParameter(name: "Brightness", keyPath: \.brightness, min: -1.0, max: 1.0, defaultValue: 0.0, iconName: "sun.max"),
        AdjustmentParameter(name: "Contrast", keyPath: \.contrast, min: 0.0, max: 2.0, defaultValue: 1.0, iconName: "circle.lefthalf.filled"),
        AdjustmentParameter(name: "Saturation", keyPath: \.saturation, min: 0.0, max: 2.0, defaultValue: 1.0, iconName: "paintbrush"),
        AdjustmentParameter(name: "Exposure", keyPath: \.exposure, min: -2.0, max: 2.0, defaultValue: 0.0, iconName: "camera.aperture"),
        AdjustmentParameter(name: "Highlights", keyPath: \.highlights, min: -1.0, max: 1.0, defaultValue: 0.0, iconName: "light.max"),
        AdjustmentParameter(name: "Shadows", keyPath: \.shadows, min: -1.0, max: 1.0, defaultValue: 0.0, iconName: "light.min"),
        AdjustmentParameter(name: "Temperature", keyPath: \.temperature, min: -1.0, max: 1.0, defaultValue: 0.0, iconName: "thermometer"),
        AdjustmentParameter(name: "Tint", keyPath: \.tint, min: -1.0, max: 1.0, defaultValue: 0.0, iconName: "eyedropper"),
        AdjustmentParameter(name: "Sharpness", keyPath: \.sharpness, min: 0.0, max: 2.0, defaultValue: 0.0, iconName: "triangle"),
        AdjustmentParameter(name: "Clarity", keyPath: \.clarity, min: -1.0, max: 1.0, defaultValue: 0.0, iconName: "sparkle"),
        AdjustmentParameter(name: "Vibrance", keyPath: \.vibrance, min: -1.0, max: 1.0, defaultValue: 0.0, iconName: "wand.and.rays"),
        AdjustmentParameter(name: "Vignette", keyPath: \.vignette, min: 0.0, max: 1.0, defaultValue: 0.0, iconName: "circle.grid.cross"),
        AdjustmentParameter(name: "Grain", keyPath: \.grain, min: 0.0, max: 1.0, defaultValue: 0.0, iconName: "camera.metering.matrix")
    ]
}
