import React from 'react';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 animate-fade-in">
      <div className="bg-slate-800/50 backdrop-blur-md border border-white/20 rounded-lg p-8 text-center shadow-2xl animate-pop-in-up">
        <h2 
          className="text-4xl font-bold text-rose-500 mb-2"
          style={{textShadow: '0 0 5px rgba(239, 68, 68, 0.7), 0 0 15px rgba(239, 68, 68, 0.5)'}}
        >
            Game Over
        </h2>
        <p className="text-lg text-slate-300 mb-4">Your final score is:</p>
        <p 
            className="text-6xl font-bold mb-6 text-white"
            style={{textShadow: '0 0 5px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5)'}}
        >
            {score}
        </p>
        <button
          onClick={onRestart}
          className="bg-emerald-500/80 hover:bg-emerald-500/100 border border-emerald-400/50 hover:border-emerald-400/100 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-400/50"
        >
          Play Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes pop-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pop-in-up {
          animation: pop-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameOverModal;