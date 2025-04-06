import axios from 'axios';

const fetchBoards = async (userId) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.get(`http://localhost:3001/boards?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchUsers = async (currentBoardId) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.get(`http://localhost:3001/get-users?boardId=${currentBoardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.boardUsers.users;
};

const addBoard = async (userId, boardName) => {
  const token = sessionStorage.getItem('authToken');
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
};

const addTask = async (userId, boardId, category, updatedTaskDetails) => {
  const response = await axios.post(
    'http://localhost:3001/add-task',
    {
      userId: userId,
      boardId: boardId,
      columnId: category,
      taskDetails: updatedTaskDetails,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
      },
    }
  );
  return response.data.task;
};

const updateTask = async (boardId, taskId, updatedDetails) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.post(
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
  return response.data.task;
};

const removeTask = async (boardId, taskId) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.post(
    'http://localhost:3001/remove-task',
    {
      boardId: boardId,
      taskId: taskId,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.details;
};

const fetchComments = async (taskId) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.get(`http://localhost:3001/fetch-comments?taskId=${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.comments;
};

const boardService = {
  fetchBoards,
  fetchUsers,
  addBoard,

  addTask,
  updateTask,
  removeTask,

  fetchComments,
};

export default boardService;
