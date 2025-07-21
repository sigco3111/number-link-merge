import React from 'react';

interface ComboDisplayProps {
  comboCount: number;
}

const ComboDisplay: React.FC<ComboDisplayProps> = ({ comboCount }) => {
  if (comboCount < 2) {
    return null;
  }

  const gradientText = {
    background: `linear-gradient(135deg, #fde047, #f97316, #ec4899)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none animate-combo-pop"
      style={{ textShadow: '0px 2px 10px rgba(0, 0, 0, 0.5)' }}
    >
      <div className="text-6xl font-black tracking-tighter" style={gradientText}>
        x{comboCount}
      </div>
      <div className="text-3xl font-bold tracking-widest text-white/90 -mt-2">
        COMBO
      </div>
      <style>{`
        @keyframes combo-pop {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          25% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(0.9); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .animate-combo-pop {
          animation: combo-pop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default ComboDisplay;
