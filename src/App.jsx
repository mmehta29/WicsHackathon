import { useState, useRef } from 'react'
import { useCamera } from './hooks/useCamera'
import { useVisionAI } from './hooks/useVisionAI'
import { useTTS } from './hooks/useTTS'
import CameraView from './components/CameraView'
import StatusBanner from './components/StatusBanner'
import AskButton from './components/AskButton'
export default function App() {
  const [mode, setMode] = useState('idle')
  const { videoRef, canvasRef, startCamera, startLoop, stopLoop } = useCamera()
  const { analyzeFrame } = useVisionAI()
  const { speak, stop, unlock } = useTTS()
  const isSpeakingRef = useRef(false)

  function handleAskTap() {
    console.log('Ask tapped — mode:', mode)
  }

  async function handleStart() {
    unlock()
    await startCamera()
    setMode('navigating')

    startLoop(async (frame) => {
      if (isSpeakingRef.current) return

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