import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  // Initialize state from localStorage or use default value
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}