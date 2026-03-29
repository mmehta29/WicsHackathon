import { useRef, useState, useCallback, useEffect } from 'react';
import { textToSpeech } from '../services/openai';

/**
 * useTTS — two voices optimised for their use case:
 *
 * navigate mode → speakNavigate(text)
 *   Uses browser speechSynthesis: zero network delay, speaks the instant
 *   GPT responds. Slightly robotic voice but timing accuracy matters more.
 *
 * ask mode → speak(text)
 *   Uses OpenAI TTS (Nova voice) via AudioContext: higher quality, natural
 *   voice for longer answers where a small delay is acceptable.
 *
 * Both respect the same clash/interrupt rules:
 *   speak(text)                  — skips if already speaking
 *   speak(text, { urgent:true }) — interrupts immediately (obstacles)
 *   stop()                       — cuts any audio mid-sentence
 *
 * iOS note: call unlock() synchronously inside your Start button onClick
 * before any async work — this unblocks AudioContext for OpenAI TTS.
 * Browser speechSynthesis does NOT need unlocking.
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // OpenAI TTS (Ask mode)
  const ctxRef = useRef(null);
  const sourceRef = useRef(null);
  const resolveRef = useRef(null);

  // ── unlock AudioContext for OpenAI TTS (call on Start button tap) ─────────
  const unlock = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || /** @type {any} */ (window).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    setIsUnlocked(true);
  }, []);

  // ── stop any currently playing audio (works for both engines) ────────────
  const stop = useCallback(() => {
    // stop OpenAI TTS
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (_) {}
      sourceRef.current = null;
    }
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    // stop browser speechSynthesis
    window.speechSynthesis.cancel();

    setIsSpeaking(false);
  }, []);

  // ── Navigate: browser speechSynthesis (instant, no API call) ─────────────
  /**
   * @param {string} text
   * @param {{ urgent?: boolean }} options
   */
  const speakNavigate = useCallback((text, { urgent = false } = {}) => {
    if (isSpeaking && !urgent) return; // non-urgent: drop if busy

    window.speechSynthesis.cancel(); // clear any queued utterances
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;   // slightly faster for navigation
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSpeaking]);

  // ── Ask: OpenAI TTS Nova (quality voice for longer answers) ──────────────
  /**
   * @param {string} text
   * @param {{ urgent?: boolean }} options
   */
  const speak = useCallback(async (text, { urgent = false } = {}) => {
    const ctx = ctxRef.current;
    if (!ctx) {
      throw new Error('Audio not unlocked yet — call unlock() on a button tap first.');
    }

    if (isSpeaking && !urgent) return;
    if (urgent) stop();

    const url = await textToSpeech(text); // throws on API error (e.g. 429)

    try {
      const arrayBuffer = await fetch(url).then(r => r.arrayBuffer());
      URL.revokeObjectURL(url);

      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      await new Promise((resolve) => {
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        resolveRef.current = resolve;
        sourceRef.current = source;

        source.onended = () => {
          setIsSpeaking(false);
          sourceRef.current = null;
          resolveRef.current = null;
          resolve();
        };

        setIsSpeaking(true);
        source.start(0);
      });
    } catch (err) {
      try { URL.revokeObjectURL(url); } catch (_) {}
      setIsSpeaking(false);
      throw err;
    }
  }, [stop, isSpeaking]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      try { ctxRef.current?.close(); } catch (_) {}
    };
  }, []);

  return { speak, speakNavigate, stop, isSpeaking, isUnlocked, unlock };
}
