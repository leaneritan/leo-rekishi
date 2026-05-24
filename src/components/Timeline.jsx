import React, { useState } from 'react';

const Timeline = ({ events, unitColor }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted space-y-4">
        <div className="text-4xl">📜</div>
        <p>このユニットに年表はありません</p>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2"></div>

      <div className="space-y-12">
        {events.map((event, index) => {
          const isExpanded = expandedId === event.id;
          const isBC = event.bc;
          const side = index % 2 === 0 ? 'left' : 'right';

          return (
            <div key={event.id} className="relative">
              {/* Dot */}
              <div
                className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 z-10 border-4 border-background`}
                style={{ backgroundColor: isBC ? '#ef4444' : '#3b82f6' }}
              ></div>

              <div className={`ml-12 md:ml-0 md:w-1/2 ${side === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'}`}>
                <div
                  className={`card p-4 cursor-pointer transition-all hover:scale-[1.02] border-t-4 ${isExpanded ? 'ring-2' : ''}`}
                  style={{ borderTopColor: isBC ? '#ef4444' : '#3b82f6', ringColor: unitColor }}
                  onClick={() => setExpandedId(isExpanded ? null : event.id)}
                >
                  <div className={`flex flex-col ${side === 'left' ? 'md:items-end' : 'md:items-start'}`}>
                    <span className={`text-sm font-mono font-bold mb-1 ${isBC ? 'text-red-400' : 'text-blue-400'}`}>
                      {event.year} {isBC ? '(B.C.)' : ''}
                    </span>
                    <h3 className="text-xl font-bold">{event.event}</h3>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-sm text-muted leading-relaxed">
                        {event.detail}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center gap-8 text-xs font-bold uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-red-400">B.C. (紀元前)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-blue-400">A.D. (紀元後)</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
