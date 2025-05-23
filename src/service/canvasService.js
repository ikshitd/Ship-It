import axios from 'axios';

// ============= PROJECT-CANVAS =============
const fetchProjectCanvases = async (userId) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.get(`http://localhost:3001/get-project-canvases?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const addProjectCanvas = async (userId, name) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.post(
    'http://localhost:3001/add-project-canvas',
    {
      userId,
      name,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// ============= NODES =============
const fetchNodes = async () => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.get('http://localhost:3001/get-nodes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const addNode = async (projectCanvasId, heading, description, priority, x, y, type) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.post(
    'http://localhost:3001/add-node',
    {
      projectCanvasId,
      heading,
      description,
      priority,
      x,
      y,
      type,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// ============= EDGES =============
const fetchEdges = async () => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.get('http://localhost:3001/get-edges', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const addEdge = async (source, target, animated, label, type, projectCanvasId) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.post(
    'http://localhost:3001/add-edge',
    {
      source,
      target,
      animated,
      label,
      type,
      projectCanvasId,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const updateEdge = async (edgeDetails) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.post(
    'http://localhost:3001/add-edge',
    {
      edgeDetails: edgeDetails,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const canvasService = {
  fetchProjectCanvases,
  addProjectCanvas,
  fetchNodes,
  addNode,
  fetchEdges,
  addEdge,
  updateEdge,
};
export default canvasService;
