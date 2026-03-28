import { useState } from 'react'

export default function App() {
  const [mode, setMode] = useState('idle')

  return (
    <div className="min-h-screen bg-black flex flex-col 
                    items-center justify-center gap-6 p-6">
      <h1 className="text-white text-3xl font-semibold">
        VoiceGuide
      </h1>
      <p className="text-gray-400 text-sm">
        Mode: {mode}
      </p>

      <button
        className="w-24 h-24 rounded-full bg-white 
                   text-black font-medium active:scale-95 
                   transition-transform"
        onClick={() => setMode('navigating')}
      >
        Start
      </button>
    </div>
  )
}