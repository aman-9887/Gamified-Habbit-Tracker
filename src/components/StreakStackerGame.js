import React, { useState, useEffect } from 'react';

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToeHabitGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true); // true = user's turn
  const [winner, setWinner] = useState(null);

  // Check for winner whenever the board changes
  useEffect(() => {
    checkWinner(board);

    if (!isXTurn && !winner) {
      const timer = setTimeout(() => computerMove(), 500);
      return () => clearTimeout(timer);
    }
  }, [board, isXTurn]);

  const handleClick = (index) => {
    if (!isXTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X'; // User
    setBoard(newBoard);
    setIsXTurn(false);
  };

  const computerMove = () => {
    const available = board.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
    if (available.length === 0 || winner) return;

    const randomIndex = available[Math.floor(Math.random() * available.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = 'O'; // Computer
    setBoard(newBoard);
    setIsXTurn(true);
  };

  const checkWinner = (newBoard) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        setWinner(newBoard[a]);
        return;
      }
    }

    if (!newBoard.includes(null)) {
      setWinner('Draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
  };

  const getMarkerSymbol = (value) => {
    if (value === 'X') return '✅'; // Good habit
    if (value === 'O') return '❌'; // Bad habit
    return '';
  };

  const winnerMessage = () => {
    if (winner === 'X') return "🎉 You Win! Good Habits Triumph!";
    if (winner === 'O') return "😢 Computer Wins! Bad Habits Took Over!";
    if (winner === 'Draw') return "🤝 It's a Draw! Try again!";
    return `Your Turn: ${isXTurn ? '✅ Good Habit' : '🤖 Waiting for Computer'}`;
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-600 text-center">🧠 Habit Tracker: Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            disabled={Boolean(value) || winner}
            className="w-24 h-24 text-4xl bg-yellow-100 border-4 border-indigo-300 rounded-xl hover:bg-yellow-200 transition"
          >
            {getMarkerSymbol(value)}
          </button>
        ))}
      </div>
      <div className="text-xl font-semibold text-gray-800">
        {winnerMessage()}
      </div>
      <button
        onClick={resetGame}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
      >
        🔁 Restart Game
      </button>
    </div>
  );
}
