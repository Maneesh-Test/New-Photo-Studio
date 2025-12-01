//
//  ImageProcessor.swift
//  PhotoStudio
//
//  Core image processing using Core Image framework
//

import UIKit
import CoreImage
import CoreImage.CIFilterBuiltins

class ImageProcessor {
    private let context = CIContext(options: [.useSoftwareRenderer: false])
    
    // Apply all adjustments to an image
    func applyAdjustments(_ image: UIImage, adjustments: AdjustmentSettings) -> UIImage? {
        guard let ciImage = CIImage(image: image) else { return nil }
        
        var outputImage = ciImage
        
        // Brightness
        if adjustments.brightness != 0.0 {
            outputImage = applyBrightness(outputImage, value: adjustments.brightness)
        }
        
        // Contrast
        if adjustments.contrast != 1.0 {
            outputImage = applyContrast(outputImage, value: adjustments.contrast)
        }
        
        // Saturation
        if adjustments.saturation != 1.0 {
            outputImage = applySaturation(outputImage, value: adjustments.saturation)
        }
        
        // Exposure
        if adjustments.exposure != 0.0 {
            outputImage = applyExposure(outputImage, value: adjustments.exposure)
        }
        
        // Highlights and Shadows
        if adjustments.highlights != 0.0 || adjustments.shadows != 0.0 {
            outputImage = applyHighlightsShadows(outputImage, highlights: adjustments.highlights, shadows: adjustments.shadows)
        }
        
        // Temperature and Tint
        if adjustments.temperature != 0.0 || adjustments.tint != 0.0 {
            outputImage = applyTemperatureAndTint(outputImage, temperature: adjustments.temperature, tint: adjustments.tint)
        }
        
        // Sharpness
        if adjustments.sharpness != 0.0 {
            outputImage = applySharpness(outputImage, value: adjustments.sharpness)
        }
        
        // Vibrance
        if adjustments.vibrance != 0.0 {
            outputImage = applyVibrance(outputImage, value: adjustments.vibrance)
        }
        
        // Vignette
        if adjustments.vignette != 0.0 {
            outputImage = applyVignette(outputImage, intensity: adjustments.vignette)
        }
        
        // Grain
        if adjustments.grain != 0.0 {
            outputImage = applyGrain(outputImage, intensity: adjustments.grain)
        }
        
        return renderImage(outputImage)
    }
    
    // Apply filter preset
    func applyFilter(_ image: UIImage, preset: FilterPreset) -> UIImage? {
        guard let ciImage = CIImage(image: image) else { return nil }
        var outputImage = ciImage
        
        // Apply CI filters from preset
        for (filterName, parameters) in preset.ciFilters {
            if let filter = CIFilter(name: filterName) {
                filter.setValue(outputImage, forKey: kCIInputImageKey)
                for (key, value) in parameters {
                    filter.setValue(value, forKey: key)
                }
                if let result = filter.outputImage {
                    outputImage = result
                }
            }
        }
        
        // Apply adjustments from preset
        if let adjustedImage = applyAdjustments(renderImage(outputImage) ?? image, adjustments: preset.adjustments) {
            return adjustedImage
        }
        
        return renderImage(outputImage)
    }
    
    // MARK: - Individual Adjustments
    
    private func applyBrightness(_ image: CIImage, value: Double) -> CIImage {
        let filter = CIFilter.colorControls()
        filter.inputImage = image
        filter.brightness = Float(value)
        return filter.outputImage ?? image
    }
    
    private func applyContrast(_ image: CIImage, value: Double) -> CIImage {
        let filter = CIFilter.colorControls()
        filter.inputImage = image
        filter.contrast = Float(value)
        return filter.outputImage ?? image
    }
    
    private func applySaturation(_ image: CIImage, value: Double) -> CIImage {
        let filter = CIFilter.colorControls()
        filter.inputImage = image
        filter.saturation = Float(value)
        return filter.outputImage ?? image
    }
    
    private func applyExposure(_ image: CIImage, value: Double) -> CIImage {
        let filter = CIFilter.exposureAdjust()
        filter.inputImage = image
        filter.ev = Float(value)
        return filter.outputImage ?? image
    }
    
    private func applyHighlightsShadows(_ image: CIImage, highlights: Double, shadows: Double) -> CIImage {
        let filter = CIFilter.highlightShadowAdjust()
        filter.inputImage = image
        filter.highlightAmount = Float(1.0 - highlights)
        filter.shadowAmount = Float(1.0 + shadows)
        return filter.outputImage ?? image
    }
    
    private func applyTemperatureAndTint(_ image: CIImage, temperature: Double, tint: Double) -> CIImage {
        let filter = CIFilter.temperatureAndTint()
        filter.inputImage = image
        
        // Convert temperature (-1 to 1) to Kelvin (3000 to 9000)
        let kelvin = 6500 + (temperature * 2500)
        filter.neutral = CIVector(x: kelvin, y: 0)
        filter.targetNeutral = CIVector(x: kelvin, y: tint * 150)
        
        return filter.outputImage ?? image
    }
    
    private func applySharpness(_ image: CIImage, value: Double) -> CIImage {
        let filter = CIFilter.sharpenLuminance()
        filter.inputImage = image
        filter.sharpness = Float(value)
        return filter.outputImage ?? image
    }
    
    private func applyVibrance(_ image: CIImage, value: Double) -> CIImage {
        let filter = CIFilter.vibrance()
        filter.inputImage = image
        filter.amount = Float(value)
        return filter.outputImage ?? image
    }
    
    private func applyVignette(_ image: CIImage, intensity: Double) -> CIImage {
        let filter = CIFilter.vignette()
        filter.inputImage = image
        filter.intensity = Float(intensity * 2.0)
        filter.radius = Float(1.5)
        return filter.outputImage ?? image
    }
    
    private func applyGrain(_ image: CIImage, intensity: Double) -> CIImage {
        let filter = CIFilter(name: "CIRandomGenerator")!
        let noiseImage = filter.outputImage!
        
        let whitenVector = CIVector(x: 0, y: 1, z: 0, w: 0)
        let fineGrain = CIVector(x: 0, y: 0.005 * intensity, z: 0, w: 0)
        let zeroVector = CIVector(x: 0, y: 0, z: 0, w: 0)
        
        let colorMatrix = CIFilter(name: "CIColorMatrix", parameters: [
            kCIInputImageKey: noiseImage,
            "inputRVector": whitenVector,
            "inputGVector": whitenVector,
            "inputBVector": whitenVector,
            "inputAVector": fineGrain,
            "inputBiasVector": zeroVector
        ])!
        
        let grainImage = colorMatrix.outputImage!
        
        let compositeFilter = CIFilter(name: "CISourceOverCompositing", parameters: [
            kCIInputImageKey: grainImage,
            kCIInputBackgroundImageKey: image
        ])!
        
        return compositeFilter.outputImage ?? image
    }
    
    // MARK: - Crop and Rotate
    
    func cropImage(_ image: UIImage, to rect: CGRect, rotation: Double) -> UIImage? {
        guard let ciImage = CIImage(image: image) else { return nil }
        
        var outputImage = ciImage
        
        // Apply rotation
        if rotation != 0.0 {
            let radians = rotation * .pi / 180.0
            outputImage = outputImage.transformed(by: CGAffineTransform(rotationAngle: radians))
        }
        
        // Crop
        let croppedImage = outputImage.cropped(to: rect)
        
        return renderImage(croppedImage)
    }
    
    // MARK: - Rendering
    
    private func renderImage(_ ciImage: CIImage) -> UIImage? {
        guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else {
            return nil
        }
        return UIImage(cgImage: cgImage)
    }
}
