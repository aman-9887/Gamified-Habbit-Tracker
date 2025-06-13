import React, { useState, useEffect, useRef } from "react";

const TikTakGame = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const successAudio = useRef(null);

  useEffect(() => {
    if (!isUserTurn && !winner) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, board, winner]);

  useEffect(() => {
    if (winner === "✅" && successAudio.current) {
      successAudio.current.play();
    }
  }, [winner]);

  const handleClick = (index) => {
    if (winner) return;

    const cell = board[index];

    if (!cell) {
      const barrier = Math.random() < 0.2 ? 1 : 0;
      const newBoard = [...board];
      newBoard[index] = { player: "✅", barrier };
      setBoard(newBoard);

      const win = calculateWinner(newBoard.map((c) => (c ? c.player : null)));
      if (win) {
        setWinner(win);
      } else {
        setIsUserTurn(false);
      }
    } else if (cell.player === "✅" && cell.barrier === 1) {
      const newBoard = [...board];
      newBoard[index] = { player: "✅", barrier: 0 };
      setBoard(newBoard);
    } else if (cell.player === "❌" && cell.barrier === 1) {
      const newBoard = [...board];
      newBoard[index] = { player: "❌", barrier: 0 };
      setBoard(newBoard);
      setIsUserTurn(false);
    } else {
      return;
    }
  };

  const makeComputerMove = () => {
    const newBoard = [...board];
    const emptyIndices = newBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((i) => i !== null);

    if (emptyIndices.length === 0) return;

    const shouldSkipBlock = Math.random() < 0.2;

    let moveIndex = findWinningMove(newBoard, "❌");

    if (!moveIndex && !shouldSkipBlock) {
      moveIndex = findWinningMove(newBoard, "✅");
    }

    if (moveIndex === null || moveIndex === undefined) {
      const randIdx = Math.floor(Math.random() * emptyIndices.length);
      moveIndex = emptyIndices[randIdx];
    }

    const barrier = Math.random() < 0.2 ? 1 : 0;

    newBoard[moveIndex] = { player: "❌", barrier };

    setBoard(newBoard);

    const win = calculateWinner(newBoard.map((c) => (c ? c.player : null)));
    if (win) {
      setWinner(win);
    } else {
      setIsUserTurn(true);
    }
  };

  const findWinningMove = (boardArr, player) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      const lineCells = [boardArr[a], boardArr[b], boardArr[c]];
      const players = lineCells.map((cell) => (cell ? cell.player : null));

      if (
        players.filter((p) => p === player).length === 2 &&
        players.includes(null)
      ) {
        const emptyIndex = line.find((idx) => !boardArr[idx]);
        return emptyIndex;
      }
    }
    return null;
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return squares[a];
    }
    if (!squares.includes(null)) return "Draw";
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsUserTurn(true);
    setWinner(null);
  };

  const status = winner
    ? winner === "✅"
      ? "🎉 You Win! Good Habits Win!"
      : winner === "❌"
      ? "😢 Computer Wins! Try Again!"
      : "🤝 It's a Draw!"
    : `Your Turn: ✅`;

  return (
    <div style={styles.container}>
      <h2 style={styles.status}>{status}</h2>

      {/* Falling Sparkler animation when user wins */}
      {winner === "✅" && <FallingSparklers />}

      <div style={styles.board}>
        {board.map((cell, index) => {
          const value = cell ? cell.player : null;
          const barrier = cell ? cell.barrier : 0;
          return (
            <div
              key={index}
              style={{
                ...styles.square,
                backgroundColor:
                  value === "✅"
                    ? "#4ade80"
                    : value === "❌"
                    ? "#f87171"
                    : "#1e293b",
                border: barrier ? "3px solid #fbbf24" : "none",
                transform: value ? "scale(1.1)" : "scale(1)",
                transition: "all 0.3s ease-in-out",
                position: "relative",
              }}
              onClick={() => handleClick(index)}
              className="square"
            >
              <span style={{ animation: value ? "pop 0.3s ease" : "none" }}>
                {value}
              </span>
              {barrier ? (
                <span
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    width: 14,
                    height: 14,
                    backgroundColor: "#fbbf24",
                    borderRadius: "50%",
                    boxShadow: "0 0 6px #fbbf24",
                  }}
                  title="Barrier"
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <button onClick={resetGame} style={styles.resetBtn}>
        🔁 Reset Game
      </button>

      <audio ref={successAudio} src="/success.mp3" preload="auto" />

      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }

          .square:hover {
            box-shadow: 0 0 10px #fbbf24;
            cursor: pointer;
          }

          @keyframes fall {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

// Falling sparklers/confetti effect
const FallingSparklers = () => {
  const count = 30;
  const sparklers = [];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 8 + 6; // size 6 to 14 px
    const left = Math.random() * 100; // vw %
    const delay = Math.random() * 5; // seconds delay
    const duration = 3 + Math.random() * 3; // 3-6 seconds fall duration
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`; // random bright color

    const style = {
      position: "fixed",
      top: "-10vh",
      left: `${left}vw`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: "50%",
      filter: "drop-shadow(0 0 5px " + color + ")",
      animation: `fall ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: "none",
      zIndex: 9999,
      opacity: 0.9,
    };

    sparklers.push(<div key={i} style={style} />);
  }

  return <>{sparklers}</>;
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "0px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    overflow: "visible",
  },
  status: {
    fontSize: "25px",
    marginBottom: "10px",
    color: "#facc15",
    fontWeight: "bold",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 100px)",
    gap: "15px",
    justifyContent: "center",
    padding: "10px",
    position: "relative",
    zIndex: 1,
  },
  square: {
    width: "80px",
    height: "90px",
    fontSize: "36px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(255,255,255,0.2)",
    userSelect: "none",
  },
  resetBtn: {
    marginTop: "20px",
    padding: "10px 25px",
    fontSize: "18px",
    backgroundColor: "#334155",
    color: "#f8fafc",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
};

export default TikTakGame;
