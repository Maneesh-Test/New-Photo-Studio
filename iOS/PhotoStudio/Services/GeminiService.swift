//
//  GeminiService.swift
//  PhotoStudio
//
//  Google Gemini API integration for advanced AI features
//

import UIKit
import Foundation

class GeminiService {
    private let apiKey: String
    private let baseURL = "https://generativelanguage.googleapis.com/v1beta"
    
    init(apiKey: String) {
        self.apiKey = apiKey
    }
    
    // Enhance image using Gemini
    func enhanceImage(_ image: UIImage, completion: @escaping (Result<UIImage, Error>) -> Void) {
        let prompt = "Enhance this photo to make it look professional. Improve lighting, colors, and overall quality while maintaining a natural look."
        processImageWithPrompt(image, prompt: prompt, completion: completion)
    }
    
    // Remove object from image
    func removeObject(_ image: UIImage, prompt: String, completion: @escaping (Result<UIImage, Error>) -> Void) {
        let fullPrompt = "Remove \(prompt) from this image and fill the area naturally to match the surrounding context."
        processImageWithPrompt(image, prompt: fullPrompt, completion: completion)
    }
    
    // Custom AI processing
    func processImageWithPrompt(_ image: UIImage, prompt: String, completion: @escaping (Result<UIImage, Error>) -> Void) {
        guard let imageData = image.jpegData(compressionQuality: 0.8) else {
            completion(.failure(GeminiError.invalidImage))
            return
        }
        
        let base64Image = imageData.base64EncodedString()
        
        let requestBody: [String: Any] = [
            "contents": [
                [
                    "parts": [
                        ["text": prompt],
                        [
                            "inline_data": [
                                "mime_type": "image/jpeg",
                                "data": base64Image
                            ]
                        ]
                    ]
                ]
            ],
            "generationConfig": [
                "temperature": 0.4,
                "topK": 32,
                "topP": 1,
                "maxOutputTokens": 4096
            ]
        ]
        
        guard let url = URL(string: "\(baseURL)/models/gemini-1.5-flash:generateContent?key=\(apiKey)") else {
            completion(.failure(GeminiError.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        } catch {
            completion(.failure(error))
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let data = data else {
                completion(.failure(GeminiError.noData))
                return
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let candidates = json["candidates"] as? [[String: Any]],
                   let firstCandidate = candidates.first,
                   let content = firstCandidate["content"] as? [String: Any],
                   let parts = content["parts"] as? [[String: Any]],
                   let firstPart = parts.first,
                   let inlineData = firstPart["inline_data"] as? [String: Any],
                   let imageDataString = inlineData["data"] as? String,
                   let imageData = Data(base64Encoded: imageDataString),
                   let resultImage = UIImage(data: imageData) {
                    completion(.success(resultImage))
                } else {
                    // If no image in response, return original with error
                    completion(.failure(GeminiError.invalidResponse))
                }
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

enum GeminiError: LocalizedError {
    case invalidImage
    case invalidURL
    case noData
    case invalidResponse
    case quotaExceeded
    
    var errorDescription: String? {
        switch self {
        case .invalidImage:
            return "Invalid image format"
        case .invalidURL:
            return "Invalid API URL"
        case .noData:
            return "No data received from API"
        case .invalidResponse:
            return "Invalid response from API. This feature requires image generation capabilities."
        case .quotaExceeded:
            return "API quota exceeded. Please check your Google Cloud billing settings."
        }
    }
}
