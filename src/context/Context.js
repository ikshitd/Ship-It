import React, { useState, useContext, createContext } from 'react';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [boards, setBoards] = useState([
    {
      id: 1,
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
        DONE: [
          {
            id: 'task-3',
            heading: 'Advance Payments',
            assigneeId: 'user_id',
            startDate: Date(),
            dueDate: Date(),
            description: 'Something about the task here !!',
            priority: 'Low',
            status: 'At-Risk',
          },
        ],
      },
    },
    {
      id: 2,
      name: 'Board 2',
      tasks: {
        NOT_STARTED: [],
        DONE: [],
      },
    },
  ]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  function handleDescriptionChange(boardId, columnId, taskId, newDescription) {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: {
                ...board.tasks,
                [columnId]: board.tasks[columnId].map((task) =>
                  task.id === taskId ? { ...task, description: newDescription } : task
                ),
              },
            }
          : board
      )
    );
  }

  function handleDateChange(boardId, columnId, taskId, field, date) {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: {
                ...board.tasks,
                [columnId]: board.tasks[columnId].map((task) =>
                  task.id === taskId ? { ...task, [field]: date ? date.toISOString() : null } : task
                ),
              },
            }
          : board
      )
    );
  }

  function updateTask(boardId, taskId, updatedTask) {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
            }
          : board
      )
    );
  }

  function handleBoardClick(boardId) {
    setSelectedBoardId(boardId);
  }

  function addBoard(name) {
    const newBoard = {
      id: boards.length + 1,
      name,
      tasks: { NOT_STARTED: [], IN_PROGRESS: [], BLOCKED: [], DONE: [] },
    };
    setBoards([...boards, newBoard]);
    setSelectedBoardId(newBoard.id);
  }

  function updateBoard(board, source, destination, sourceColumn, destinationColumn) {
    setBoards((prevBoards) =>
      prevBoards.map((boardItem) =>
        boardItem.id === board.id
          ? {
              ...boardItem,
              tasks: {
                ...boardItem.tasks,
                [source.droppableId]: sourceColumn,
                [destination.droppableId]: destinationColumn,
              },
            }
          : boardItem
      )
    );
  }

  const value = {
    boards,
    selectedBoardId,
    updateTask,
    handleBoardClick,
    handleDateChange,
    handleDescriptionChange,
    updateBoard,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
export const useAppContext = () => useContext(AppContext);
