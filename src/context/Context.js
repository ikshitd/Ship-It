import React, { useState, useContext, createContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`http://localhost:3001/boards?userId=${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBoards(response.data);
        } catch (error) {
          console.error('Error fetching boards:', error);
        }
      };

      fetchData();
    }
  }, [userId]);

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

  function addBoard(name) {}

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

  function handleTaskHeadingUpdate(boardId, columnId, taskId, newHeading) {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: {
                ...board.tasks,
                [columnId]: board.tasks[columnId].map((task) =>
                  task.id === taskId ? { ...task, heading: newHeading } : task
                ),
              },
            }
          : board
      )
    );
  }

  function handlePriorityChange(boardId, columnId, taskId, newPriority) {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: {
                ...board.tasks,
                [columnId]: board.tasks[columnId].map((task) =>
                  task.id === taskId ? { ...task, priority: newPriority } : task
                ),
              },
            }
          : board
      )
    );
  }

  function handleStatusChange(boardId, columnId, taskId, newStatus) {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: {
                ...board.tasks,
                [columnId]: board.tasks[columnId].map((task) =>
                  task.id === taskId ? { ...task, status: newStatus } : task
                ),
              },
            }
          : board
      )
    );
  }
  const value = {
    userId,
    boards,
    selectedBoardId,
    updateTask,
    handleBoardClick,
    handleDateChange,
    handleDescriptionChange,
    updateBoard,
    handleTaskHeadingUpdate,
    handlePriorityChange,
    handleStatusChange,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
export const useAppContext = () => useContext(AppContext);
