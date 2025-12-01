//
//  VisionService.swift
//  PhotoStudio
//
//  Apple Vision framework integration for AI features
//

import UIKit
import Vision
import CoreImage

class VisionService {
    private let context = CIContext()
    
    // Remove background using subject segmentation
    func removeBackground(from image: UIImage, completion: @escaping (Result<UIImage, Error>) -> Void) {
        guard let cgImage = image.cgImage else {
            completion(.failure(VisionError.invalidImage))
            return
        }
        
        let request = VNGenerateForegroundInstanceMaskRequest { request, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let result = request.results?.first as? VNInstanceMaskObservation else {
                completion(.failure(VisionError.noSubjectFound))
                return
            }
            
            do {
                let maskedImage = try self.applyMask(result, to: image)
                completion(.success(maskedImage))
            } catch {
                completion(.failure(error))
            }
        }
        
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try handler.perform([request])
            } catch {
                completion(.failure(error))
            }
        }
    }
    
    // Apply mask to create transparent background
    private func applyMask(_ mask: VNInstanceMaskObservation, to image: UIImage) throws -> UIImage {
        guard let cgImage = image.cgImage else {
            throw VisionError.invalidImage
        }
        
        let maskPixelBuffer = mask.pixelBuffer
        let ciImage = CIImage(cgImage: cgImage)
        
        // Create mask image from pixel buffer
        let maskCIImage = CIImage(cvPixelBuffer: maskPixelBuffer)
        
        // Scale mask to match image size
        let scaleX = ciImage.extent.width / maskCIImage.extent.width
        let scaleY = ciImage.extent.height / maskCIImage.extent.height
        let scaledMask = maskCIImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))
        
        // Apply mask using blend mode
        let blendFilter = CIFilter.blendWithMask()
        blendFilter.inputImage = ciImage
        blendFilter.maskImage = scaledMask
        blendFilter.backgroundImage = CIImage.empty()
        
        guard let outputImage = blendFilter.outputImage,
              let outputCGImage = context.createCGImage(outputImage, from: outputImage.extent) else {
            throw VisionError.processingFailed
        }
        
        return UIImage(cgImage: outputCGImage)
    }
    
    // Detect faces for smart cropping
    func detectFaces(in image: UIImage, completion: @escaping (Result<[VNFaceObservation], Error>) -> Void) {
        guard let cgImage = image.cgImage else {
            completion(.failure(VisionError.invalidImage))
            return
        }
        
        let request = VNDetectFaceRectanglesRequest { request, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let results = request.results as? [VNFaceObservation] else {
                completion(.success([]))
                return
            }
            
            completion(.success(results))
        }
        
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try handler.perform([request])
            } catch {
                completion(.failure(error))
            }
        }
    }
    
    // Detect saliency (important regions)
    func detectSaliency(in image: UIImage, completion: @escaping (Result<VNSaliencyImageObservation, Error>) -> Void) {
        guard let cgImage = image.cgImage else {
            completion(.failure(VisionError.invalidImage))
            return
        }
        
        let request = VNGenerateAttentionBasedSaliencyImageRequest { request, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let result = request.results?.first as? VNSaliencyImageObservation else {
                completion(.failure(VisionError.processingFailed))
                return
            }
            
            completion(.success(result))
        }
        
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try handler.perform([request])
            } catch {
                completion(.failure(error))
            }
        }
    }
}

enum VisionError: LocalizedError {
    case invalidImage
    case noSubjectFound
    case processingFailed
    
    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return "Invalid image format"
        case .noSubjectFound:
            return "No subject found in image"
        case .processingFailed:
            return "Failed to process image"
        }
    }
}
