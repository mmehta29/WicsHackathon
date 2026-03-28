import { useRef } from 'react'

export function useCamera() {
    const videoRef = useRef(null)

    async function startCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false
        })

        videoRef.current.srcObject = stream
    }

    return { videoRef, startCamera }
}