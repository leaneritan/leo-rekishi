import React from 'react';
import { useNavigate } from 'react-router-dom';
import manifest from '../content/manifest.json';
import UnitCard from '../components/UnitCard';
import { useProgress } from '../hooks/useProgress';
import { BookOpen, Trophy, Calendar } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  // Group units by day
  const days = [
    { id: 'Day 1', label: 'Day 1: 基礎と調べ方', unitIds: ['ch1-s1', 'ch1-s2'] },
    { id: 'Day 2', label: 'Day 2: 人類と文明(前)', unitIds: ['ch2-s1-jinrui', 'ch2-s1-bunmei'] },
    { id: 'Day 3', label: 'Day 3: 文明(後)と宗教', unitIds: ['ch2-s1-shukyo'] }, // Adjusted based on manifest
  ];

  // Actually let's just group by dayTag from manifest for better flexibility
  const unitsByDay = manifest.units.reduce((acc, unit) => {
    const day = unit.dayTag.split('-')[0]; // Simplify "Day 2-3" to "Day 2"
    acc[day] = acc[day] || [];
    acc[day].push(unit);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16">
      {/* Hero Header */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-blue-500/20">
          <Trophy size={14} /> テスト4日前対策
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight text-white">
           📜 Leo の <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">歴史</span> 探偵
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          テスト範囲の重要ポイントを効率よくマスターしよう！
        </p>
      </header>

      {/* Main Grid */}
      <main className="space-y-12">
        {Object.entries(unitsByDay).map(([day, units]) => (
          <section key={day} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-card border border-white/10 flex items-center justify-center text-blue-400">
                <Calendar size={20} />
              </div>
              <h2 className="text-2xl font-bold">{day}</h2>
              <div className="h-px grow bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {units.map(unit => (
                <UnitCard key={unit.id} unit={unit} progress={progress} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Global Action */}
      <footer className="pt-8 text-center space-y-4">
        <button
          onClick={() => navigate('/quiz/all')}
          className="group relative px-8 py-5 bg-white text-background font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative z-10 flex items-center gap-3 text-xl group-hover:text-white">
            📝 総合テスト（全範囲）
          </span>
        </button>
        <div>
          <button
            onClick={() => navigate('/timeline-drag')}
            className="px-8 py-5 bg-[#090b18] text-yellow-400 font-bold rounded-2xl border border-yellow-400/70 transition-all hover:scale-105 hover:bg-yellow-400/10 active:scale-95 shadow-2xl shadow-yellow-400/10 text-xl"
          >
            🗓️ 年表並べ替えゲーム
          </button>
        </div>
        <a 
          href={`${import.meta.env.BASE_URL}rekishi_kanzen.html`}
          target="_blank"
          rel="noopener noreferrer"
          style={{textDecoration: 'none'}}
        >
          <button style={{
            border: '1px solid #f0c040',
            color: '#f0c040',
            background: 'transparent',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            📄 クイックレビュー（全範囲）
          </button>
        </a>
        <p className="mt-4 text-muted text-sm">全ユニットのクイズからランダムに出題されます</p>
      </footer>
    </div>
  );
};

export default Home;
