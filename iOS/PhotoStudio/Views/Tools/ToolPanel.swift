//
//  ToolPanel.swift
//  PhotoStudio
//
//  Dynamic tool panel that changes based on selected tool
//

import SwiftUI

struct ToolPanel: View {
    let tool: EditingTool
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        Group {
            switch tool {
            case .adjust:
                AdjustmentPanel(editorState: editorState)
            case .filters:
                FilterPanel(editorState: editorState)
            case .crop:
                CropPanel(editorState: editorState)
            case .draw:
                DrawingPanel(editorState: editorState)
            case .text:
                TextPanel(editorState: editorState)
            case .ai:
                AIPanel(editorState: editorState)
            case .curves:
                CurvesPanel(editorState: editorState)
            case .hsl:
                HSLPanel(editorState: editorState)
            case .effects:
                EffectsPanel(editorState: editorState)
            case .layers:
                LayersPanel(editorState: editorState)
            }
        }
    }
}

// MARK: - Adjustment Panel

struct AdjustmentPanel: View {
    @ObservedObject var editorState: ImageEditorState
    @State private var selectedParameter: AdjustmentParameter?
    
    var body: some View {
        VStack(spacing: 0) {
            // Parameter selection
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 15) {
                    ForEach(AdjustmentParameter.allParameters) { param in
                        ParameterButton(
                            parameter: param,
                            isSelected: selectedParameter?.id == param.id,
                            action: { selectedParameter = param }
                        )
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 12)
            }
            
            Divider()
                .background(Color.white.opacity(0.2))
            
            // Slider for selected parameter
            if let param = selectedParameter {
                VStack(spacing: 15) {
                    HStack {
                        Text(param.name)
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                        
                        Spacer()
                        
                        Text(String(format: "%.2f", editorState.adjustments[keyPath: param.keyPath]))
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.white.opacity(0.7))
                        
                        Button(action: {
                            editorState.adjustments[keyPath: param.keyPath] = param.defaultValue
                            applyAdjustments()
                        }) {
                            Image(systemName: "arrow.counterclockwise")
                                .font(.system(size: 14))
                                .foregroundColor(.white.opacity(0.7))
                        }
                    }
                    
                    Slider(
                        value: Binding(
                            get: { editorState.adjustments[keyPath: param.keyPath] },
                            set: { newValue in
                                editorState.adjustments[keyPath: param.keyPath] = newValue
                                applyAdjustments()
                            }
                        ),
                        in: param.min...param.max
                    )
                    .accentColor(Color(red: 0.6, green: 0.4, blue: 0.9))
                }
                .padding()
            } else {
                VStack {
                    Spacer()
                    Text("Select an adjustment")
                        .font(.system(size: 16))
                        .foregroundColor(.white.opacity(0.5))
                    Spacer()
                }
            }
            
            // Reset all button
            Button(action: resetAll) {
                Text("Reset All")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(red: 0.6, green: 0.4, blue: 0.9).opacity(0.3))
                    .cornerRadius(12)
            }
            .padding()
        }
    }
    
    private func applyAdjustments() {
        guard let image = editorState.currentImage else { return }
        
        editorState.isProcessing = true
        editorState.processingMessage = "Applying adjustments..."
        
        DispatchQueue.global(qos: .userInitiated).async {
            let processor = ImageProcessor()
            let result = processor.applyAdjustments(image, adjustments: editorState.adjustments)
            
            DispatchQueue.main.async {
                editorState.processedImage = result
                editorState.isProcessing = false
            }
        }
    }
    
    private func resetAll() {
        editorState.adjustments.reset()
        applyAdjustments()
    }
}

struct ParameterButton: View {
    let parameter: AdjustmentParameter
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: parameter.iconName)
                    .font(.system(size: 20))
                    .foregroundColor(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9) : .white)
                
                Text(parameter.name)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9) : .white.opacity(0.7))
            }
            .frame(width: 80)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: 10)
                    .fill(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9).opacity(0.2) : Color.clear)
            )
        }
    }
}

// MARK: - Filter Panel

struct FilterPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack(spacing: 15) {
            Text("Filters")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .padding(.top)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 15) {
                    ForEach(FilterPreset.allPresets) { preset in
                        FilterThumbnail(
                            preset: preset,
                            isSelected: editorState.selectedFilter?.id == preset.id,
                            image: editorState.currentImage,
                            action: {
                                applyFilter(preset)
                            }
                        )
                    }
                }
                .padding(.horizontal)
            }
            
            Spacer()
        }
    }
    
    private func applyFilter(_ preset: FilterPreset) {
        guard let image = editorState.currentImage else { return }
        
        editorState.selectedFilter = preset
        editorState.isProcessing = true
        editorState.processingMessage = "Applying filter..."
        
        DispatchQueue.global(qos: .userInitiated).async {
            let processor = ImageProcessor()
            let result = processor.applyFilter(image, preset: preset)
            
            DispatchQueue.main.async {
                editorState.processedImage = result
                editorState.adjustments = preset.adjustments
                editorState.isProcessing = false
            }
        }
    }
}

struct FilterThumbnail: View {
    let preset: FilterPreset
    let isSelected: Bool
    let image: UIImage?
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                // Thumbnail preview
                if let image = image {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 80, height: 80)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9) : Color.clear, lineWidth: 3)
                        )
                } else {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.gray.opacity(0.3))
                        .frame(width: 80, height: 80)
                }
                
                Text(preset.name)
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(isSelected ? Color(red: 0.6, green: 0.4, blue: 0.9) : .white)
            }
        }
    }
}

// MARK: - Placeholder Panels

struct CropPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack {
            Text("Crop & Rotate")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text("Coming soon")
                .foregroundColor(.white.opacity(0.5))
        }
    }
}

struct DrawingPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack {
            Text("Drawing Tools")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text("Coming soon")
                .foregroundColor(.white.opacity(0.5))
        }
    }
}

struct TextPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack {
            Text("Text Overlay")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text("Coming soon")
                .foregroundColor(.white.opacity(0.5))
        }
    }
}

struct CurvesPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack {
            Text("Curves")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text("Coming soon")
                .foregroundColor(.white.opacity(0.5))
        }
    }
}

struct HSLPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack {
            Text("HSL Controls")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text("Coming soon")
                .foregroundColor(.white.opacity(0.5))
        }
    }
}

struct EffectsPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack {
            Text("Effects")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text("Coming soon")
                .foregroundColor(.white.opacity(0.5))
        }
    }
}

struct LayersPanel: View {
    @ObservedObject var editorState: ImageEditorState
    
    var body: some View {
        VStack {
            Text("Layers")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
            
            Text("Coming soon")
                .foregroundColor(.white.opacity(0.5))
        }
    }
}

#Preview {
    ToolPanel(tool: .adjust, editorState: ImageEditorState())
        .background(Color.black)
}
