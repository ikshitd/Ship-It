import React from 'react';
import { useAppContext } from '../../context/Context';
import Board from '../Board/Board';

export default function App() {
  const { boards, handleBoardClick, selectedBoardId } = useAppContext();
  return (
    <div>
      <h1>Task Boards</h1>
      <div>
        {boards.map((board) => (
          <button key={board.id} onClick={() => handleBoardClick(board.id)}>
            {board.name}
          </button>
        ))}
      </div>
      {selectedBoardId && <Board board={boards.find((board) => board.id === selectedBoardId)} />}
    </div>
  );
}
