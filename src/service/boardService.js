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

const boardService = {
  fetchBoards,
  fetchUsers,
  addBoard,
};

export default boardService;
