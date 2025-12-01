//
//  ContentView.swift
//  PhotoStudio
//
//  Main container view with navigation
//

import SwiftUI
import PhotosUI

struct ContentView: View {
    @StateObject private var editorState = ImageEditorState()
    @State private var selectedItem: PhotosPickerItem?
    
    var body: some View {
        NavigationView {
            VStack {
                if editorState.currentImage == nil {
                    // Welcome screen
                    WelcomeView(editorState: editorState)
                } else {
                    // Editor view
                    EditorView(editorState: editorState)
                }
            }
            .navigationBarHidden(true)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
}

struct WelcomeView: View {
    @ObservedObject var editorState: ImageEditorState
    @State private var selectedItem: PhotosPickerItem?
    
    var body: some View {
        ZStack {
            // Gradient background
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.1, green: 0.1, blue: 0.2),
                    Color(red: 0.2, green: 0.1, blue: 0.3)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack(spacing: 40) {
                Spacer()
                
                // App icon and title
                VStack(spacing: 20) {
                    Image(systemName: "photo.on.rectangle.angled")
                        .font(.system(size: 80))
                        .foregroundColor(.white)
                    
                    Text("Photo Studio")
                        .font(.system(size: 42, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text("Professional Photo Editing")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundColor(.white.opacity(0.8))
                }
                
                Spacer()
                
                // Import button
                PhotosPicker(selection: $selectedItem, matching: .images) {
                    HStack {
                        Image(systemName: "photo.on.rectangle")
                        Text("Select Photo")
                            .fontWeight(.semibold)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        LinearGradient(
                            gradient: Gradient(colors: [
                                Color(red: 0.4, green: 0.3, blue: 0.8),
                                Color(red: 0.6, green: 0.3, blue: 0.9)
                            ]),
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .foregroundColor(.white)
                    .cornerRadius(15)
                    .shadow(color: Color(red: 0.5, green: 0.3, blue: 0.9).opacity(0.5), radius: 20, x: 0, y: 10)
                }
                .padding(.horizontal, 40)
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
                
                // Features list
                VStack(alignment: .leading, spacing: 15) {
                    FeatureRow(icon: "slider.horizontal.3", text: "Professional Adjustments")
                    FeatureRow(icon: "camera.filters", text: "Beautiful Filters")
                    FeatureRow(icon: "sparkles", text: "AI-Powered Features")
                    FeatureRow(icon: "paintbrush", text: "Drawing & Text Tools")
                }
                .padding(.horizontal, 40)
                .padding(.top, 20)
                
                Spacer()
            }
        }
    }
}

struct FeatureRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 15) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundColor(Color(red: 0.6, green: 0.4, blue: 0.9))
                .frame(width: 30)
            
            Text(text)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.white.opacity(0.9))
        }
    }
}

#Preview {
    ContentView()
}
