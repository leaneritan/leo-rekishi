import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2, HelpCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';

const UnitCard = ({ unit, progress }) => {
  const navigate = useNavigate();
  const quizProgress = progress?.quiz[unit.id] || { correct: 0, total: 0 };
  const cardProgress = progress?.flashcards[unit.id] || { masteredIds: [], total: 0 };

  const isQuizComplete = quizProgress.total > 0;
  const quizScore = isQuizComplete ? Math.round((quizProgress.correct / quizProgress.total) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/unit/${unit.id}`)}
      className="card group cursor-pointer hover:border-white/20 transition-all flex flex-col h-full border-t-4"
      style={{ borderTopColor: unit.color }}
    >
      <div className="p-5 space-y-4 flex-1">
        <div className="flex justify-between items-start">
          <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold tracking-widest text-muted uppercase">
            {unit.dayTag}
          </span>
          {isQuizComplete && quizScore >= 80 && (
             <CheckCircle2 size={18} className="text-green-500" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold group-hover:text-white transition-colors">{unit.title}</h3>
          <p className="text-sm text-muted line-clamp-2 mt-1">{unit.description}</p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
              <span>Quiz Score</span>
              <span>{quizProgress.correct} / {quizProgress.total || '-'}</span>
            </div>
            <ProgressBar current={quizProgress.correct} total={quizProgress.total || 1} color={unit.color} />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
              <span>Flashcards</span>
              <span>{cardProgress.masteredIds.length} / {cardProgress.total || '-'}</span>
            </div>
            <ProgressBar current={cardProgress.masteredIds.length} total={cardProgress.total || 1} color="#10b981" />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center group-hover:bg-white/10 transition-colors">
        <span className="text-xs font-bold text-muted group-hover:text-text transition-colors uppercase tracking-widest">
          Study Now
        </span>
        <ChevronRight size={16} className="text-muted group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default UnitCard;
