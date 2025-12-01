//
//  EditorView.swift
//  PhotoStudio
//
//  Main editing interface
//

import SwiftUI
import PhotosUI

struct EditorView: View {
    @ObservedObject var editorState: ImageEditorState
    @Environment(\.dismiss) var dismiss
    @State private var showingExportOptions = false
    
    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Top navigation bar
                TopNavigationBar(editorState: editorState, showingExportOptions: $showingExportOptions)
                
                // Image canvas
                ImageCanvas(editorState: editorState)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                
                // Tool selection bar
                ToolSelectionBar(editorState: editorState)
                
                // Tool panel (dynamic based on selected tool)
                if let selectedTool = editorState.selectedTool {
                    ToolPanel(tool: selectedTool, editorState: editorState)
                        .frame(height: 280)
                        .background(Color(white: 0.1))
                }
            }
        }
        .sheet(isPresented: $showingExportOptions) {
            ExportView(editorState: editorState)
        }
        .overlay {
            if editorState.isProcessing {
                LoadingOverlay(message: editorState.processingMessage)
            }
        }
    }
}

// MARK: - Top Navigation Bar

struct TopNavigationBar: View {
    @ObservedObject var editorState: ImageEditorState
    @Binding var showingExportOptions: Bool
    @State private var showingNewImagePicker = false
    @State private var selectedItem: PhotosPickerItem?
    
    var body: some View {
        HStack {
            // New image button
            PhotosPicker(selection: $selectedItem, matching: .images) {
                Image(systemName: "photo.on.rectangle")
                    .font(.system(size: 20))
                    .foregroundColor(.white)
                    .frame(width: 44, height: 44)
            }
            .onChange(of: selectedItem) { newItem in
                Task {
                    if let data = try? await newItem?.loadTransferable(type: Data.self),
                       let image = UIImage(data: data) {
                        await MainActor.run {
                            editorState.loadImage(image)
                        }
                    }
                }
            }
            
            Spacer()
            
            // Undo button
            Button(action: { editorState.undo() }) {
                Image(systemName: "arrow.uturn.backward")
                    .font(.system(size: 20))
                    .foregroundColor(editorState.canUndo ? .white : .gray)
                    .frame(width: 44, height: 44)
            }
            .disabled(!editorState.canUndo)
            
            // Redo button
            Button(action: { editorState.redo() }) {
                Image(systemName: "arrow.uturn.forward")
                    .font(.system(size: 20))
                    .foregroundColor(editorState.canRedo ? .white : .gray)
                    .frame(width: 44, height: 44)
            }
            .disabled(!editorState.canRedo)
            
            Spacer()
            
            // Export button
            Button(action: { showingExportOptions = true }) {
                Image(systemName: "square.and.arrow.up")
                    .font(.system(size: 20))
                    .foregroundColor(.white)
                    .frame(width: 44, height: 44)
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color.black.opacity(0.5))
    }
}

// MARK: - Tool Selection Bar

struct ToolSelectionBar: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 20) {
                ForEach(EditingTool.allCases) { tool in
                    ToolButton(
                        tool: tool,
                        isSelected: editorState.selectedTool == tool,
                        action: {
                            if editorState.selectedTool == tool {
                                editorState.selectedTool = nil
                            } else {
                                editorState.selectedTool = tool
                            }
                        }
                    )
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 12)
        }
        .background(Color(white: 0.15))
    }
}

struct ToolButton: View {
    let tool: EditingTool
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: tool.iconName)
                    .font(.system(size: 24))
                    .foregroundColor(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9) : .white)
                
                Text(tool.rawValue)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9) : .white.opacity(0.7))
            }
            .frame(width: 70)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 12)
                    .fill(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9).opacity(0.2) : Color.clear)
            )
        }
    }
}

// MARK: - Loading Overlay

struct LoadingOverlay: View {
    let message: String
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.7)
                .ignoresSafeArea()
            
            VStack(spacing: 20) {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(1.5)
                
                Text(message)
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(.white)
            }
            .padding(40)
            .background(Color(white: 0.2))
            .cornerRadius(20)
        }
    }
}

#Preview {
    EditorView(editorState: ImageEditorState())
}
