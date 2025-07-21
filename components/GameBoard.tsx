import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BlockData } from '../types';
import { GRID_WIDTH, GRID_HEIGHT, BLOCK_COLORS } from '../constants';
import Block from './Block';

interface GameBoardProps {
  blocks: BlockData[];
  nextBlockValue: number;
  onDrop: (col: number) => void;
  isProcessing: boolean;
  gameState: 'playing' | 'gameover';
}

const GameBoard: React.FC<GameBoardProps> = ({ blocks, nextBlockValue, onDrop, isProcessing, gameState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockSize, setBlockSize] = useState(0);
  const [activeCol, setActiveCol] = useState<number>(Math.floor(GRID_WIDTH / 2));
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);

  useEffect(() => {
    const updateBlockSize = () => {
      if (containerRef.current) {
        setBlockSize(containerRef.current.clientWidth / GRID_WIDTH);
      }
    };
    updateBlockSize();
    window.addEventListener('resize', updateBlockSize);
    return () => window.removeEventListener('resize', updateBlockSize);
  }, []);

  useEffect(() => {
    if (!isProcessing && gameState === 'playing') {
      setIsPreviewVisible(true);
    }
  }, [isProcessing, gameState]);

  const handleDrop = useCallback(() => {
    if (isProcessing || gameState !== 'playing') return;
    onDrop(activeCol);
    setIsPreviewVisible(false);
  }, [onDrop, activeCol, isProcessing, gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (isProcessing || gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowLeft':
          setActiveCol(prev => Math.max(0, prev - 1));
          setIsPreviewVisible(true);
          break;
        case 'ArrowRight':
          setActiveCol(prev => Math.min(GRID_WIDTH - 1, prev + 1));
          setIsPreviewVisible(true);
          break;
        case 'ArrowDown':
        case ' ':
          handleDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, gameState, handleDrop]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isProcessing || gameState === 'gameover' || !containerRef.current || blockSize === 0) return;
    
    const boardElement = containerRef.current.querySelector('.game-board-area');
    if (!boardElement) return;

    const rect = boardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const col = Math.floor(x / blockSize);
    
    if (col >= 0 && col < GRID_WIDTH) {
      setActiveCol(col);
      setIsPreviewVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (gameState === 'playing') {
        setIsPreviewVisible(false);
    }
  };

  const previewColor = BLOCK_COLORS[nextBlockValue] || 'bg-gray-400';
  const textClass = nextBlockValue > 4 ? 'text-white' : 'text-slate-800';
  const previewX = (activeCol + 0.5) * blockSize;
  const interactiveCursor = gameState === 'playing' ? 'pointer' : 'default';

  return (
    <div
      ref={containerRef}
      className="relative mt-4 focus:outline-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleDrop}
      tabIndex={0}
    >
      {/* Preview Area */}
      <div className="h-24 flex flex-col items-center justify-center mb-2">
        <div className="text-xs text-slate-400 tracking-widest uppercase">NEXT</div>
        <div className="relative w-full h-16 mt-1">
          {gameState === 'playing' && isPreviewVisible && blockSize > 0 && (
            <div
              className={`absolute top-0 flex items-center justify-center rounded-md font-bold transition-transform duration-75 ease-out ${previewColor} ${textClass}`}
              style={{
                left: '0px',
                width: `${blockSize}px`,
                height: `${blockSize}px`,
                transform: `translateX(${previewX - blockSize / 2}px)`,
                opacity: isProcessing ? 0.5 : 1,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.25)',
              }}
            >
              {nextBlockValue}
            </div>
          )}
        </div>
      </div>


      {/* Game Board */}
      <div
        className="game-board-area relative bg-black/30 rounded-lg overflow-hidden"
        style={{ height: `${blockSize * GRID_HEIGHT}px`, cursor: interactiveCursor }}
      >
        {blockSize > 0 && (
          <>
            {/* Danger Zone */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-red-600/40 via-red-600/10 to-transparent pointer-events-none animate-pulse"></div>
            
            {/* Blocks */}
            {blocks.map(block => (
              <Block key={block.id} block={block} blockSize={blockSize} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default GameBoard;