import { useState, useEffect } from 'react';

const STORAGE_KEY = 'leo-rekishi-progress';

export const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { quiz: {}, flashcards: {} };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const saveQuizResult = (unitId, correct, total) => {
    setProgress(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        [unitId]: {
          correct,
          total,
          lastAttempt: new Date().toISOString(),
        }
      }
    }));
  };

  const getQuizResult = (unitId) => {
    return progress.quiz[unitId] || null;
  };

  const saveFlashcardMastery = (unitId, masteredIds, total) => {
    setProgress(prev => ({
      ...prev,
      flashcards: {
        ...prev.flashcards,
        [unitId]: {
          masteredIds,
          total,
        }
      }
    }));
  };

  const getFlashcardMastery = (unitId) => {
    return progress.flashcards[unitId] || null;
  };

  const clearAll = () => {
    const initial = { quiz: {}, flashcards: {} };
    setProgress(initial);
  };

  return {
    progress,
    saveQuizResult,
    getQuizResult,
    saveFlashcardMastery,
    getFlashcardMastery,
    clearAll,
  };
};
