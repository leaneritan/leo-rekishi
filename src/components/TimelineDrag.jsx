import React, { useEffect, useMemo, useState } from 'react';

const fallbackEvents = [
  { year: '約700万年前', event: '猿人の登場', bc: true },
  { year: '約240万年前', event: '原人の登場（火・言葉）', bc: true },
  { year: '約20万年前', event: '新人の登場（洞窟壁画）', bc: true },
  { year: '約1万年前', event: '氷河期の終わり・農耕の始まり', bc: true },
  { year: 'B.C.3500年', event: 'メソポタミア文明の誕生', bc: true },
  { year: 'B.C.3100年', event: 'エジプト文明の誕生', bc: true },
  { year: 'B.C.2300年', event: 'インダス文明の誕生', bc: true },
  { year: 'B.C.1600年', event: '中国文明（殷）の誕生', bc: true },
  { year: 'B.C.563年', event: 'シャカが仏教を開く', bc: true },
  { year: 'B.C.221年', event: '秦の始皇帝が中国を統一', bc: true },
  { year: '紀元前後', event: 'イエスがキリスト教を開く', bc: false },
  { year: '570年', event: 'ムハンマド誕生・イスラム教へ', bc: false },
];

const shuffle = (items) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const normalizeEvents = (events) => {
  const source = events && events.length > 0 ? events : fallbackEvents;
  return source.map((item, index) => ({
    ...item,
    id: item.id || `${item.year}-${item.event}-${index}`,
    order: index,
  }));
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}分${rest}秒` : `${rest}秒`;
};

const TimelineDrag = ({ events }) => {
  const orderedEvents = useMemo(() => normalizeEvents(events), [events]);
  const [bank, setBank] = useState([]);
  const [placed, setPlaced] = useState({});
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wrongSlot, setWrongSlot] = useState(null);
  const [wrongCard, setWrongCard] = useState(null);
  const [hintSlot, setHintSlot] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  const isComplete = orderedEvents.length > 0 && Object.keys(placed).length === orderedEvents.length;
  const score = Math.max(0, 100 - wrongAttempts * 10 - hintsUsed * 5);

  const reset = () => {
    setBank(shuffle(orderedEvents));
    setPlaced({});
    setWrongAttempts(0);
    setHintsUsed(0);
    setWrongSlot(null);
    setWrongCard(null);
    setHintSlot(null);
    setSelectedId(null);
    setStartedAt(Date.now());
    setElapsed(0);
  };

  useEffect(() => {
    reset();
  }, [orderedEvents]);

  useEffect(() => {
    if (isComplete) return undefined;
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isComplete, startedAt]);

  const placeCard = (cardId, slotIndex) => {
    const event = orderedEvents.find((item) => item.id === cardId);
    if (!event || placed[slotIndex]) return;

    if (event.order === slotIndex) {
      setPlaced((current) => {
        const next = { ...current, [slotIndex]: event };
        if (Object.keys(next).length === orderedEvents.length) {
          setElapsed(Math.floor((Date.now() - startedAt) / 1000));
        }
        return next;
      });
      setBank((current) => current.filter((item) => item.id !== cardId));
      setSelectedId(null);
      return;
    }

    setWrongAttempts((current) => current + 1);
    setWrongSlot(slotIndex);
    setWrongCard(cardId);
    window.setTimeout(() => {
      setWrongSlot(null);
      setWrongCard(null);
    }, 650);
  };

  const handleDrop = (event, slotIndex) => {
    event.preventDefault();
    const cardId = event.dataTransfer.getData('text/plain');
    placeCard(cardId, slotIndex);
  };

  const handleSlotClick = (slotIndex) => {
    if (!selectedId) return;
    placeCard(selectedId, slotIndex);
  };

  const showHint = () => {
    const target = selectedId
      ? orderedEvents.find((item) => item.id === selectedId)
      : orderedEvents.find((item) => !placed[item.order]);

    if (!target) return;

    setHintsUsed((current) => current + 1);
    setHintSlot(target.order);
    window.setTimeout(() => setHintSlot(null), 2000);
  };

  return (
    <div className="min-h-[70vh] rounded-2xl border border-white/10 bg-[#090b18] p-4 md:p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-yellow-400 uppercase">Timeline Mission</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-black">年表並べ替えゲーム</h2>
          <p className="mt-2 text-sm text-muted">カードを正しい年代の場所へ置こう。スマホではカードを選んでから枠をタップ。</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Score: {score}</div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Time: {formatTime(elapsed)}</div>
          <button onClick={showHint} className="rounded-lg border border-yellow-400/70 px-4 py-2 font-bold text-yellow-400 hover:bg-yellow-400/10">
            ヒント
          </button>
          <button onClick={reset} className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 font-bold hover:bg-white/15">
            もう一度
          </button>
        </div>
      </div>

      {isComplete && (
        <div className="my-6 overflow-hidden rounded-2xl border border-green-400/40 bg-green-400/10 p-5 text-center shadow-[0_0_30px_rgba(74,222,128,0.25)]">
          <div className="animate-bounce text-4xl">🎉</div>
          <h3 className="mt-2 text-2xl font-black text-green-300">完璧！全問正解！</h3>
          <p className="mt-1 text-sm text-green-100">Score {score} / Time {formatTime(elapsed)}</p>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <div className="relative">
          <div className="absolute left-5 top-4 bottom-4 w-1 rounded-full bg-yellow-400/80 shadow-[0_0_18px_rgba(240,192,64,0.45)] md:left-1/2"></div>
          <div className="space-y-4">
            {orderedEvents.map((event, index) => {
              const placedEvent = placed[index];
              const isWrong = wrongSlot === index;
              const isHint = hintSlot === index;

              return (
                <div key={event.id} className="relative grid gap-3 pl-14 md:grid-cols-[1fr_72px_1fr] md:pl-0">
                  <div className="hidden md:block text-right pt-4">
                    <span className={`font-mono text-sm font-bold ${event.bc ? 'text-red-400' : 'text-blue-400'}`}>{event.year}</span>
                  </div>
                  <div className="absolute left-2 top-5 z-10 h-7 w-7 rounded-full border-4 border-[#090b18] bg-yellow-400 md:static md:mt-4"></div>
                  <button
                    type="button"
                    onClick={() => handleSlotClick(index)}
                    onDragOver={(dropEvent) => dropEvent.preventDefault()}
                    onDrop={(dropEvent) => handleDrop(dropEvent, index)}
                    className={`min-h-20 rounded-xl border-2 border-dashed p-4 text-left transition-all ${
                      placedEvent
                        ? 'border-green-400 bg-green-400/10 shadow-[0_0_22px_rgba(74,222,128,0.25)]'
                        : 'border-yellow-400/35 bg-white/[0.03] hover:border-yellow-400'
                    } ${isWrong ? 'border-red-500 bg-red-500/20 animate-pulse' : ''} ${isHint ? 'ring-4 ring-yellow-300/70' : ''}`}
                  >
                    <div className={`md:hidden mb-1 font-mono text-xs font-bold ${event.bc ? 'text-red-400' : 'text-blue-400'}`}>{event.year}</div>
                    {placedEvent ? (
                      <div>
                        <div className={`font-mono text-xs font-bold ${placedEvent.bc ? 'text-red-400' : 'text-blue-400'}`}>{placedEvent.year}</div>
                        <div className="mt-1 font-bold">{placedEvent.event}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted">ここにカードを置く</div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="font-bold text-yellow-300">イベントカード</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {bank.map((event) => (
              <button
                key={event.id}
                type="button"
                draggable
                onClick={() => setSelectedId((current) => (current === event.id ? null : event.id))}
                onTouchStart={() => setSelectedId(event.id)}
                onDragStart={(dragEvent) => {
                  dragEvent.dataTransfer.setData('text/plain', event.id);
                  dragEvent.dataTransfer.effectAllowed = 'move';
                }}
                className={`rounded-xl border bg-[#101426] p-4 text-left transition-all ${
                  selectedId === event.id ? 'border-yellow-300 ring-2 ring-yellow-300/50' : 'border-yellow-400/60'
                } ${wrongCard === event.id ? 'animate-bounce border-red-500' : 'hover:-translate-y-0.5 hover:bg-[#151a2f]'}`}
              >
                <div className={`font-mono text-xs font-bold ${event.bc ? 'text-red-400' : 'text-blue-400'}`}>{event.year}</div>
                <div className="mt-1 font-bold text-white">{event.event}</div>
              </button>
            ))}
          </div>
          {bank.length === 0 && <p className="mt-4 text-sm text-green-300">すべて配置できました。</p>}
        </div>
      </div>
    </div>
  );
};

export default TimelineDrag;
