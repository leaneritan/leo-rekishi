import React, { useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { Check, X, ArrowRight, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizEngine = ({ questions, unitColor, unitId }) => {
  const navigate = useNavigate();
  const { saveQuizResult } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    const isCorrect = index === currentQuestion.answer;
    setResults([...results, { ...currentQuestion, isCorrect, selectedOption: index }]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const correctCount = results.filter(r => r.isCorrect).length;
      saveQuizResult(unitId, correctCount, questions.length);
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setResults([]);
    setIsFinished(false);
  };

  if (isFinished) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const percentage = (correctCount / questions.length) * 100;

    let message = "頑張ったね！";
    if (percentage === 100) message = "完璧！すごい！💮";
    else if (percentage >= 80) message = "素晴らしい！あと一歩！✨";
    else if (percentage >= 50) message = "いい感じ！復習しよう！📖";

    const sectionBreakdown = results.reduce((acc, r) => {
      acc[r.section] = acc[r.section] || { correct: 0, total: 0 };
      acc[r.section].total += 1;
      if (r.isCorrect) acc[r.section].correct += 1;
      return acc;
    }, {});

    return (
      <div className="card p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-bold">結果発表</h2>
        <div className="text-6xl font-mono text-white">
          <span style={{ color: unitColor }}>{correctCount}</span> / {questions.length}
        </div>
        <p className="text-xl text-muted">{message}</p>

        <div className="text-left space-y-3 bg-white/5 p-4 rounded-lg">
          <h3 className="font-bold border-b border-white/10 pb-2 mb-2">セクション別の結果</h3>
          {Object.entries(sectionBreakdown).map(([section, data]) => (
            <div key={section} className="flex justify-between text-sm">
              <span>{section}</span>
              <span className={data.correct === data.total ? 'text-green-400' : 'text-text'}>
                {data.correct} / {data.total}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button onClick={restartQuiz} className="btn-primary bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2">
            <RotateCcw size={18} /> もう一度
          </button>
          <button onClick={() => navigate('/')} className="btn-primary bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2">
            <Home size={18} /> ホームへ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Dots */}
      <div className="flex justify-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentIndex ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
            } ${
              results[i] ? (results[i].isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="card p-6 md:p-8 space-y-6 relative overflow-visible">
        <div className="flex justify-between items-start">
          <span className="bg-white/10 text-xs font-bold px-2 py-1 rounded tracking-wider uppercase text-muted">
            {currentQuestion.section}
          </span>
          <span className="text-sm font-mono text-muted">Q{currentIndex + 1}</span>
        </div>

        <h3 className="text-xl font-bold leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => {
            let stateClass = "bg-white/5 border-white/10 hover:bg-white/10";
            if (isAnswered) {
              if (index === currentQuestion.answer) stateClass = "bg-green-500/20 border-green-500 text-green-400";
              else if (index === selectedOption) stateClass = "bg-red-500/20 border-red-500 text-red-400";
              else stateClass = "opacity-50 bg-white/5 border-white/10";
            }

            return (
              <button
                key={index}
                disabled={isAnswered}
                onClick={() => handleOptionClick(index)}
                className={`flex items-center text-left p-4 rounded-xl border-2 transition-all group ${stateClass}`}
              >
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mr-4 font-mono font-bold group-hover:bg-white/20">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {isAnswered && index === currentQuestion.answer && <Check size={20} className="ml-2 text-green-400" />}
                {isAnswered && index === selectedOption && index !== currentQuestion.answer && <X size={20} className="ml-2 text-red-400" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="animate-in slide-in-from-top-4 duration-300 space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border-l-4 border-blue-400">
              <p className="text-sm text-text leading-relaxed">
                <span className="font-bold text-blue-400 mr-2">解説:</span>
                {currentQuestion.explanation}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full btn-primary flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: unitColor }}
            >
              {currentIndex === questions.length - 1 ? '結果を見る' : '次の問題'} <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
