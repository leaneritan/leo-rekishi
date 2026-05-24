import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SlideViewer = ({ slides, unitColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  const renderSlideContent = () => {
    switch (slide.type) {
      case 'concept':
        return (
          <div className="space-y-6">
            <p className="text-lg text-text/90 leading-relaxed">{slide.body}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slide.cards.map((card, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <div className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span style={{ color: unitColor }}>{card.num}</span>
                    {card.heading}
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'formula':
        return (
          <div className="space-y-8">
             <p className="text-lg text-text/90">{slide.body}</p>
             <div className="bg-white/10 p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center" style={{ borderColor: unitColor }}>
                <div className="text-sm text-muted mb-2 font-mono">FORMULA</div>
                <div className="text-2xl md:text-3xl font-bold font-mono text-white">
                  {slide.formula}
                </div>
             </div>
             <div className="overflow-hidden rounded-xl border border-white/10">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-white/5">
                   <tr>
                     <th className="p-3 text-sm font-bold text-muted border-b border-white/10">西暦</th>
                     <th className="p-3 text-sm font-bold text-muted border-b border-white/10">計算</th>
                     <th className="p-3 text-sm font-bold text-muted border-b border-white/10 text-right">世紀</th>
                   </tr>
                 </thead>
                 <tbody>
                   {slide.examples.map((ex, i) => (
                     <tr key={i} className="border-b border-white/5 last:border-0">
                       <td className="p-3 font-mono">{ex.year}</td>
                       <td className="p-3 text-sm text-muted">{ex.calc}</td>
                       <td className="p-3 text-right font-bold" style={{ color: unitColor }}>{ex.result}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        );

      case 'era-list':
        return (
          <div className="space-y-6">
            <p className="text-lg text-text/90">{slide.body}</p>
            <div className="flex flex-wrap gap-3">
              {slide.eras.map((era, i) => (
                <div key={i} className="px-4 py-3 bg-card border border-white/10 rounded-xl flex flex-col items-center min-w-[100px]">
                  <span className="text-xl font-bold">{era.name}</span>
                  <span className="text-xs text-muted font-mono">{era.start}〜</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'period-list':
        return (
          <div className="space-y-4">
            <p className="text-lg text-text/90 mb-6">{slide.body}</p>
            {slide.periods.map((period, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-24 shrink-0 font-bold text-lg text-right">{period.name}</div>
                <div className="h-0.5 grow bg-white/10 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ backgroundColor: period.color }}></div>
                </div>
                <div className="w-2/3 bg-white/5 p-3 rounded-lg text-sm text-muted border-l-4" style={{ borderLeftColor: period.color }}>
                  {period.text}
                </div>
              </div>
            ))}
          </div>
        );

      case 'naming':
        return (
          <div className="space-y-6">
            <p className="text-lg text-text/90">{slide.body}</p>
            <div className="grid gap-4">
              {slide.groups.map((group, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-32 font-bold text-sm text-muted uppercase tracking-wider">{group.type}</div>
                  <div className="text-xl font-serif">{group.examples}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="space-y-6 overflow-x-auto">
            <p className="text-lg text-text/90">{slide.body}</p>
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white/5">
                  {slide.headers.map((h, i) => (
                    <th key={i} className="p-3 text-sm font-bold text-muted border-b border-white/10">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-3 ${j === 0 ? 'font-bold' : 'text-sm text-muted'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return <div>Unknown slide type</div>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-2 h-8 rounded-full" style={{ backgroundColor: unitColor }}></span>
          {slide.title}
        </h2>
        <div className="text-sm font-mono text-muted bg-white/10 px-3 py-1 rounded-full">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>

      <div className="min-h-[400px] animate-in slide-in-from-right-4 fade-in duration-300">
        {renderSlideContent()}
      </div>

      <div className="flex justify-between gap-4 pt-8">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="btn-primary bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center gap-2"
        >
          <ChevronLeft size={20} /> 戻る
        </button>
        <button
          onClick={nextSlide}
          disabled={currentIndex === slides.length - 1}
          className="btn-primary bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center gap-2"
        >
          次へ <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SlideViewer;
