import React from 'react';

interface HeaderProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onUndo: () => void;
  undoCount: number;
  canUndo: boolean;
}

const UndoIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.5 8C9.89 8 7.45 8.99 5.6 10.6L2 7V16H11L7.38 12.38C8.77 11.22 10.54 10.5 12.5 10.5C16.04 10.5 19.05 12.81 20.1 16L22.47 15.22C21.08 11.03 17.15 8 12.5 8Z" />
  </svg>
);

const RestartIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
);

const ScoreDisplay: React.FC<{ title: string; score: number }> = ({ title, score }) => (
  <div className="text-center animate-score-pop">
    <div className="text-xs text-slate-300 uppercase tracking-wider">{title}</div>
    <div 
        className="text-3xl font-bold text-white"
        style={{textShadow: '0 0 4px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3)'}}
    >
        {score}
    </div>
     <style>{`
      @keyframes score-pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
      .animate-score-pop {
        animation: score-pop 0.3s ease-in-out;
      }
    `}</style>
  </div>
);


const Header: React.FC<HeaderProps> = ({ score, highScore, onRestart, onUndo, undoCount, canUndo }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="relative">
        <button 
          onClick={onUndo} 
          disabled={!canUndo}
          className="bg-white/10 hover:bg-white/20 disabled:bg-slate-600/50 disabled:cursor-not-allowed disabled:text-slate-400 text-white font-bold p-3 rounded-full transition-all duration-200 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-fuchsia-500/30 active:scale-95"
          aria-label="Undo move"
        >
          <UndoIcon className="w-6 h-6" />
        </button>
        {undoCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-slate-800/80">
            {undoCount}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        <ScoreDisplay key={`score-${score}`} title="Score" score={score} />
        <ScoreDisplay key={`highscore-${highScore}`} title="Best" score={highScore} />
      </div>

      <button 
        onClick={onRestart} 
        className="bg-white/10 hover:bg-white/20 text-white font-bold p-3 rounded-full transition-all duration-200 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-cyan-500/30 active:scale-95"
        aria-label="Restart game"
      >
        <RestartIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Header;