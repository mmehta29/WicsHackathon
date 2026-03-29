import { useState, useRef, useEffect } from 'react'
import { useCamera } from './hooks/useCamera'
import { useVisionAI } from './hooks/useVisionAI'
import { useTTS } from './hooks/useTTS'
import { useSTT } from './hooks/useSTT'
import CameraView from './components/CameraView'
import StatusBanner from './components/StatusBanner'

export default function App() {
  const [mode, setMode] = useState('idle')
  const [error, setError] = useState(null)
  const { videoRef, canvasRef, startCamera, startLoop, captureFrame } = useCamera()
  const { analyzeFrame } = useVisionAI()
  const { speak, stop, unlock } = useTTS()
  const { startRecording, stopRecording, transcript, isTranscribing } = useSTT()

  const isSpeakingRef = useRef(false)
  const isAskingRef = useRef(false)
  const lastTapRef = useRef(0)
  const DOUBLE_TAP_DELAY = 300

  // detect double tap anywhere on screen
  function handleScreenTap() {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current
    lastTapRef.current = now

    if (timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // double tap detected
      handleDoubleTap()
    } else if (mode === 'idle') {
      // single tap on idle — start the app
      handleStart()
    }
  }

  async function handleStart() {
    try {
      unlock()
      await startCamera()
      setMode('navigating')
      await speak('VoiceGuide started. Navigating.')

      startLoop(async (frame) => {
        if (isSpeakingRef.current || isAskingRef.current) return

        const result = await analyzeFrame(frame, 'navigate')

        if (result.isClear) return

        if (result.isAlert) {
          stop()
          isSpeakingRef.current = true
          try {
            await speak(result.text)
          } finally {
            isSpeakingRef.current = false
          }
          return
        }

        isSpeakingRef.current = true
        speak(result.text).finally(() => {
          isSpeakingRef.current = false
        })
      })
    } catch (err) {
      setError('Camera access denied. Please allow camera and try again.')
    }
  }

  async function handleDoubleTap() {
    // if idle — ignore double tap
    if (mode === 'idle') return

    // if navigating — start Ask
    if (mode === 'navigating') {
      isAskingRef.current = true
      stop()
      setMode('listening')
      await speak('Listening')
      try {
        await startRecording()
      } catch (err) {
        await speak('Microphone access denied.')
        setMode('navigating')
        isAskingRef.current = false
      }
      return
    }

    // if listening — stop recording
    if (mode === 'listening') {
      stopRecording()
    }
  }

  // watch for transcript after recording stops
  useEffect(() => {
    if (!isTranscribing && transcript && mode === 'listening') {
      handleAnswer(transcript)
    }
  }, [transcript, isTranscribing])

  async function handleAnswer(question) {
    setMode('answering')
    await speak('Got it, finding answer.')

    try {
      const frame = captureFrame()
      if (!frame) throw new Error('No frame available')

      const result = await analyzeFrame(frame, 'ask', question)

      isSpeakingRef.current = true
      await speak(result.text)

    } catch (err) {
      console.error('Answer error:', err)
      await speak('Sorry, could not get an answer. Try again.')
    } finally {
      isSpeakingRef.current = false
      isAskingRef.current = false
      setMode('navigating')
      speak('Resuming navigation.')
    }
  }

  return (
    <div
      className="relative w-screen h-screen bg-black"
      onClick={handleScreenTap}
    >
      <CameraView videoRef={videoRef} canvasRef={canvasRef} />
      <StatusBanner mode={mode} />

      {mode === 'idle' && (
        <div className="absolute inset-0 flex flex-col 
                        items-center justify-center gap-6 p-8">
          {error && (
            <div className="bg-red-500/80 text-white text-sm 
                            px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}
          <p className="text-white text-xl font-medium 
                        text-center">
            Tap anywhere to start
          </p>
          <p className="text-white/50 text-sm text-center">
            Double tap to ask a question
          </p>
        </div>
      )}
    </div>
  )
}