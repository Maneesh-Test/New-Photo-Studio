//
//  HistoryManager.swift
//  PhotoStudio
//
//  Undo/redo functionality with efficient state snapshots
//

import UIKit

class HistoryManager {
    private var undoStack: [EditorState] = []
    private var redoStack: [EditorState] = []
    private let maxHistorySize = 20
    
    var canUndo: Bool {
        return undoStack.count > 1
    }
    
    var canRedo: Bool {
        return !redoStack.isEmpty
    }
    
    func addState(image: UIImage, adjustments: AdjustmentSettings) {
        let state = EditorState(image: image, adjustments: adjustments)
        undoStack.append(state)
        
        // Limit history size
        if undoStack.count > maxHistorySize {
            undoStack.removeFirst()
        }
        
        // Clear redo stack when new state is added
        redoStack.removeAll()
    }
    
    func undo() -> EditorState? {
        guard canUndo else { return nil }
        
        let currentState = undoStack.removeLast()
        redoStack.append(currentState)
        
        return undoStack.last
    }
    
    func redo() -> EditorState? {
        guard canRedo else { return nil }
        
        let state = redoStack.removeLast()
        undoStack.append(state)
        
        return state
    }
    
    func clear() {
        undoStack.removeAll()
        redoStack.removeAll()
    }
}

struct EditorState {
    let image: UIImage
    let adjustments: AdjustmentSettings
    let timestamp: Date
    
    init(image: UIImage, adjustments: AdjustmentSettings) {
        self.image = image
        self.adjustments = adjustments
        self.timestamp = Date()
    }
}
