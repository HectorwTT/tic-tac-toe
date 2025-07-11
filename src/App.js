import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [mode, setMode] = useState('human'); // 'human' or 'computer'

  // Reset game and optionally set mode
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  };

  const resetGameAndSetMode = (newMode) => {
    setMode(newMode);
    resetGame();
  };

  // Handle human click
  const handleClick = (index) => {
    if (board[index] || getWinner(board)) return;
    if (mode === 'computer' && !isXTurn) return; // ignore clicks when computer's turn

    const newBoard = board.slice();
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);
  };

  // Computer move logic: picks random empty cell
  const makeComputerMove = () => {
    const emptyIndices = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter(idx => idx !== null);

    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    const newBoard = board.slice();
    newBoard[randomIndex] = 'O'; // computer always plays 'O'
    setBoard(newBoard);
    setIsXTurn(true);
  };

  // Trigger computer move when it's computer's turn
  useEffect(() => {
    if (mode === 'computer' && !isXTurn && !getWinner(board)) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500); // delay for better UX
      return () => clearTimeout(timer);
    }
  }, [board, isXTurn, mode]);

  // Get winner info
  const result = getWinner(board);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];

  const status = winner
    ? `🎉 Winner: ${winner}`
    : board.every(cell => cell !== null)
      ? "It's a draw!"
      : `Next Turn: ${isXTurn ? 'X' : 'O'}`;

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      <div className="mode-selection">
        <button
          className={mode === 'human' ? 'selected' : ''}
          onClick={() => resetGameAndSetMode('human')}
        >
          Play vs Human
        </button>
        <button
          className={mode === 'computer' ? 'selected' : ''}
          onClick={() => resetGameAndSetMode('computer')}
        >
          Play vs Computer
        </button>
      </div>

      <div className="status">{status}</div>

      <div className="board">
        {board.map((cell, i) => {
          const isWinningSquare = winningLine.includes(i);
          return (
            <button
              key={i}
              className={`square ${isWinningSquare ? 'winner' : ''}`}
              onClick={() => handleClick(i)}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <button className="restart-button" onClick={resetGame}>
        🔁 Restart Game
      </button>
    </div>
  );
}

function getWinner(cells) {
  const combos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let [a, b, c] of combos) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line: [a, b, c] };
    }
  }
  return null;
}

export default App;
