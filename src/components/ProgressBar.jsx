import React from 'react';

const ProgressBar = ({ current, total, color }) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: color || '#4a9eff'
        }}
      />
    </div>
  );
};

export default ProgressBar;
