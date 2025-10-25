import { useState, useCallback } from 'react';

export const useHistory = <T,>(initialState: T) => {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const setState = useCallback((
    newState: T | ((prevState: T) => T),
    override = false
  ) => {
    const present = typeof newState === 'function' 
      ? (newState as (prevState: T) => T)(history[index]) 
      : newState;

    if (JSON.stringify(present) === JSON.stringify(history[index])) {
      return;
    }

    if (override) {
      const newHistory = [...history];
      newHistory[index] = present;
      setHistory(newHistory);
    } else {
      const past = history.slice(0, index + 1);
       if (JSON.stringify(past[past.length - 1]) === JSON.stringify(present)) {
        return;
      }
      const newHistory = [...past, present];
      setHistory(newHistory);
      setIndex(newHistory.length - 1);
    }
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(prevIndex => prevIndex - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(prevIndex => prevIndex + 1);
    }
  }, [index, history.length]);

  return {
    state: history[index],
    setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
};
