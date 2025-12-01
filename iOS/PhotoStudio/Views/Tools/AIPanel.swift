//
//  AIPanel.swift
//  PhotoStudio
//
//  AI-powered features panel
//

import SwiftUI

struct AIPanel: View {
    @ObservedObject var editorState: ImageEditorState
    @State private var customPrompt = ""
    @State private var showingCustomPrompt = false
    
    // You'll need to add your Gemini API key here or load from config
    private let geminiService = GeminiService(apiKey: "YOUR_GEMINI_API_KEY")
    private let visionService = VisionService()
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text("AI Features")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .padding(.top)
                
                // AI feature buttons
                VStack(spacing: 12) {
                    AIFeatureButton(
                        icon: "person.crop.circle.badge.minus",
                        title: "Remove Background",
                        subtitle: "On-device processing",
                        action: removeBackground
                    )
                    
                    AIFeatureButton(
                        icon: "sparkles",
                        title: "Auto Enhance",
                        subtitle: "AI-powered enhancement",
                        action: autoEnhance
                    )
                    
                    AIFeatureButton(
                        icon: "wand.and.stars",
                        title: "Custom AI Edit",
                        subtitle: "Describe what you want",
                        action: { showingCustomPrompt = true }
                    )
                }
                .padding(.horizontal)
                
                if let error = editorState.aiError {
                    Text(error)
                        .font(.system(size: 14))
                        .foregroundColor(.red)
                        .padding()
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(8)
                        .padding(.horizontal)
                }
            }
        }
        .sheet(isPresented: $showingCustomPrompt) {
            CustomPromptView(
                prompt: $customPrompt,
                onSubmit: {
                    showingCustomPrompt = false
                    processCustomPrompt()
                }
            )
        }
    }
    
    private func removeBackground() {
        guard let image = editorState.processedImage ?? editorState.currentImage else { return }
        
        editorState.isProcessing = true
        editorState.processingMessage = "Removing background..."
        editorState.aiError = nil
        
        visionService.removeBackground(from: image) { result in
            DispatchQueue.main.async {
                editorState.isProcessing = false
                
                switch result {
                case .success(let processedImage):
                    editorState.processedImage = processedImage
                    editorState.saveToHistory()
                case .failure(let error):
                    editorState.aiError = error.localizedDescription
                }
            }
        }
    }
    
    private func autoEnhance() {
        guard let image = editorState.processedImage ?? editorState.currentImage else { return }
        
        editorState.isProcessing = true
        editorState.processingMessage = "Enhancing image..."
        editorState.aiError = nil
        
        geminiService.enhanceImage(image) { result in
            DispatchQueue.main.async {
                editorState.isProcessing = false
                
                switch result {
                case .success(let processedImage):
                    editorState.processedImage = processedImage
                    editorState.saveToHistory()
                case .failure(let error):
                    editorState.aiError = error.localizedDescription
                }
            }
        }
    }
    
    private func processCustomPrompt() {
        guard let image = editorState.processedImage ?? editorState.currentImage,
              !customPrompt.isEmpty else { return }
        
        editorState.isProcessing = true
        editorState.processingMessage = "Processing..."
        editorState.aiError = nil
        
        geminiService.processImageWithPrompt(image, prompt: customPrompt) { result in
            DispatchQueue.main.async {
                editorState.isProcessing = false
                
                switch result {
                case .success(let processedImage):
                    editorState.processedImage = processedImage
                    editorState.saveToHistory()
                    customPrompt = ""
                case .failure(let error):
                    editorState.aiError = error.localizedDescription
                }
            }
        }
    }
}

struct AIFeatureButton: View {
    let icon: String
    let title: String
    let subtitle: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 15) {
                Image(systemName: icon)
                    .font(.system(size: 28))
                    .foregroundColor(Color(red: 0.6, green: 0.4, blue: 0.9))
                    .frame(width: 50)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                    
                    Text(subtitle)
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.6))
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.4))
            }
            .padding()
            .background(Color(white: 0.15))
            .cornerRadius(12)
        }
    }
}

struct CustomPromptView: View {
    @Binding var prompt: String
    let onSubmit: () -> Void
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Describe what you want to do with your image")
                    .font(.system(size: 16))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding()
                
                TextEditor(text: $prompt)
                    .frame(height: 150)
                    .padding(8)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
                    .padding(.horizontal)
                
                Text("Examples: \"Make the sky more dramatic\", \"Add warm sunset tones\", \"Remove the person in the background\"")
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                
                Spacer()
                
                Button(action: onSubmit) {
                    Text("Apply")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(red: 0.6, green: 0.4, blue: 0.9))
                        .cornerRadius(12)
                }
                .padding(.horizontal)
                .disabled(prompt.isEmpty)
            }
            .navigationTitle("Custom AI Edit")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    AIPanel(editorState: ImageEditorState())
        .background(Color.black)
}
