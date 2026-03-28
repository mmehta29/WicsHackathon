import { useRef, useState, useCallback, useEffect } from 'react';
import { textToSpeech } from '../services/openai';

/**
 * useTTS — plays OpenAI TTS audio via AudioContext (iOS-compatible).
 *
 * iOS blocks audio after any `await` unless the AudioContext was
 * created/resumed synchronously inside a direct user tap.
 *
 * Pattern:
 *   1. Call unlock() inside your Start/Enable button's onClick (synchronous).
 *   2. After that, speak() works even after async API calls.
 *
 * Errors are thrown so callers can display them — nothing is swallowed silently.
 */
export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const ctxRef = useRef(null);
  const sourceRef = useRef(null);
  const resolveRef = useRef(null);

  /** Call this synchronously inside a button onClick to unblock iOS audio. */
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

  /** Stop and resolve any currently playing audio. */
  const stop = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch (_) {}
      sourceRef.current = null;
    }
    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  /**
   * Fetch TTS audio and play it.
   * Returns a Promise that resolves when playback finishes (or is stopped).
   * Throws if the API call fails — callers should catch and display the error.
   */
  const speak = useCallback(async (text) => {
    stop();

    const ctx = ctxRef.current;
    if (!ctx) {
      throw new Error('Audio not unlocked yet — call unlock() on a button tap first.');
    }

    // Throws on API error (e.g. 429) — let it propagate to the caller
    const url = await textToSpeech(text);

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
  }, [stop]);

  useEffect(() => {
    return () => {
      try { ctxRef.current?.close(); } catch (_) {}
    };
  }, []);

  return { speak, stop, isSpeaking, isUnlocked, unlock };
}
