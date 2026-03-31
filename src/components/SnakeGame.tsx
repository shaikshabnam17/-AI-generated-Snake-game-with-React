import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120; // Harsher, faster speed

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': case 's': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': case 'a': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': case 'd': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => { if (gameLoopRef.current) clearInterval(gameLoopRef.current); };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-black border-4 border-cyan relative">
      <div className="absolute top-0 right-0 bg-cyan text-black font-pixel text-[10px] px-2 py-1">
        PID: 0x9A4F
      </div>

      <div className="flex justify-between w-full items-center mt-4 border-b-2 border-magenta pb-2">
        <div className="font-pixel text-sm text-cyan">
          DATA_FRAGMENTS: <span className="text-magenta">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className={`font-pixel text-[10px] ${isPaused ? 'text-magenta flicker' : 'text-cyan'}`}>
          {isPaused ? 'PROCESS_HALTED' : 'RUNNING...'}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-magenta"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute ${i === 0 ? 'bg-magenta' : 'bg-cyan border border-black'}`}
            style={{
              width: '20px',
              height: '20px',
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-magenta flicker"
          style={{
            width: '20px',
            height: '20px',
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
          }}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
            <h2 
              className="text-2xl md:text-3xl font-pixel text-magenta mb-4 uppercase text-center glitch-text"
              data-text="FATAL_EXCEPTION"
            >
              FATAL_EXCEPTION
            </h2>
            <p className="text-cyan font-terminal text-3xl mb-8 uppercase">DATA_LOST: {score}</p>
            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-black border-2 border-cyan text-cyan font-pixel text-xs hover:bg-cyan hover:text-black transition-none uppercase"
            >
              [ REBOOT_SYSTEM ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

