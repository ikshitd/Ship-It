import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../service/authService.js';

// WORK IN PROGRESS.... //
// TODO: FIGURE HOW TO CHECK IF THE USER IS ALREADY LOGGED IN //

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// FETCH USER DETAILS //
export const fetchUserDetails = createAsyncThunk('auth/fetchUserDetails', async (userId, thunkAPI) => {
  try {
    return await authService.fetchUserDetails(userId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

// REGISTER USER //
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

// LOGIN USER //
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

// LOGOUT USER //
export const logout = createAsyncThunk('auth/logout', async () => {
  return await authService.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        console.log(action.payload.user);
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
