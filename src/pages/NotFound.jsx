import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-8">
      <div className="text-9xl font-black text-white/5 select-none">404</div>
      <div className="space-y-2 relative -top-16">
        <h1 className="text-3xl font-bold">ページが見つかりません</h1>
        <p className="text-muted">お探しのページは存在しないか、移動した可能性があります。</p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="btn-primary bg-white text-background hover:bg-blue-400 hover:text-white transition-all px-8 py-4 -top-16 relative"
      >
        ホームに戻る
      </button>
    </div>
  );
};

export default NotFound;
