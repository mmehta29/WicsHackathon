import { useState } from 'react'
import { useCamera } from './hooks/useCamera'
import CameraView from './components/CameraView'

export default function App() {
  const [mode, setMode] = useState('idle')
  const { videoRef, startCamera } = useCamera()

  async function handleStart() {
    await startCamera()
    setMode('navigating')
  }

  return (
    <div className="relative w-screen h-screen bg-black">

      <CameraView videoRef={videoRef} />

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

    </div>
  )
}