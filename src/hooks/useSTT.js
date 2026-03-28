import { useState, useRef } from 'react'
import { transcribeAudio } from '../utils/api'

export function useSTT() {
  const [isRecording, setIsRecording]       = useState(false)
  const [transcript, setTranscript]         = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError]                   = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef   = useRef([])

  const startRecording = async () => {
    setError(null)
    setTranscript('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mimeType = MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        setIsTranscribing(true)
        try {
          const text = await transcribeAudio(audioBlob)
          setTranscript(text)
        } catch (err) {
          setError('Could not transcribe. Please try again.')
        } finally {
          setIsTranscribing(false)
        }
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(100)
      setIsRecording(true)

    } catch (err) {
      setError('Microphone access denied. Please allow mic access and try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return { isRecording, transcript, isTranscribing, error, startRecording, stopRecording }
}
