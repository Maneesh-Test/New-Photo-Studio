//
//  Config.swift
//  PhotoStudio
//
//  Configuration file for API keys and settings
//

import Foundation

struct AppConfig {
    // MARK: - API Keys
    
    /// Google Gemini API Key
    /// Get your key from: https://makersuite.google.com/app/apikey
    /// Leave empty to disable cloud-based AI features
    static let geminiAPIKey = ""
    
    // MARK: - Feature Flags
    
    /// Enable cloud-based AI features (requires Gemini API key)
    static let enableCloudAI = !geminiAPIKey.isEmpty
    
    /// Enable on-device AI features (Vision framework)
    static let enableOnDeviceAI = true
    
    // MARK: - Processing Settings
    
    /// Maximum image dimension for processing (to prevent memory issues)
    static let maxImageDimension: CGFloat = 4096
    
    /// JPEG compression quality for export (0.0 to 1.0)
    static let defaultJPEGQuality: CGFloat = 0.85
    
    /// Maximum undo/redo history size
    static let maxHistorySize = 20
    
    // MARK: - UI Settings
    
    /// Primary accent color (purple)
    static let accentColorRed: Double = 0.6
    static let accentColorGreen: Double = 0.4
    static let accentColorBlue: Double = 0.9
    
    /// Animation duration for UI transitions
    static let animationDuration: Double = 0.3
}

// MARK: - Usage Instructions

/*
 HOW TO USE THIS CONFIG FILE:
 
 1. ADD YOUR GEMINI API KEY:
    - Go to: https://makersuite.google.com/app/apikey
    - Create a new API key
    - Copy the key
    - Paste it in the geminiAPIKey variable above
    - Example: static let geminiAPIKey = "AIzaSyC..."
 
 2. FEATURE FLAGS:
    - enableCloudAI: Automatically enabled when API key is set
    - enableOnDeviceAI: Always enabled (uses Apple Vision framework)
 
 3. PROCESSING SETTINGS:
    - maxImageDimension: Reduce if you experience memory issues
    - defaultJPEGQuality: Higher = better quality, larger file size
    - maxHistorySize: More = more undo levels, more memory usage
 
 4. UPDATE GEMINI SERVICE:
    - Open Services/GeminiService.swift
    - In AIPanel.swift, change:
      private let geminiService = GeminiService(apiKey: "YOUR_GEMINI_API_KEY")
    - To:
      private let geminiService = GeminiService(apiKey: AppConfig.geminiAPIKey)
 
 NOTES:
 - Keep your API key secure
 - Don't commit API keys to version control
 - Add Config.swift to .gitignore if needed
 - Cloud AI features require internet connection
 - On-device AI features work offline
 */
