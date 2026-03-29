import { useState, useRef, useEffect } from 'react'
import { useCamera } from './hooks/useCamera'
import { useVisionAI } from './hooks/useVisionAI'
import { useTTS } from './hooks/useTTS'
import { useSTT } from './hooks/useSTT'
import CameraView from './components/CameraView'
import StatusBanner from './components/StatusBanner'
import AskButton from './components/AskButton'

export default function App() {
  const [mode, setMode] = useState('idle')
  const { videoRef, canvasRef, startCamera, startLoop, stopLoop, captureFrame } = useCamera()
  const { analyzeFrame } = useVisionAI()
  const { speak, speakNavigate, stop, unlock } = useTTS()
  const { startRecording, stopRecording, transcript, isTranscribing } = useSTT()

  const isSpeakingRef = useRef(false)
  const isAskingRef = useRef(false)

  async function handleStart() {
    unlock()
    await startCamera()
    setMode('navigating')

    startLoop(async (frame) => {
      // skip if asking or browser is currently speaking
      if (window.speechSynthesis.speaking || isAskingRef.current) return

      const result = await analyzeFrame(frame, 'navigate')

      if (result.isClear) return

      if (result.isAlert) {
        speakNavigate(result.text, { urgent: true })
        return
      }

      speakNavigate(result.text)
    })
  }

  async function handleAskTap() {
    // if currently listening — stop recording
    if (mode === 'listening') {
      stopRecording()
      return
    }

    // if navigating — start asking
    if (mode === 'navigating') {
      isAskingRef.current = true
      stop() // stop any current navigation audio
      setMode('listening')

      try {
        await startRecording()
      } catch (err) {
        console.error('Mic error:', err)
        setMode('navigating')
        isAskingRef.current = false
      }
    }
  }

  // watch for transcript to be ready after recording stops
  useEffect(() => {
    if (!isTranscribing && transcript && mode === 'listening') {
      handleAnswer(transcript)
    }
  }, [transcript, isTranscribing])

  async function handleAnswer(question) {
    setMode('answering')

    try {
      // capture current frame
      const frame = captureFrame()
      if (!frame) throw new Error('No frame available')

      // get answer from GPT-4o
      const result = await analyzeFrame(frame, 'ask', question)

      // speak the answer
      isSpeakingRef.current = true
      await speak(result.text)

    } catch (err) {
      console.error('Answer error:', err)
    } finally {
      isSpeakingRef.current = false
      isAskingRef.current = false
      setMode('navigating')
    }
  }

  return (
    <div className="relative w-screen h-screen bg-black">
      <CameraView videoRef={videoRef} canvasRef={canvasRef} />
      <StatusBanner mode={mode} />

      {mode === 'idle' && (
        <div className="absolute inset-0 flex items-center 
                        justify-center">
          <button
            onClick={handleStart}
            className="w-24 h-24 rounded-full bg-white 
                       text-black font-medium active:scale-95 
                       transition-transform"
          >
            Start
          </button>
        </div>
      )}

      <AskButton mode={mode} onTap={handleAskTap} />
    </div>
  )
}