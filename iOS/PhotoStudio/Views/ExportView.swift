//
//  ExportView.swift
//  PhotoStudio
//
//  Export options sheet
//

import SwiftUI
import Photos

struct ExportView: View {
    @ObservedObject var editorState: ImageEditorState
    @Environment(\.dismiss) var dismiss
    @State private var selectedQuality: ExportQuality = .high
    @State private var selectedFormat: ExportFormat = .jpeg
    @State private var showingSaveSuccess = false
    @State private var saveError: String?
    
    var body: some View {
        NavigationView {
            List {
                Section("Format") {
                    ForEach(ExportFormat.allCases) { format in
                        Button(action: { selectedFormat = format }) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(format.rawValue)
                                        .foregroundColor(.primary)
                                    Text(format.description)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                Spacer()
                                if selectedFormat == format {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(Color(red: 0.6, green: 0.4, blue: 0.9))
                                }
                            }
                        }
                    }
                }
                
                Section("Quality") {
                    ForEach(ExportQuality.allCases) { quality in
                        Button(action: { selectedQuality = quality }) {
                            HStack {
                                Text(quality.rawValue)
                                    .foregroundColor(.primary)
                                Spacer()
                                if selectedQuality == quality {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(Color(red: 0.6, green: 0.4, blue: 0.9))
                                }
                            }
                        }
                    }
                }
                
                Section {
                    Button(action: saveToPhotos) {
                        HStack {
                            Spacer()
                            Image(systemName: "square.and.arrow.down")
                            Text("Save to Photos")
                                .fontWeight(.semibold)
                            Spacer()
                        }
                        .foregroundColor(Color(red: 0.6, green: 0.4, blue: 0.9))
                    }
                    
                    Button(action: shareImage) {
                        HStack {
                            Spacer()
                            Image(systemName: "square.and.arrow.up")
                            Text("Share")
                                .fontWeight(.semibold)
                            Spacer()
                        }
                        .foregroundColor(Color(red: 0.6, green: 0.4, blue: 0.9))
                    }
                }
                
                if let error = saveError {
                    Section {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("Export")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .alert("Saved!", isPresented: $showingSaveSuccess) {
                Button("OK", role: .cancel) {
                    dismiss()
                }
            } message: {
                Text("Image saved to Photos")
            }
        }
    }
    
    private func saveToPhotos() {
        guard let image = editorState.processedImage ?? editorState.currentImage else { return }
        
        PHPhotoLibrary.requestAuthorization { status in
            guard status == .authorized else {
                DispatchQueue.main.async {
                    saveError = "Photo library access denied"
                }
                return
            }
            
            let imageData: Data?
            switch selectedFormat {
            case .jpeg:
                imageData = image.jpegData(compressionQuality: selectedQuality.compressionQuality)
            case .png:
                imageData = image.pngData()
            case .heic:
                imageData = image.jpegData(compressionQuality: selectedQuality.compressionQuality)
            }
            
            guard let data = imageData else {
                DispatchQueue.main.async {
                    saveError = "Failed to prepare image"
                }
                return
            }
            
            PHPhotoLibrary.shared().performChanges {
                let creationRequest = PHAssetCreationRequest.forAsset()
                creationRequest.addResource(with: .photo, data: data, options: nil)
            } completionHandler: { success, error in
                DispatchQueue.main.async {
                    if success {
                        showingSaveSuccess = true
                        saveError = nil
                    } else {
                        saveError = error?.localizedDescription ?? "Failed to save image"
                    }
                }
            }
        }
    }
    
    private func shareImage() {
        guard let image = editorState.processedImage ?? editorState.currentImage else { return }
        
        let activityVC = UIActivityViewController(
            activityItems: [image],
            applicationActivities: nil
        )
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let window = windowScene.windows.first,
           let rootVC = window.rootViewController {
            rootVC.present(activityVC, animated: true)
        }
    }
}

enum ExportFormat: String, CaseIterable, Identifiable {
    case jpeg = "JPEG"
    case png = "PNG"
    case heic = "HEIC"
    
    var id: String { rawValue }
    
    var description: String {
        switch self {
        case .jpeg: return "Best for photos, smaller file size"
        case .png: return "Lossless, supports transparency"
        case .heic: return "High quality, efficient compression"
        }
    }
}

enum ExportQuality: String, CaseIterable, Identifiable {
    case low = "Low"
    case medium = "Medium"
    case high = "High"
    case maximum = "Maximum"
    
    var id: String { rawValue }
    
    var compressionQuality: CGFloat {
        switch self {
        case .low: return 0.5
        case .medium: return 0.7
        case .high: return 0.85
        case .maximum: return 1.0
        }
    }
}

#Preview {
    ExportView(editorState: ImageEditorState())
}
