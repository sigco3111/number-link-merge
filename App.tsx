
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BlockData } from './types';
import { GRID_WIDTH, GRID_HEIGHT, INITIAL_BLOCK_VALUES } from './constants';
import GameBoard from './components/GameBoard';
import Header from './components/Header';
import GameOverModal from './components/GameOverModal';
import ComboDisplay from './components/ComboDisplay';

const App: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [nextBlockValue, setNextBlockValue] = useState<number>(() => INITIAL_BLOCK_VALUES[Math.floor(Math.random() * INITIAL_BLOCK_VALUES.length)]);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastState, setLastState] = useState<{blocks: BlockData[], score: number} | null>(null);
  const [undoCount, setUndoCount] = useState(1);
  const [isNewGame, setIsNewGame] = useState(true);
  const [comboDisplay, setComboDisplay] = useState<number>(0);
  const [comboKey, setComboKey] = useState<number>(0);

  const isMounted = useRef(false);

  useEffect(() => {
    // Load high score
    const storedHighScore = localStorage.getItem('numberLinkHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }

    // Load saved game state
    const savedGame = localStorage.getItem('numberLinkGameState');
    if (savedGame) {
      try {
        const parsedState = JSON.parse(savedGame);
        setBlocks(parsedState.blocks || []);
        setScore(parsedState.score || 0);
        setNextBlockValue(parsedState.nextBlockValue || generateNewBlockValue());
        setGameState(parsedState.gameState || 'playing');
        setUndoCount(parsedState.undoCount ?? 1);
        setLastState(parsedState.lastState || null);
        setIsNewGame(parsedState.isNewGame ?? false);
      } catch (e) {
        console.error("Failed to parse saved game state:", e);
        // If parsing fails, start a new game
        handleRestart(false);
      }
    }
    
    isMounted.current = true;
  }, []);

  // Save game state whenever it changes, but only after the initial mount and when not processing.
  useEffect(() => {
    if (!isMounted.current || isProcessing) {
      return;
    }
    
    // Don't save the very initial empty state of a new game
    if (isNewGame && blocks.length === 0 && score === 0) {
        return;
    }

    const stateToSave = {
      blocks,
      score,
      nextBlockValue,
      gameState,
      undoCount,
      lastState,
      isNewGame,
    };
    localStorage.setItem('numberLinkGameState', JSON.stringify(stateToSave));
  }, [blocks, score, nextBlockValue, gameState, undoCount, lastState, isNewGame, isProcessing]);


  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('numberLinkHighScore', score.toString());
    }
  }, [score, highScore]);
  
  const generateNewBlockValue = useCallback(() => {
    const possibleValues = INITIAL_BLOCK_VALUES;
    return possibleValues[Math.floor(Math.random() * possibleValues.length)];
  }, []);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const applyGravity = useCallback((currentBlocks: BlockData[]): { updatedBlocks: BlockData[], moved: boolean } => {
    let changed = false;
    // Create a fresh copy and reset transient animation states
    const newBlocks = [...currentBlocks].map(b => ({ ...b, isLanding: false }));
    
    for (let col = 0; col < GRID_WIDTH; col++) {
      const columnBlocks = newBlocks.filter(b => b.col === col).sort((a, b) => b.row - a.row);
      let nextRow = GRID_HEIGHT - 1;
      for (const block of columnBlocks) {
        if (block.row !== nextRow) {
          block.row = nextRow;
          block.isLanding = true; // Set flag on moved blocks
          changed = true;
        }
        nextRow--;
      }
    }
    return { updatedBlocks: newBlocks, moved: changed };
  }, []);


  const processMerges = useCallback(async (currentBlocks: BlockData[]): Promise<{ updatedBlocks: BlockData[], scoreGained: number, merged: boolean }> => {
    let blocksCopy: BlockData[] = currentBlocks.map(b => ({ ...b, isNew: false, isMergedResult: false, isLanding: false }));
    let scoreGained = 0;
    let hasMerged = false;

    const grid: (BlockData | null)[][] = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null));
    blocksCopy.forEach(block => {
      if (block.row >= 0 && block.row < GRID_HEIGHT && block.col >= 0 && block.col < GRID_WIDTH) {
        grid[block.row][block.col] = block;
      }
    });

    const mergesToPerform: { newBlock: BlockData }[] = [];
    const mergedIds = new Set<string>();

    // Check for horizontal merges
    for (let r = 0; r < GRID_HEIGHT; r++) {
      for (let c = 0; c < GRID_WIDTH - 1; c++) {
        const block1 = grid[r][c];
        const block2 = grid[r][c + 1];

        if (block1 && block2 && block1.value === block2.value && !mergedIds.has(block1.id) && !mergedIds.has(block2.id)) {
          mergedIds.add(block1.id);
          mergedIds.add(block2.id);
          const newValue = block1.value * 2;
          scoreGained += newValue;
          mergesToPerform.push({
            newBlock: {
              id: `block-${Date.now()}-${Math.random()}`,
              value: newValue,
              col: block1.col, // New block takes the left-most position
              row: block1.row,
              isMergedResult: true,
            }
          });
        }
      }
    }

    // Check for vertical merges
    for (let c = 0; c < GRID_WIDTH; c++) {
      for (let r = GRID_HEIGHT - 1; r > 0; r--) {
        const block1 = grid[r][c]; // bottom block
        const block2 = grid[r - 1][c]; // top block
        
        if (block1 && block2 && block1.value === block2.value && !mergedIds.has(block1.id) && !mergedIds.has(block2.id)) {
          mergedIds.add(block1.id);
          mergedIds.add(block2.id);
          const newValue = block1.value * 2;
          scoreGained += newValue;
          mergesToPerform.push({
            newBlock: {
              id: `block-${Date.now()}-${Math.random()}`,
              value: newValue,
              col: block1.col, // New block takes the bottom-most position
              row: block1.row,
              isMergedResult: true,
            }
          });
        }
      }
    }

    if (mergesToPerform.length > 0) {
      hasMerged = true;
      
      // Animate out the old blocks
      const intermediateBlocks = blocksCopy.map(b => {
        if (mergedIds.has(b.id)) {
          return { ...b, isMerging: true };
        }
        return b;
      });
      setBlocks(intermediateBlocks);
      await delay(150);

      // Replace old blocks with new ones
      let finalBlocks = blocksCopy.filter(b => !mergedIds.has(b.id));
      mergesToPerform.forEach(merge => {
        finalBlocks.push(merge.newBlock);
      });
      blocksCopy = finalBlocks;
    }

    return { updatedBlocks: blocksCopy, scoreGained, merged: hasMerged };
  }, []);

  const runGameCycle = useCallback(async (initialBlocks: BlockData[]) => {
    let currentBlocks = initialBlocks;
    let cycle = 0;
    let comboLevel = 1;
    let turnHadMerges = false;

    while (true && cycle < 10) { // Cycle cap to prevent infinite loops
      const { updatedBlocks: mergedBlocks, scoreGained, merged } = await processMerges(currentBlocks);
      
      if (merged) {
        turnHadMerges = true;
        const scoreToAddWithCombo = scoreGained * comboLevel;
        setScore(s => s + scoreToAddWithCombo);
        
        if (comboLevel >= 2) {
          setComboDisplay(comboLevel);
          setComboKey(k => k + 1);
        }
        
        comboLevel++;
      }
      
      currentBlocks = mergedBlocks;

      const { updatedBlocks: gravityBlocks, moved } = applyGravity(currentBlocks);
      currentBlocks = gravityBlocks;

      if (merged || moved) {
        setBlocks(currentBlocks);
        await delay(200);
      }
      
      if (!merged && !moved) {
        break;
      }
      cycle++;
    }

    if (!turnHadMerges) {
        setComboDisplay(0);
    }

    // Check for game over
    const isGameOver = currentBlocks.some(b => b.row < 0);
    if(isGameOver) {
      setGameState('gameover');
      setComboDisplay(0);
    } else {
      setIsProcessing(false);
    }
  }, [applyGravity, processMerges]);

  const handleDrop = useCallback(async (col: number) => {
    if (isProcessing || gameState === 'gameover') return;
    
    const columnBlocks = blocks.filter(b => b.col === col);
    if (columnBlocks.length >= GRID_HEIGHT) return;

    setIsProcessing(true);
    setLastState({ blocks: [...blocks], score });
    if(isNewGame) {
      setUndoCount(1);
      setIsNewGame(false);
    }

    const newBlock: BlockData = {
      id: `block-${Date.now()}`,
      value: nextBlockValue,
      col: col,
      row: -1,
      isNew: true,
    };
    
    const blocksWithNew = [...blocks, newBlock].map(b => ({...b, isLanding: false}));
    setNextBlockValue(generateNewBlockValue());
    
    const { updatedBlocks } = applyGravity(blocksWithNew);
    setBlocks(updatedBlocks);
    await delay(300);

    runGameCycle(updatedBlocks);

  }, [blocks, isProcessing, gameState, nextBlockValue, score, applyGravity, generateNewBlockValue, runGameCycle, isNewGame]);
  
  const handleRestart = (clearStorage = true) => {
    if (clearStorage) {
      localStorage.removeItem('numberLinkGameState');
    }
    setBlocks([]);
    setScore(0);
    setNextBlockValue(generateNewBlockValue());
    setGameState('playing');
    setIsProcessing(false);
    setUndoCount(1);
    setLastState(null);
    setIsNewGame(true);
    setComboDisplay(0);
  };

  const handleUndo = () => {
    if (undoCount > 0 && lastState) {
      setBlocks(lastState.blocks);
      setScore(lastState.score);
      setUndoCount(undoCount - 1);
      setLastState(null);
      setComboDisplay(0);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans select-none">
      <div className="w-full max-w-sm mx-auto bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-4 relative">
        <Header 
          score={score} 
          highScore={highScore} 
          onRestart={() => handleRestart(true)}
          onUndo={handleUndo}
          undoCount={undoCount}
          canUndo={!!lastState && undoCount > 0 && !isProcessing}
        />
        <GameBoard
          blocks={blocks}
          nextBlockValue={nextBlockValue}
          onDrop={handleDrop}
          isProcessing={isProcessing}
          gameState={gameState}
        />
        <ComboDisplay key={comboKey} comboCount={comboDisplay} />
        {gameState === 'gameover' && <GameOverModal score={score} onRestart={() => handleRestart(true)} />}
      </div>
    </div>
  );
};

export default App;
