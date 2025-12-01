//
//  ImageEditorState.swift
//  PhotoStudio
//
//  Observable state management for the editor
//

import SwiftUI
import UIKit
import Combine

class ImageEditorState: ObservableObject {
    // Current image
    @Published var originalImage: UIImage?
    @Published var currentImage: UIImage?
    @Published var processedImage: UIImage?
    
    // Selected tool
    @Published var selectedTool: EditingTool?
    
    // Adjustments
    @Published var adjustments = AdjustmentSettings()
    @Published var selectedFilter: FilterPreset?
    
    // Crop state
    @Published var cropAspectRatio: CGFloat?
    @Published var cropRotation: Double = 0.0
    @Published var isFlippedHorizontal = false
    @Published var isFlippedVertical = false
    
    // Drawing state
    @Published var drawingColor: Color = .black
    @Published var brushSize: CGFloat = 5.0
    @Published var drawingOpacity: Double = 1.0
    
    // Text state
    @Published var textItems: [TextItem] = []
    
    // AI state
    @Published var isProcessingAI = false
    @Published var aiError: String?
    
    // History
    @Published var canUndo = false
    @Published var canRedo = false
    
    // UI state
    @Published var showImagePicker = false
    @Published var showExportSheet = false
    @Published var isProcessing = false
    @Published var processingMessage = ""
    
    // Zoom and pan
    @Published var zoomScale: CGFloat = 1.0
    @Published var offset: CGSize = .zero
    
    private var historyManager = HistoryManager()
    
    // Load image
    func loadImage(_ image: UIImage) {
        originalImage = image
        currentImage = image
        processedImage = image
        resetAllSettings()
        saveToHistory()
    }
    
    // Reset all settings
    func resetAllSettings() {
        adjustments = AdjustmentSettings()
        selectedFilter = nil
        cropRotation = 0.0
        isFlippedHorizontal = false
        isFlippedVertical = false
        drawingColor = .black
        brushSize = 5.0
        drawingOpacity = 1.0
        textItems = []
        zoomScale = 1.0
        offset = .zero
    }
    
    // History management
    func saveToHistory() {
        guard let image = processedImage else { return }
        historyManager.addState(image: image, adjustments: adjustments)
        updateHistoryButtons()
    }
    
    func undo() {
        if let state = historyManager.undo() {
            processedImage = state.image
            adjustments = state.adjustments
            updateHistoryButtons()
        }
    }
    
    func redo() {
        if let state = historyManager.redo() {
            processedImage = state.image
            adjustments = state.adjustments
            updateHistoryButtons()
        }
    }
    
    private func updateHistoryButtons() {
        canUndo = historyManager.canUndo
        canRedo = historyManager.canRedo
    }
}

// Text item model
struct TextItem: Identifiable, Equatable {
    let id = UUID()
    var text: String
    var position: CGPoint
    var fontSize: CGFloat
    var color: Color
    var fontName: String
    var rotation: Double
    var opacity: Double
}

// Crop aspect ratios
enum CropAspectRatio: String, CaseIterable, Identifiable {
    case free = "Free"
    case square = "1:1"
    case portrait = "4:5"
    case landscape = "5:4"
    case widescreen = "16:9"
    
    var id: String { rawValue }
    
    var ratio: CGFloat? {
        switch self {
        case .free: return nil
        case .square: return 1.0
        case .portrait: return 4.0/5.0
        case .landscape: return 5.0/4.0
        case .widescreen: return 16.0/9.0
        }
    }
}
