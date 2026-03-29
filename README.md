# VoiceGuide

AI powered real time navigation assistant for visually impaired users

VoiceGuide is a camera based assistive application that helps blind and low vision users understand their surroundings through real time audio descriptions and interactive voice queries. The system captures visual input, processes it using AI, and delivers clear verbal feedback to improve situational awareness.

Overview

VoiceGuide provides two primary modes:

Continuous navigation assistance through automatic scene descriptions
Interactive querying through voice based questions about the environment

The application is designed to be lightweight, accessible, and usable directly through a web browser without requiring installation.

Features
Real Time Navigation Mode
Continuously captures frames from the camera
Generates real time scene descriptions
Provides periodic audio feedback about surroundings
Helps identify objects, obstacles, and spatial context
Starts automatically when the app is opened
Ask Mode
Allows users to ask questions using voice input
Processes speech into text and generates contextual responses
Answers questions based on the current camera view
Can be activated with a double tap anywhere on the screen
Audio System
Converts responses into natural sounding speech
Uses a queue system to prevent overlapping audio
Ensures clear and sequential delivery of alerts
Camera Integration
Uses live camera feed through browser APIs
Requires user permission for camera access
Works on both desktop and mobile browsers
Cross Platform Compatibility
Accessible via modern browsers
Optimized for mobile usage, including iOS devices
Live Demo

Deployed link:
https://wics-hackathon-kappa.vercel.app/

For best performance and full compatibility, it is recommended to open the application in Safari, especially on mobile devices.

Target Audience

VoiceGuide is designed for:

Individuals who are blind or visually impaired
Elderly users who require navigation assistance
Users with limited situational awareness
Accessibility focused organizations and researchers
Developers exploring assistive AI solutions
How to Use the App
Start Navigation

To begin navigation assistance, simply open the app. Once the app is running and camera access is granted, VoiceGuide starts providing navigation support automatically.

Stop Navigation

To stop navigation assistance, close the app.

Start Ask Mode

To activate Ask Mode, double tap anywhere on the screen. The app will say "listening" to indicate that it is ready to hear your question.

Stop Ask Mode and Get Response

Double tap again to stop recording. The app will then say "answering" and provide a spoken response based on your question and the current camera view.

Example Interaction
Open the app
Allow camera access
Hear automatic navigation guidance
Double tap anywhere on the screen to enter Ask Mode
Speak your question
Double tap again to stop recording
Hear the app respond with an answer
Tech Stack
Frontend: React with Vite
Styling: Tailwind CSS
AI Integration:
OpenAI Vision models for scene understanding
OpenAI Whisper for speech to text
OpenAI Text to Speech for audio output
Browser APIs:
MediaStream API for camera input
Web Audio API for audio playback
Setup Instructions
1. Clone the Repository
git clone https://github.com/mmehta29/WicsHackathon.git
cd WicsHackathon
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env.local file in the root directory:

VITE_OPENAI_API_KEY=your-api-key-here
VITE_OPENAI_NAVIGATE_MODEL=gpt-4o-mini
VITE_OPENAI_ASK_MODEL=gpt-4o
VITE_OPENAI_TTS_VOICE=nova
4. Run the Application
npm run dev
5. Access the App

Open the following URL in your browser:

http://localhost:5173
How It Works
The camera captures frames from the user's environment
Frames are processed by a vision model to generate descriptions
Text responses are converted into speech
Audio is delivered using a queue to avoid overlap

For Ask Mode:

User double taps the screen to begin recording
The app announces that it is listening
The user asks a question
The user double taps again to stop recording
The app announces that it is answering
The question is processed using speech to text and visual context
The response is converted to speech and played aloud
Future Improvements
Reduced latency for faster navigation alerts
Object detection with distance estimation
Indoor navigation support
Offline functionality
Integration with wearable devices
Team

Developed during the WiCS Hackathon by a team focused on accessibility and applied artificial intelligence.

Purpose

VoiceGuide aims to improve accessibility by enabling greater independence for visually impaired individuals through real time, AI driven assistance.
