export default function StatusBanner({ mode }) {
    const config = {
        idle: { text: '', color: '' },
        navigating: { text: 'Navigating...', color: 'bg-black/40' },
        listening: { text: 'Listening...', color: 'bg-red-500/70' },
        answering: { text: 'Answering...', color: 'bg-blue-500/70' },
    }

    const { text, color } = config[mode] || config.idle

    if (!text) return null

    return (
        <div
            aria-live="polite"
            className={`absolute top-6 left-0 right-0 flex 
                    justify-center`}
        >
            <div className={`${color} text-white text-sm font-medium 
                         px-5 py-2 rounded-full`}>
                {text}
            </div>
        </div>
    )
}