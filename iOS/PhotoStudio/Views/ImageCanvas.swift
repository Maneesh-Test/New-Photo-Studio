//
//  ImageCanvas.swift
//  PhotoStudio
//
//  Interactive image display with gesture controls
//

import SwiftUI

struct ImageCanvas: View {
    @ObservedObject var editorState: ImageEditorState
    @State private var currentZoom: CGFloat = 1.0
    @State private var currentOffset: CGSize = .zero
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background
                Color.black
                
                // Image
                if let image = editorState.processedImage ?? editorState.currentImage {
                    Image(uiImage: image)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .scaleEffect(editorState.zoomScale * currentZoom)
                        .offset(
                            x: editorState.offset.width + currentOffset.width,
                            y: editorState.offset.height + currentOffset.height
                        )
                        .gesture(
                            MagnificationGesture()
                                .onChanged { value in
                                    currentZoom = value
                                }
                                .onEnded { value in
                                    editorState.zoomScale *= value
                                    currentZoom = 1.0
                                }
                        )
                        .simultaneousGesture(
                            DragGesture()
                                .onChanged { value in
                                    currentOffset = value.translation
                                }
                                .onEnded { value in
                                    editorState.offset.width += value.translation.width
                                    editorState.offset.height += value.translation.height
                                    currentOffset = .zero
                                }
                        )
                }
                
                // Reset zoom button
                if editorState.zoomScale != 1.0 || editorState.offset != .zero {
                    VStack {
                        Spacer()
                        HStack {
                            Spacer()
                            Button(action: resetZoomAndPan) {
                                Image(systemName: "arrow.up.left.and.arrow.down.right")
                                    .font(.system(size: 16))
                                    .foregroundColor(.white)
                                    .padding(12)
                                    .background(Color.black.opacity(0.6))
                                    .clipShape(Circle())
                            }
                            .padding()
                        }
                    }
                }
            }
        }
    }
    
    private func resetZoomAndPan() {
        withAnimation(.spring()) {
            editorState.zoomScale = 1.0
            editorState.offset = .zero
            currentZoom = 1.0
            currentOffset = .zero
        }
    }
}

#Preview {
    ImageCanvas(editorState: ImageEditorState())
}
