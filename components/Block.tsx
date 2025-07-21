import React from 'react';
import { BlockData } from '../types';
import { BLOCK_COLORS } from '../constants';

interface BlockProps {
  block: BlockData;
  blockSize: number;
}

const Block: React.FC<BlockProps> = ({ block, blockSize }) => {
  const { value, row, col, isMerging, isMergedResult, isLanding } = block;
  const colorClass = BLOCK_COLORS[value] || 'bg-gray-400';
  const isHotBlock = value >= 512;

  const top = row * blockSize;
  const left = col * blockSize;

  const textClass = value > 2 ? 'text-white' : 'text-slate-800';
  const textSizeClass = value < 100 ? 'text-2xl' : value < 1000 ? 'text-xl' : 'text-lg';
  
  let animationClasses = '';
  if (isMerging) {
    animationClasses = 'animate-merge-out';
  } else if (isMergedResult) {
    animationClasses = 'animate-pop-in';
  } else if (isLanding) {
    animationClasses = 'animate-land-bounce';
  }

  if (isHotBlock && !isMerging) {
    animationClasses += ' animate-hot-pulse';
  }

  return (
    <div
      className={`absolute flex items-center justify-center rounded-md font-bold transition-all duration-200 ease-in-out ${colorClass} ${textClass} ${textSizeClass} ${animationClasses}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${blockSize}px`,
        height: `${blockSize}px`,
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
        transformOrigin: 'center center'
      }}
    >
      {value}
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          75% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.3s ease-out forwards;
        }

        @keyframes land-bounce {
          0%, 100% { transform: scale(1.0); }
          50% { transform: scale(1.05, 0.95); }
        }
        .animate-land-bounce { 
          animation: land-bounce 0.4s ease-out; 
        }

        @keyframes merge-out {
          to { transform: scale(0) rotate(45deg); opacity: 0; }
        }
        .animate-merge-out { 
          animation: merge-out 0.15s ease-in forwards; 
        }

        @keyframes hot-pulse {
          50% { filter: brightness(1.3); transform: scale(1.02); }
        }
        .animate-hot-pulse { 
          animation: hot-pulse 2s infinite ease-in-out; 
        }
      `}</style>
    </div>
  );
};

export default Block;