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

const fetchTask = async (taskId) => {
  const response = await axios.get(`http://localhost:3001/fetch-task?taskId=${taskId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
    },
  });
  return response.data.task;
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

const addComment = async (commentDetails) => {
  const { content, taskId, userId } = commentDetails;
  const token = sessionStorage.getItem('authToken');
  const response = await axios.post(
    `http://localhost:3001/add-comment`,
    {
      content,
      taskId,
      userId,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.addedComment;
};

const boardService = {
  fetchBoards,
  fetchUsers,
  addBoard,

  fetchTask,
  addTask,
  updateTask,
  removeTask,

  fetchComments,
  addComment,
};

export default boardService;
