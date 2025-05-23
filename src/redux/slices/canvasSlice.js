import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import canvasService from '../../service/canvasService.js';

const initialState = {
  projectCanvases: [],
  selectedProjectCanvas: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: null,
};

// FETCH PROJECT-CANVAS DETAILS //
export const fetchProjectCanvases = createAsyncThunk(
  'canvas/fetchProjectCanvases',
  async (userId, thunkAPI) => {
    try {
      return await canvasService.fetchProjectCanvases(userId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.error);
    }
  }
);

export const addProjectCanvas = createAsyncThunk(
  'canvas/add-project-canvas',
  async (addCanvasDetails, thunkAPI) => {
    const { userId, canvasName } = addCanvasDetails;
    try {
      return await canvasService.addProjectCanvas(userId, canvasName);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.error);
    }
  }
);

export const addNode = createAsyncThunk('canvas/addNode', async (nodeDetails, thunkAPI) => {
  try {
    const { projectCanvasId, heading, description, priority, x, y, type } = nodeDetails;
    return await canvasService.addNode(projectCanvasId, heading, description, priority, x, y, type);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

export const addEdge = createAsyncThunk('canvas/addEdge', async (edgeDetails, thunkAPI) => {
  try {
    const { source, target, animated, label, type, projectCanvasId } = edgeDetails;
    return await canvasService.addEdge(source, target, animated, label, type, projectCanvasId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

export const updateEdge = createAsyncThunk('canvas/update-edge', async (edgeDetails, thunkAPI) => {
  try {
    return await canvasService.updateEdge(edgeDetails);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.error);
  }
});

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
      state.isSuccess = false;
    },
    setSelectedProjectCanvas: (state, action) => {
      state.selectedProjectCanvas = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectCanvases.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjectCanvases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectCanvases = action.payload;
      })
      .addCase(fetchProjectCanvases.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNode.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addNode.fulfilled, (state, action) => {
        state.selectedProjectCanvas.nodes = [...state.selectedProjectCanvas.nodes, action.payload];
        state.isLoading = false;
      })
      .addCase(addNode.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addEdge.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addEdge.fulfilled, (state, action) => {
        state.selectedProjectCanvas.edges = [...state.selectedProjectCanvas.edges, action.payload];
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addEdge.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(updateEdge.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateEdge.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(updateEdge.fulfilled, (state, action) => {
        const updatedEdge = action.payload;
        state.selectedProjectCanvas.edges = state.selectedProjectCanvas.edges.map((edge) => [
          edge.id == updatedEdge.id ? { ...edge, ...updatedEdge } : edge,
        ]);
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addProjectCanvas.fulfilled, (state, action) => {
        const addedProjectCanvas = action.payload.projectCanvas;
        state.projectCanvases = [...state.projectCanvases, addedProjectCanvas];
      })
      .addCase(addProjectCanvas.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addProjectCanvas.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
      });
  },
});

export const { reset, setSelectedProjectCanvas } = canvasSlice.actions;
export default canvasSlice.reducer;
