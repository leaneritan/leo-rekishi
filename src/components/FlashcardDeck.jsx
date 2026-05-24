import React, { useState, useMemo } from 'react';
import { useProgress } from '../hooks/useProgress';
import { ChevronLeft, ChevronRight, RotateCcw, Check, RefreshCw } from 'lucide-react';

const FlashcardDeck = ({ flashcards, unitColor, unitId }) => {
  const { getFlashcardMastery, saveFlashcardMastery } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(flashcards);

  const masteryData = getFlashcardMastery(unitId);
  const [masteredIds, setMasteredIds] = useState(masteryData?.masteredIds || []);

  const currentCard = deck[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const toggleMastery = (e) => {
    e.stopPropagation();
    let newMastered;
    if (masteredIds.includes(currentCard.id)) {
      newMastered = masteredIds.filter(id => id !== currentCard.id);
    } else {
      newMastered = [...masteredIds, currentCard.id];
    }
    setMasteredIds(newMastered);
    saveFlashcardMastery(unitId, newMastered, deck.length);
  };

  const shuffleDeck = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const isMastered = masteredIds.includes(currentCard.id);

  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center text-sm text-muted">
        <span>{currentIndex + 1} / {deck.length}</span>
        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-mono">
          {masteredIds.length} / {deck.length} 覚えた
        </span>
      </div>

      <div
        className="relative w-full aspect-[4/3] cursor-pointer group perspective"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className={`absolute inset-0 backface-hidden card flex items-center justify-center p-8 text-center border-b-4 shadow-xl`} style={{ borderBottomColor: unitColor }}>
            <h2 className="text-3xl font-serif font-bold leading-relaxed">
              {currentCard.term}
            </h2>
            <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity">
              <RefreshCw size={20} />
            </div>
            {isMastered && (
              <div className="absolute top-4 right-4 text-green-500">
                <Check size={24} />
              </div>
            )}
          </div>

          {/* Back */}
          <div className={`absolute inset-0 backface-hidden rotate-y-180 card flex items-center justify-center p-8 text-center border-b-4 shadow-xl bg-slate-800`} style={{ borderBottomColor: unitColor }}>
            <p className="text-xl leading-relaxed text-text">
              {currentCard.definition}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          onClick={toggleMastery}
          className={`col-span-2 btn-primary flex items-center justify-center gap-2 ${isMastered ? 'bg-green-600' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {isMastered ? <><Check size={20}/> 覚えた！</> : '覚えた ✓'}
        </button>

        <button onClick={prevCard} className="btn-primary bg-white/5 hover:bg-white/10 flex items-center justify-center">
          <ChevronLeft size={24} />
        </button>

        <button onClick={nextCard} className="btn-primary bg-white/5 hover:bg-white/10 flex items-center justify-center">
          <ChevronRight size={24} />
        </button>

        <button onClick={shuffleDeck} className="col-span-2 btn-primary bg-white/5 hover:bg-white/10 text-muted flex items-center justify-center gap-2">
          <RotateCcw size={16} /> シャッフル
        </button>
      </div>

      <style jsx="true">{`
        .perspective { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default FlashcardDeck;
