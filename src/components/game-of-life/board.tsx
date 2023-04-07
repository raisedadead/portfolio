import React, { useState, useEffect } from 'react';
import Cell from './cell';

const numRows = 30;
const numCols = 30;
const interval = 100; // Time in milliseconds between generations

type Board = boolean[][];

const generateEmptyBoard = (): Board => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(false));
};

const generateRandomBoard = (): Board => {
  return Array.from({ length: numRows }, () =>
    Array.from({ length: numCols }, () => Math.random() > 0.7)
  );
};

const countNeighbors = (board: Board, row: number, col: number): number => {
  let count = 0;

  for (let r = -1; r <= 1; r++) {
    for (let c = -1; c <= 1; c++) {
      if (r === 0 && c === 0) continue;
      const newRow = row + r;
      const newCol = col + c;
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        count += board[newRow][newCol] ? 1 : 0;
      }
    }
  }

  return count;
};

const getNextGeneration = (board: Board): Board => {
  const newBoard: Board = generateEmptyBoard();

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const neighbors = countNeighbors(board, row, col);
      const isAlive = board[row][col];

      if (isAlive) {
        newBoard[row][col] = neighbors === 2 || neighbors === 3;
      } else {
        newBoard[row][col] = neighbors === 3;
      }
    }
  }

  return newBoard;
};

const Board: React.FC = () => {
  const [board, setBoard] = useState<Board>(generateRandomBoard());
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setBoard((prevBoard) => getNextGeneration(prevBoard));
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [isRunning]);

  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };

  const resetBoard = () => {
    setBoard(generateRandomBoard());
  };

  return (
    <div className='mx-auto content-center'>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className='flex'>
          {row.map((cell, colIndex) => (
            <Cell key={`${rowIndex}-${colIndex}`} alive={cell} />
          ))}
        </div>
      ))}
      <div className='mx-auto mb-2 mt-2 flex flex-row items-center justify-center space-x-2 space-y-0 p-4'>
        <button
          className='items-center rounded-md bg-orange-500 px-2 py-2 text-sm font-medium text-slate-100 backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-slate-500 md:px-4 md:py-2'
          onClick={toggleRunning}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button
          className='items-center rounded-md bg-orange-500 px-2 py-2 text-sm font-medium text-slate-100 backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-slate-500 md:px-4 md:py-2'
          onClick={resetBoard}
        >
          Reset
        </button>
        <button
          className='items-center rounded-md bg-orange-500 px-2 py-2 text-sm font-medium text-slate-100 backdrop-blur-sm hover:bg-orange-300 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-slate-500 md:px-4 md:py-2'
          onClick={() => {
            setBoard(getNextGeneration(board));
          }}
          disabled={isRunning}
        >
          Next Generation
        </button>
      </div>
    </div>
  );
};

export default Board;
