import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import boardService from '../../service/boardService.js';
import { jwtDecode } from 'jwt-decode';

const details = {
  userId: null,
  boards: [],
  users: [],
  currentBoardId: null,
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

export const boardSlice = createSlice({
  name: 'board',
  initialState: details,
  reducers: {
    setCurrentBoardId: (state, action) => {
      state.currentBoardId = action.payload;
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
      });
  },
});

export const { setCurrentBoardId, setUsers } = boardSlice.actions;
export default boardSlice.reducer;
