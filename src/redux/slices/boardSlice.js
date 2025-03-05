import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import boardService from '../../service/boardService.js';
import { jwtDecode } from 'jwt-decode';

const details = {
  userId: null,
  boards: [],
  users: [],
  currentBoardId: null,
  selectedBoard: null,
  isLoading: false,
  message: null,
};

const token = sessionStorage.getItem('authToken');
if (token) {
  details.userId = jwtDecode(token).userId;
}

export const fetchUsers = createAsyncThunk('board/fetchUsers', async (currentBoardId, thunkAPI) => {
  try {
    return await boardService.fetchUsers(currentBoardId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

// ================= Board Updates ================= //
export const fetchBoards = createAsyncThunk('board/fetchBoards', async (thunkAPI) => {
  try {
    return await boardService.fetchBoards(details.userId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

export const addBoard = createAsyncThunk('board/addBoard', async (boardName, thunkAPI) => {
  try {
    return await boardService.addBoard(details.userId, boardName);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

// ================= Task Updates ================= //
export const addTask = createAsyncThunk('board/addTask', async (addTaskDetails, thunkAPI) => {
  const { userId, boardId, category, updatedTaskDetails } = addTaskDetails;
  try {
    return await boardService.addTask(userId, boardId, category, updatedTaskDetails);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

export const updateTask = createAsyncThunk('board/updateTask', async (updatedDetails, thunkAPI) => {
  const { boardId, taskId, updatedTaskDetails } = updatedDetails;
  try {
    return await boardService.updateTask(boardId, taskId, updatedTaskDetails);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

export const removeTask = createAsyncThunk('board/removeTask', async (taskDetails, thunkAPI) => {
  const { boardId, taskId } = taskDetails;
  try {
    return await boardService.removeTask(boardId, taskId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

export const boardSlice = createSlice({
  name: 'board',
  initialState: details,
  reducers: {
    setCurrentBoardId: (state, action) => {
      state.currentBoardId = action.payload;
    },
    setSelectedBoard: (state, action) => {
      state.selectedBoard = action.payload;
    },
    setUsers: async (state, action) => {
      state.users = await boardService.fetchUsers(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.message = action.error;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.isLoading = false;
        state.users = [];
      })
      .addCase(addBoard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBoard.fulfilled, (state, action) => {
        state.boards = [...state.boards, action.payload];
        state.isLoading = false;
      })
      .addCase(addBoard.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBoard.tasks = [...state.selectedBoard.tasks, action.payload];
        state.boards = state.boards.map((board) =>
          board.id === action.payload.boardId ? { ...board, tasks: [...board.tasks, action.payload] } : board
        );
      })
      .addCase(addTask.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(removeTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const { boardId, taskId } = action.payload;
        state.isLoading = false;
        state.selectedBoard.tasks = state.selectedBoard.tasks.filter((task) => task.id !== taskId);
        state.boards = state.boards.map((board) =>
          board.id === boardId ? { ...board, tasks: board.tasks.filter((task) => task.id !== taskId) } : board
        );
      })
      .addCase(removeTask.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedTask = action.payload;
        const taskId = updatedTask.id;
        const boardId = updatedTask.boardId;
        state.selectedBoard.tasks = state.selectedBoard.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        );
        state.boards = state.boards.map((board) =>
          board.id === boardId
            ? {
                ...board,
                tasks: board.tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)),
              }
            : board
        );
      })
      .addCase(updateTask.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setCurrentBoardId, setSelectedBoard, setUsers } = boardSlice.actions;
export default boardSlice.reducer;
