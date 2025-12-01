//
//  EditingTool.swift
//  PhotoStudio
//
//  Defines all available editing tools
//

import Foundation

enum EditingTool: String, CaseIterable, Identifiable {
    case adjust = "Adjust"
    case filters = "Filters"
    case crop = "Crop"
    case draw = "Draw"
    case text = "Text"
    case ai = "AI"
    case curves = "Curves"
    case hsl = "HSL"
    case effects = "Effects"
    case layers = "Layers"
    
    var id: String { rawValue }
    
    var iconName: String {
        switch self {
        case .adjust: return "slider.horizontal.3"
        case .filters: return "camera.filters"
        case .crop: return "crop"
        case .draw: return "pencil.tip"
        case .text: return "textformat"
        case .ai: return "sparkles"
        case .curves: return "chart.line.uptrend.xyaxis"
        case .hsl: return "paintpalette"
        case .effects: return "wand.and.stars"
        case .layers: return "square.3.layers.3d"
        }
    }
    
    var description: String {
        switch self {
        case .adjust: return "Brightness, contrast, saturation, and more"
        case .filters: return "Apply preset filters"
        case .crop: return "Crop and rotate image"
        case .draw: return "Draw and add shapes"
        case .text: return "Add text overlay"
        case .ai: return "AI-powered enhancements"
        case .curves: return "Professional curves adjustment"
        case .hsl: return "Hue, saturation, luminance controls"
        case .effects: return "Vignette, grain, blur effects"
        case .layers: return "Manage layers"
        }
    }
}
