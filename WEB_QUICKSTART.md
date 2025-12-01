# Web Photo Studio - Quick Start

## 🚀 Running the App

1.  **Install Dependencies** (if you haven't already):
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npm run dev
    ```

3.  **Open on Mobile**:
    - Look for the "Network" URL in the terminal output (e.g., `http://192.168.1.x:3000`).
    - Enter that URL in Safari on your iPhone or Chrome on Android.
    - Ensure your phone and computer are on the same Wi-Fi.

## ✨ Features
- **Mobile-First Design**: Optimized for touch and small screens.
- **Filters**: Vivid, B&W, Warm, Cool, Dramatic.
- **Adjustments**: Brightness, Contrast, Saturation, Exposure, Warmth, Sharpness.
- **AI Tools**: Magic Enhance (requires API Key).
- **Offline Capable**: Works in the browser without installation.

## 🔑 AI Configuration
To enable AI features:
1.  Create a `.env` file in the root.
2.  Add your Gemini API Key:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```
