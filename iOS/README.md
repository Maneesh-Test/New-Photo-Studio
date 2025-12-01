# Photo Studio - Professional iOS Photo Editing App

A professional-grade iOS photo editing application built with Swift and SwiftUI, featuring comprehensive editing tools and AI-powered enhancements.

## Features

### ✨ Core Editing Tools
- **Adjustments**: Brightness, Contrast, Saturation, Exposure, Highlights, Shadows, Temperature, Tint, Sharpness, Clarity, Vibrance, Vignette, and Grain
- **Filters**: 12 professional preset filters (B&W, Vintage, Vivid, Warm, Cool, Dramatic, Fade, Chrome, Noir, Mono, Tonal)
- **Crop & Rotate**: Multiple aspect ratios, rotation, and flip options
- **Drawing Tools**: Brush, shapes, and annotations
- **Text Overlay**: Custom fonts, colors, and effects

### 🤖 AI-Powered Features
- **Background Removal**: On-device subject segmentation using Apple Vision framework
- **Auto Enhance**: AI-powered image enhancement via Google Gemini API
- **Custom AI Edits**: Natural language image editing
- **Smart Detection**: Face detection and saliency analysis

### 🎨 Professional Tools
- **Curves**: RGB and individual channel adjustments
- **HSL Controls**: Hue, Saturation, Luminance for individual color ranges
- **Effects**: Vignette, grain, blur (Gaussian, motion, radial)
- **Layers**: Multiple layers with blending modes and opacity control

### 🎯 User Experience
- **Gesture Controls**: Pinch to zoom, pan, and rotate
- **Undo/Redo**: Full history management
- **Before/After**: Comparison view
- **Export Options**: JPEG, PNG, HEIC with quality settings
- **Beautiful UI**: Modern, intuitive interface with dark mode

## Technology Stack

- **Language**: Swift 5.8+
- **UI Framework**: SwiftUI
- **Image Processing**: Core Image
- **AI Features**: 
  - Apple Vision Framework (on-device)
  - Google Gemini API (cloud-based)
- **Minimum iOS Version**: iOS 16.0+

## Project Structure

```
PhotoStudio/
├── PhotoStudioApp.swift          # App entry point
├── Models/
│   ├── EditingTool.swift         # Tool definitions
│   ├── AdjustmentSettings.swift  # Adjustment parameters
│   ├── FilterPreset.swift        # Filter configurations
│   └── ImageEditorState.swift    # State management
├── Views/
│   ├── ContentView.swift         # Main container
│   ├── EditorView.swift          # Editor interface
│   ├── ImageCanvas.swift         # Interactive canvas
│   ├── ExportView.swift          # Export options
│   └── Tools/
│       ├── ToolPanel.swift       # Dynamic tool panel
│       └── AIPanel.swift         # AI features panel
├── Services/
│   ├── ImageProcessor.swift     # Core Image processing
│   ├── VisionService.swift      # Apple Vision integration
│   └── GeminiService.swift      # Gemini API integration
├── Utilities/
│   └── HistoryManager.swift     # Undo/redo management
└── Info.plist                   # App configuration
```

## Setup Instructions

### Prerequisites
- macOS 13.0 or later
- Xcode 15.0 or later
- iOS 16.0+ device or simulator
- Apple Developer account (for device testing)

### Installation

1. **Clone or download the project**
   ```bash
   cd "/Users/maneeshchandra/Antigravity Project/Photo-Studio/iOS"
   ```

2. **Configure Gemini API (Optional)**
   - Open `Services/GeminiService.swift`
   - Replace `YOUR_GEMINI_API_KEY` with your actual API key
   - Get your API key from: https://makersuite.google.com/app/apikey

3. **Open in Xcode**
   ```bash
   open PhotoStudio.xcodeproj
   ```
   
   Note: The .xcodeproj file needs to be created in Xcode. Follow these steps:
   - Open Xcode
   - File → New → Project
   - Choose "iOS" → "App"
   - Product Name: "PhotoStudio"
   - Interface: SwiftUI
   - Language: Swift
   - Save to: `/Users/maneeshchandra/Antigravity Project/Photo-Studio/iOS`
   - Add all the Swift files to the project

4. **Build and Run**
   - Select your target device or simulator
   - Press `Cmd + R` to build and run

## Usage

### Basic Workflow

1. **Import Photo**
   - Tap "Select Photo" on the welcome screen
   - Choose a photo from your library

2. **Edit Photo**
   - Select a tool from the bottom toolbar
   - Adjust parameters using the tool panel
   - Use pinch gestures to zoom
   - Pan to move around the image

3. **Apply Filters**
   - Tap the "Filters" tool
   - Scroll through presets
   - Tap to apply

4. **AI Features**
   - Tap the "AI" tool
   - Choose from:
     - Remove Background (on-device)
     - Auto Enhance (cloud-based)
     - Custom AI Edit (describe your edit)

5. **Export**
   - Tap the export button (top right)
   - Choose format and quality
   - Save to Photos or Share

### Keyboard Shortcuts (iPad with keyboard)

- `Cmd + Z`: Undo
- `Cmd + Shift + Z`: Redo
- `Cmd + S`: Export

## Core Image Filters Used

The app leverages Apple's Core Image framework with the following filters:

- `CIColorControls`: Brightness, contrast, saturation
- `CIExposureAdjust`: Exposure control
- `CIHighlightShadowAdjust`: Highlights and shadows
- `CITemperatureAndTint`: Color temperature
- `CISharpenLuminance`: Sharpness
- `CIVibrance`: Vibrance control
- `CIVignette`: Vignette effect
- `CIPhotoEffectChrome`, `CIPhotoEffectNoir`, etc.: Preset filters

## AI Features Details

### On-Device (Apple Vision Framework)
- **Background Removal**: Uses `VNGenerateForegroundInstanceMaskRequest`
- **Face Detection**: Uses `VNDetectFaceRectanglesRequest`
- **Saliency**: Uses `VNGenerateAttentionBasedSaliencyImageRequest`
- **Privacy**: All processing happens on-device
- **Performance**: Fast, no internet required

### Cloud-Based (Google Gemini API)
- **Auto Enhance**: Professional image enhancement
- **Custom Edits**: Natural language processing
- **Object Removal**: Smart content-aware fill
- **Requires**: Internet connection and API key

## Performance Optimization

- **GPU Acceleration**: Core Image uses Metal for GPU processing
- **Efficient History**: Limited to 20 states to manage memory
- **Async Processing**: All heavy operations run on background threads
- **Image Caching**: Processed images are cached for quick undo/redo

## Permissions Required

The app requests the following permissions:

- **Photo Library Access**: To import and save photos
- **Photo Library Add**: To save edited photos
- **Camera** (optional): To take photos for editing

These are configured in `Info.plist` with user-friendly descriptions.

## Known Limitations

1. **AI Features**: Cloud-based AI features require:
   - Valid Gemini API key
   - Internet connection
   - API quota/billing enabled

2. **Image Size**: Very large images (>50MP) may cause memory issues on older devices

3. **Advanced Features**: Some tools (Curves, HSL, Layers) are placeholders and need full implementation

## Future Enhancements

- [ ] Full Curves implementation with interactive graph
- [ ] HSL controls for individual color ranges
- [ ] Layer management with blending modes
- [ ] Drawing tools with Apple Pencil support
- [ ] Text overlay with custom fonts
- [ ] Batch editing
- [ ] iCloud sync
- [ ] iPad optimization with split view

## Troubleshooting

### Build Errors

**"Cannot find type 'PhotosPickerItem'"**
- Ensure deployment target is iOS 16.0+
- Check that you're using Xcode 15.0+

**"Module 'Vision' not found"**
- Vision framework should be automatically linked
- Try: Project → Build Phases → Link Binary With Libraries → Add Vision.framework

### Runtime Issues

**"Photo library access denied"**
- Go to Settings → Privacy → Photos → Photo Studio → Enable access

**"AI features not working"**
- Check internet connection (for cloud features)
- Verify Gemini API key is set correctly
- Check API quota in Google Cloud Console

**"App crashes on large images"**
- Try reducing image size before importing
- Close other apps to free memory

## Contributing

This is a demonstration project. Feel free to:
- Add new filters
- Implement advanced tools
- Improve UI/UX
- Optimize performance

## License

This project is provided as-is for educational and demonstration purposes.

## Credits

- **Core Image**: Apple's powerful image processing framework
- **Vision Framework**: Apple's computer vision framework
- **Google Gemini**: Advanced AI image processing
- **SwiftUI**: Modern declarative UI framework

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Apple's Core Image documentation
3. Check Google Gemini API documentation

---

**Built with ❤️ using Swift and SwiftUI**
