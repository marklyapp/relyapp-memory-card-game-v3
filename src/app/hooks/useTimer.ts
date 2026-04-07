'use client';

import { useState, useRef, useCallback } from 'react';

export interface TimerState {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useTimer(): TimerState {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return; // already running
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const reset = useCallback(() => {
    stop();
    setSeconds(0);
    setIsRunning(false);
  }, [stop]);

  // Cleanup on unmount
  // (hooks in Next.js app dir run in client components — useEffect cleanup handles this,
  //  but for a pure hook without useEffect we rely on the consumer calling stop/reset)

  return { seconds, isRunning, start, stop, reset };
}
