import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Clock, CheckCircle2 } from 'lucide-react';
import SlideViewer from '../components/SlideViewer';
import FlashcardDeck from '../components/FlashcardDeck';
import Timeline from '../components/Timeline';
import TimelineDrag from '../components/TimelineDrag';
import QuizEngine from '../components/QuizEngine';
import { useProgress } from '../hooks/useProgress';

const UnitPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [activeTab, setActiveTab] = useState('slides');
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    const loadUnit = async () => {
      try {
        // Trying to import the JSON file directly
        const data = await import(`../content/units/${id}.json`);
        setUnit(data.default);
      } catch (error) {
        console.error('Failed to load unit data', error);
      } finally {
        setLoading(false);
      }
    };
    loadUnit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-white/10 animate-spin"></div>
          <p className="text-muted font-mono">LOADING UNIT...</p>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold">ユニットが見つかりません</h1>
        <button onClick={() => navigate('/')} className="btn-primary bg-white/10">ホームに戻る</button>
      </div>
    );
  }

  const tabs = [
    { id: 'slides', label: 'スライド', icon: BookOpen },
    { id: 'flashcards', label: 'フラッシュカード', icon: Layers },
    { id: 'timeline', label: '年表', icon: Clock },
    { id: 'timelineDrag', label: '🗓️ 並べ替え', icon: Clock },
    { id: 'quiz', label: 'クイズ', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 glass border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-muted uppercase">
                  {unit.dayTag}
                </span>
                <h1 className="font-bold text-sm md:text-base">{unit.title}</h1>
              </div>
            </div>
          </div>

          <div className="hidden md:flex gap-4">
             <div className="text-right">
                <div className="text-[10px] font-bold text-muted uppercase">Progress</div>
                <div className="text-xs font-mono">
                  Q: {progress.quiz[unit.id]?.correct || 0} / {unit.quiz.length}
                </div>
             </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 flex flex-col md:flex-row items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-white text-white'
                  : 'border-transparent text-muted hover:text-text'
              }`}
              style={activeTab === tab.id ? { borderBottomColor: unit.color } : {}}
            >
              <tab.icon size={18} />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'slides' && <SlideViewer slides={unit.slides} unitColor={unit.color} />}
          {activeTab === 'flashcards' && <FlashcardDeck flashcards={unit.flashcards} unitColor={unit.color} unitId={unit.id} />}
          {activeTab === 'timeline' && <Timeline events={unit.timeline} unitColor={unit.color} />}
          {activeTab === 'timelineDrag' && <TimelineDrag events={unit.timeline} />}
          {activeTab === 'quiz' && <QuizEngine questions={unit.quiz} unitColor={unit.color} unitId={unit.id} />}
        </div>
      </main>
    </div>
  );
};

export default UnitPage;
