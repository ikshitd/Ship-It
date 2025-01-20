import React, { useState, useContext, createContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import socket from '../socket/socket.js';

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

  useEffect(() => {
    socket.on('boardAdded', (addedBoard) => {
      const { boardId, board } = addedBoard;
      setBoards((prevBoards) => [...prevBoards, { id: boardId, ...board }]);
    });
    return () => {
      socket.off('boardAdded');
    };
  }, []);

  async function updateTask(boardId, taskId, updatedDetails) {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3001/update-task',
        {
          boardId: boardId,
          taskId: taskId,
          taskDetails: updatedDetails,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Unable to update the task', err);
      throw err;
    }
  }

  async function removeTask(boardId, taskId) {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3001/remove-task',
        {
          boardId: boardId,
          taskId: taskId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Unable to update the task', err);
      throw err;
    }
  }

  async function addBoard(boardName) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:3001/add-board',
        {
          userId: userId,
          boardName: boardName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.board;
    } catch (err) {
      console.error('Unable to add the board', err);
      throw err;
    }
  }

  function handleBoardClick(boardId) {
    setSelectedBoardId(boardId);
  }

  const value = {
    userId,
    boards,
    selectedBoardId,
    updateTask,
    handleBoardClick,
    removeTask,
    addBoard,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
export const useAppContext = () => useContext(AppContext);
