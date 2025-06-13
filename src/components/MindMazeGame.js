import React, { useState, useEffect, useRef } from "react";
import "./MindMazeGame.css";

// SparkleCelebration component inside the same file
const SparkleCelebration = () => {
  const sparkles = Array.from({ length: 30 });

  return (
    <div style={styles.sparkleCelebration}>
      {sparkles.map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.sparkle,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

const styles = {
  sparkleCelebration: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    overflow: "visible",
    zIndex: 9999,
  },
  sparkle: {
    position: "absolute",
    top: "-10px",
    width: "6px",
    height: "6px",
    background:
      "radial-gradient(circle, #ffec8b 0%, #ffd700 60%, transparent 80%)",
    filter: "drop-shadow(0 0 5px #ffd700)",
    borderRadius: "50%",
    animationName: "sparkleFall",
    animationDuration: "4s",
    animationTimingFunction: "ease-in",
    animationIterationCount: "infinite",
    animationFillMode: "forwards",
    opacity: 0.8,
  },
};

// Add keyframes for sparkle-fall animation dynamically
const addKeyframes = () => {
  const styleSheet = document.styleSheets[0];
  const keyframes =
    `@keyframes sparkleFall {
      0% {
        transform: translateY(0) scale(1);
        opacity: 0.8;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) scale(0.3);
        opacity: 0;
      }
    }`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
};

addKeyframes();

// Words to find
const WORDS_TO_FIND = [
  "FOCUS",
  "SLEEP",
  "STREAK",
  "MINDFUL",
  "EXERCISE",
  "HABIT",
  "MEDITATE",
  "ROUTINE",
  "WATER",
  "READING",
  "WORKOUT",
  "BREATH",
  "JOURNAL",
];

const gridSize = 12;

const createEmptyGrid = () => {
  return Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null));
};

const canPlaceWord = (grid, word, x, y, direction) => {
  if (direction === "horizontal") {
    if (x + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid[y][x + i];
      if (cell !== null && cell !== word[i]) return false;
    }
  } else if (direction === "vertical") {
    if (y + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = grid[y + i][x];
      if (cell !== null && cell !== word[i]) return false;
    }
  }
  return true;
};

const placeWord = (grid, word, x, y, direction) => {
  if (direction === "horizontal") {
    for (let i = 0; i < word.length; i++) {
      grid[y][x + i] = word[i];
    }
  } else if (direction === "vertical") {
    for (let i = 0; i < word.length; i++) {
      grid[y + i][x] = word[i];
    }
  }
};

const fillEmptyCells = (grid) => {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] === null) {
        grid[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
  return grid;
};

const generatePuzzleGrid = () => {
  let grid = createEmptyGrid();

  for (let word of WORDS_TO_FIND) {
    let placed = false;
    let tries = 0;
    while (!placed && tries < 100) {
      tries++;
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(grid, word, x, y, direction)) {
        placeWord(grid, word, x, y, direction);
        placed = true;
      }
    }
    if (!placed) {
      placeWord(grid, word, 0, 0, "horizontal");
    }
  }

  grid = fillEmptyCells(grid);
  return grid;
};

const MindMazeGame = () => {
  const [grid, setGrid] = useState(generatePuzzleGrid());
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);

  // Refs for sounds
  const successSoundRef = useRef(null);
  const failSoundRef = useRef(null);

  const handleReset = () => {
    setGrid(generatePuzzleGrid());
    setSelectedCells([]);
    setFoundWords([]);
    setIsGameWon(false);
  };

  const toggleSelectCell = (x, y) => {
    if (isCellFound(x, y)) return;

    const exists = selectedCells.some((cell) => cell.x === x && cell.y === y);
    if (exists) {
      setSelectedCells(selectedCells.filter((cell) => !(cell.x === x && cell.y === y)));
    } else {
      setSelectedCells([...selectedCells, { x, y }]);
    }
  };

  const getCurrentWord = () => {
    return selectedCells.map(({ x, y }) => grid[y][x]).join("");
  };

  const handleSubmit = () => {
    const word = getCurrentWord();
    if (WORDS_TO_FIND.includes(word) && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setSelectedCells([]);
      successSoundRef.current?.play();
    } else {
      failSoundRef.current?.play();
      alert("Not a valid word!");
    }
  };

  useEffect(() => {
    if (foundWords.length === WORDS_TO_FIND.length) {
      setIsGameWon(true);
    }
  }, [foundWords]);

  const isCellFound = (x, y) => {
    for (let word of foundWords) {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (
            col + word.length <= gridSize &&
            grid[row].slice(col, col + word.length).join("") === word
          ) {
            if (y === row && x >= col && x < col + word.length) return true;
          }
          if (row + word.length <= gridSize) {
            let verticalWord = "";
            for (let k = 0; k < word.length; k++) {
              verticalWord += grid[row + k][col];
            }
            if (verticalWord === word) {
              if (x === col && y >= row && y < row + word.length) return true;
            }
          }
        }
      }
    }
    return false;
  };

  const isCellSelected = (x, y) =>
    selectedCells.some((cell) => cell.x === x && cell.y === y);

  return (
    <div className="mindmaze-layout">
      <audio ref={successSoundRef} src="/success.mp3" preload="auto" />
      <audio ref={failSoundRef} src="/match.wav" preload="auto" />

      <div className="word-box">
        <h3>📝 Words to Find:</h3>
        <ul>
          {WORDS_TO_FIND.map((word) => (
            <li key={word} className={foundWords.includes(word) ? "found" : ""}>
              {word}
            </li>
          ))}
        </ul>
        <button onClick={handleReset} className="btn-hover-animate" style={{ marginTop: "15px" }}>
          🔄 Reset
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedCells.length === 0}
          className="btn-hover-animate"
          style={{ marginTop: "10px" }}
        >
          ✅ Submit Selection
        </button>
      </div>

      <div className="maze-container">
        <h2>🧩MIND MAZE</h2>
        {isGameWon && (
          <>
            <h3 className="win-message animate-win">🎉 You found all the words!</h3>
            <SparkleCelebration />
          </>
        )}
        <div className="maze-grid">
          {grid.map((row, y) =>
            row.map((letter, x) => (
              <div
                key={`${x}-${y}`}
                className={`maze-cell ${
                  isCellSelected(x, y)
                    ? "selected animate-scale"
                    : isCellFound(x, y)
                    ? "found animate-pulse"
                    : ""
                }`}
                onClick={() => toggleSelectCell(x, y)}
              >
                {letter}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMazeGame;
