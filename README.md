# VoiceGuide

AI-powered real-time navigation assistant for visually impaired users.

VoiceGuide is a camera-based assistive application that helps blind and low-vision users understand their surroundings through real-time audio descriptions and interactive voice queries. The system captures visual input, processes it using AI, and delivers clear verbal feedback to improve situational awareness.

---

## Overview

VoiceGuide provides two primary modes:

- Continuous navigation assistance through automatic scene descriptions
- Interactive querying through voice-based questions about the environment

The application is designed to be lightweight, accessible, and usable directly through a web browser without requiring installation.

**Live demo:** https://wics-hackathon-kappa.vercel.app/

*For best performance, open in Safari on mobile devices.*

---

## Features

**Real-Time Navigation Mode**
- Continuously captures frames from the camera
- Generates real-time scene descriptions
- Provides periodic audio feedback about surroundings
- Helps identify objects, obstacles, and spatial context
- Starts automatically when the app is opened

**Ask Mode**
- Allows users to ask questions using voice input
- Processes speech into text and generates contextual responses
- Answers questions based on the current camera view
- Activated with a double tap anywhere on the screen

**Audio System**
- Converts responses into natural-sounding speech
- Uses a queue system to prevent overlapping audio
- Ensures clear and sequential delivery of alerts

**Camera Integration**
- Uses live camera feed through browser APIs
- Requires user permission for camera access
- Works on both desktop and mobile browsers

**Cross-Platform Compatibility**
- Accessible via modern browsers
- Optimized for mobile usage, including iOS devices

---

## Target Audience

- Individuals who are blind or visually impaired
- Elderly users who require navigation assistance
- Users with limited situational awareness
- Accessibility-focused organizations and researchers
- Developers exploring assistive AI solutions

---

## How to Use

**Start navigation**
Open the app. Once camera access is granted, VoiceGuide starts providing navigation support automatically.

**Stop navigation**
Close the app.

**Start Ask Mode**
Double tap anywhere on the screen. The app will say "Listening" to indicate it is ready to hear your question.

**Stop Ask Mode and get response**
Double tap again to stop recording. The app will say "Answering" and provide a spoken response based on your question and the current camera view.

**Example interaction**
1. Open the app
2. Allow camera access
3. Hear automatic navigation guidance
4. Double tap anywhere to enter Ask Mode
5. Speak your question
6. Double tap again to stop recording
7. Hear the app respond with an answer

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Vision AI | OpenAI Vision models |
| Speech to text | OpenAI Whisper |
| Text to speech | OpenAI TTS |
| Camera | MediaStream API |
| Audio | Web Audio API |

---

## Setup

**1. Clone the repository**
```bash
git clone https://github.com/mmehta29/WicsHackathon.git
cd WicsHackathon
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**

Create a `.env.local` file in the root directory:
```
VITE_OPENAI_API_KEY=your-api-key-here
VITE_OPENAI_NAVIGATE_MODEL=gpt-4o-mini
VITE_OPENAI_ASK_MODEL=gpt-4o
VITE_OPENAI_TTS_VOICE=nova
```

**4. Run the application**
```bash
npm run dev
```

**5. Access the app**

Open `https://wics-hackathon-kappa.vercel.app/`

---

## How It Works

1. The camera captures frames from the user's environment
2. Frames are processed by a vision model to generate descriptions
3. Text responses are converted into speech
4. Audio is delivered using a queue to avoid overlap

**For Ask Mode:**
1. User double taps the screen to begin recording
2. The app announces it is listening
3. The user asks a question
4. The user double taps again to stop recording
5. The app announces it is answering
6. The question is processed using speech to text and visual context
7. The response is converted to speech and played aloud

---

## Future Improvements

- Reduced latency for faster navigation alerts
- Object detection with distance estimation
- Indoor navigation support
- Offline functionality
- Integration with wearable devices

---

## Team

Developed during the WiCS Hackathon by a team focused on accessibility and applied artificial intelligence.

---

## Purpose

VoiceGuide aims to improve accessibility by enabling greater independence for visually impaired individuals through real-time, AI-driven assistance.
