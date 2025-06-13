import React, { useState, useEffect, useRef } from 'react';
import './HabitCrushGame.css';

const width = 8;
const candyColors = ['red', 'yellow', 'green', 'blue', 'orange', 'purple'];
const barrierSymbol = 'barrier';

const getRandomCandy = () => candyColors[Math.floor(Math.random() * candyColors.length)];

const generateBoard = () => {
  const board = [];

  for (let i = 0; i < width * width; i++) {
    board.push(getRandomCandy());
  }

  const barrierPositions = new Set();
  while (barrierPositions.size < 2) {
    const idx = Math.floor(Math.random() * board.length);
    barrierPositions.add(idx);
  }

  barrierPositions.forEach(idx => {
    const color = getRandomCandy();
    board[idx] = {
      type: barrierSymbol,
      durability: 2 + Math.floor(Math.random() * 2),
      color: color,
    };
  });

  return board;
};

const HabitCrushGame = () => {
  const [grid, setGrid] = useState([]);
  const [selectedChain, setSelectedChain] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(35);
  const [victory, setVictory] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [toolUses, setToolUses] = useState({ hammer: 3, swap: 3 });

  const dragColor = useRef(null);
  const matchSound = useRef(null);
  const barrierBreakSound = useRef(null);

  useEffect(() => {
    setGrid(generateBoard());
    matchSound.current = new Audio('/match.wav');
    barrierBreakSound.current = new Audio('/smash.mp3');
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      let changed = false;
      const updated = [...grid];

      let didFall = false;
      do {
        didFall = false;
        for (let col = 0; col < width; col++) {
          for (let row = width - 2; row >= 0; row--) {
            const idx = row * width + col;
            const belowIdx = idx + width;
            if (updated[idx] !== null && updated[belowIdx] === null) {
              updated[belowIdx] = updated[idx];
              updated[idx] = null;
              changed = true;
              didFall = true;
            }
          }
        }
      } while (didFall);

      for (let col = 0; col < width; col++) {
        const idx = col;
        if (updated[idx] === null) {
          updated[idx] = getRandomCandy();
          changed = true;
        }
      }

      if (changed) setGrid(updated);
    }, 300);

    return () => clearInterval(timer);
  }, [grid]);

  const areAdjacent = (a, b) => {
    const rowA = Math.floor(a / width);
    const rowB = Math.floor(b / width);
    return (
      (b === a - 1 && rowA === rowB) ||
      (b === a + 1 && rowA === rowB) ||
      b === a - width ||
      b === a + width
    );
  };

  const clearMatches = (matchesSet) => {
    if (movesLeft <= 0) return;

    const newGrid = [...grid];
    let barrierBroken = false;

    matchesSet.forEach(i => {
      const cell = grid[i];
      if (cell && typeof cell !== 'object') {
        newGrid[i] = null;
      }
    });

    for (let i = 0; i < newGrid.length; i++) {
      const cell = newGrid[i];
      if (cell && typeof cell === 'object' && cell.type === barrierSymbol) {
        const neighbors = [i - 1, i + 1, i - width, i + width].filter(n => n >= 0 && n < width * width);
        const hits = neighbors.filter(n => matchesSet.has(n) && typeof grid[n] !== 'object' && grid[n] === cell.color);
        if (hits.length > 0) {
          const newDurability = cell.durability - hits.length;
          if (newDurability <= 0) {
            newGrid[i] = null;
            barrierBroken = true;
          } else {
            newGrid[i] = { ...cell, durability: newDurability };
          }
        }
      }
    }

    setGrid(newGrid);
    setScore(s => s + matchesSet.size);
    setMovesLeft(m => Math.max(0, m - 1));

    if (matchesSet.size > 0) matchSound.current?.play();
    if (barrierBroken) barrierBreakSound.current?.play();

    const anyBarrierLeft = newGrid.some(cell => cell && typeof cell === 'object' && cell.type === barrierSymbol);
    if (!anyBarrierLeft) {
      setVictory(true);
    }
  };

  const applyTool = (index) => {
    if (!activeTool) return;
    if (toolUses[activeTool] <= 0) {
      alert(`No more uses left for ${activeTool}!`);
      setActiveTool(null);
      return;
    }

    const cell = grid[index];
    if (!cell) return;

    if (activeTool === 'hammer') {
      if (typeof cell === 'object' && cell.type === barrierSymbol) {
        alert('Hammer cannot break barriers!');
        setActiveTool(null);
        return;
      }
      const newGrid = [...grid];
      newGrid[index] = null;
      setGrid(newGrid);
    } else if (activeTool === 'swap') {
      if (typeof cell === 'object' && cell.type === barrierSymbol) {
        alert('Cannot swap barriers!');
        setActiveTool(null);
        return;
      }
      const newGrid = [...grid];
      newGrid[index] = getRandomCandy();
      setGrid(newGrid);
    }

    setToolUses(u => ({
      ...u,
      [activeTool]: u[activeTool] - 1,
    }));
    setActiveTool(null);
    setMovesLeft(m => Math.max(0, m - 1));
  };

  const handleMouseDown = (index) => {
    if (activeTool) return;
    const cell = grid[index];
    if (!cell || typeof cell === 'object') return;
    dragColor.current = cell;
    setSelectedChain([index]);
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const target = e.target;
    if (!target.classList.contains('cell')) return;

    const idx = parseInt(target.dataset.idx);
    if (selectedChain.includes(idx)) return;
    if (!areAdjacent(selectedChain[selectedChain.length - 1], idx)) return;

    const cell = grid[idx];
    if (!cell || typeof cell === 'object') return;
    if (cell !== dragColor.current) return;

    setSelectedChain(prev => [...prev, idx]);
  };

  const handleMouseUp = () => {
    if (dragging && selectedChain.length >= 2) {
      clearMatches(new Set(selectedChain));
    }
    setDragging(false);
    setSelectedChain([]);
    dragColor.current = null;
  };

  const handleTouchStart = (e) => {
    if (activeTool) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target || !target.classList.contains('cell')) return;

    const idx = parseInt(target.dataset.idx);
    const cell = grid[idx];
    if (!cell || typeof cell === 'object') return;

    dragColor.current = cell;
    setSelectedChain([idx]);
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!target || !target.classList.contains('cell')) return;

    const idx = parseInt(target.dataset.idx);
    if (selectedChain.includes(idx)) return;
    if (!areAdjacent(selectedChain[selectedChain.length - 1], idx)) return;

    const cell = grid[idx];
    if (!cell || typeof cell === 'object') return;
    if (cell !== dragColor.current) return;

    setSelectedChain(prev => [...prev, idx]);
  };

  const handleTouchEnd = () => {
    if (dragging && selectedChain.length >= 2) {
      clearMatches(new Set(selectedChain));
    }
    setDragging(false);
    setSelectedChain([]);
    dragColor.current = null;
  };

  return (
    <div
      className="habit-crush-game"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="header">
        <h2>🧠 HABIT CRUSH</h2>
        <div className="status-bar">
          <div className="score">Habits Crushed: {score}</div>
          <div className="moves-left">Daily Actions Left: {movesLeft}</div>
          <div className="tools-left">
            🔨 Hammer left: {toolUses.hammer} &nbsp; 🔄 Swap left: {toolUses.swap}
          </div>
        </div>
      </div>

      <div className="toolbox">
        <button
          onClick={() => setActiveTool('hammer')}
          className={activeTool === 'hammer' ? 'active-tool' : ''}
          disabled={toolUses.hammer <= 0}
        >
          🔨 Use Hammer
        </button>
        <button
          onClick={() => setActiveTool('swap')}
          className={activeTool === 'swap' ? 'active-tool' : ''}
          disabled={toolUses.swap <= 0}
        >
          🔄 Use Swap
        </button>
        <button onClick={() => setActiveTool(null)} disabled={!activeTool}>
          ❌ Cancel Tool
        </button>
      </div>

      <div className="grid" style={{ userSelect: 'none' }}>
        {grid.map((cell, index) => {
          const isSelected = selectedChain.includes(index);
          const isBarrier = cell && typeof cell === 'object' && cell.type === barrierSymbol;
          const color = isBarrier ? cell.color : cell;

          return (
            <div
              key={index}
              className={`cell ${color} ${isBarrier ? 'barrier' : ''} ${isSelected ? 'selected' : ''}`}
              data-idx={index}
              onMouseDown={() => activeTool ? applyTool(index) : handleMouseDown(index)}
              onTouchStart={(e) => activeTool ? applyTool(index) : handleTouchStart(e)}
            >
              {isBarrier ? cell.durability : ''}
            </div>
          );
        })}
      </div>

      {movesLeft === 0 && !victory && (
        <div className="game-over">
          <h3>🌅 Day Over!</h3>
          <p>You did your best today. Start fresh and crush more bad habits tomorrow!</p>
          <button
            onClick={() => {
              setGrid(generateBoard());
              setScore(0);
              setMovesLeft(35);
              setToolUses({ hammer: 3, swap: 3 });
              setVictory(false);
            }}
          >
            Start New Day
          </button>
        </div>
      )}

      {victory && (
        <div className="victory-overlay">
          <div className="victory-message">
            🎉 Congratulations! You cracked all the barriers and crushed all habits!
            <button
              onClick={() => {
                setGrid(generateBoard());
                setScore(0);
                setMovesLeft(35);
                setToolUses({ hammer: 3, swap: 3 });
                setVictory(false);
              }}
            >
              Play Again
            </button>
          </div>
          <div className="sparkles-container">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="sparkle"
                style={{
                  top: `${Math.random() * 100}vh`,
                  left: `${Math.random() * 100}vw`,
                  animationDelay: `${Math.random() * 1500}ms`,
                  animationDuration: `${1200 + Math.random() * 600}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCrushGame;
