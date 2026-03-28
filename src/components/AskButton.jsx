export default function AskButton({ mode, onTap }) {
    const isListening = mode === 'listening'
    const isAnswering = mode === 'answering'
    const isNavigating = mode === 'navigating'

    if (!isNavigating && !isListening && !isAnswering) return null

    return (
        <div className="absolute bottom-10 left-0 right-0 
                      flex justify-center">
            <button
                onClick={onTap}
                disabled={isAnswering}
                className={`
            w-20 h-20 rounded-full font-medium text-sm
            transition-all active:scale-95
            ${isListening
                        ? 'bg-red-500 text-white scale-110'
                        : 'bg-white text-black'
                    }
            ${isAnswering ? 'opacity-50 cursor-not-allowed' : ''}
          `}
            >
                {isListening ? 'Stop' : 'Ask'}
            </button>
        </div>
    )
}