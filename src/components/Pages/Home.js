import React, { useState } from 'react';
import Board from '../Board/Board';

export default function App() {
  const [boards, updateBoards] = useState([
    {
      id: 'board-1',
      name: 'Board 1',
      tasks: {
        NOT_STARTED: [
          {
            id: 'task-1',
            heading: '[Advance Payment]: Implementing UpdatePaymentConfiguration API',
            assigneeId: 'Ikshit',
            startDate: new Date('2021-09-01'),
            dueDate: new Date('2021-10-10'),
            description: 'Something about the task here !!',
            priority: 'Low',
            status: 'At-Risk',
          },
          {
            id: 'task-2',
            heading: 'Another Payments',
            assigneeId: 'Some Radom User',
            startDate: new Date(),
            dueDate: new Date(),
            description: 'Something about the task here !!',
            priority: ' Low',
            status: 'At-Risk',
          },
        ],
        IN_PROGRESS: [],
        BLOCKED: [],
        DONE: [],
      },
    },
    {
      id: 'board-2',
      name: 'Board 2',
      tasks: {
        NOT_STARTED: [],
        IN_PROGRESS: [{ id: 'task-3', heading: 'Task 3', description: 'Description', status: 'Blocked' }],
        BLOCKED: [],
        DONE: [],
      },
    },
  ]);

  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId);
  };

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
