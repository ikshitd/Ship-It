import axios from 'axios';

// ================= User Details ================= //
const fetchUserDetails = async (userId) => {
  const token = sessionStorage.getItem('authToken');
  const response = await axios.get(`http://localhost:3001/get-user?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ================= Authentication ================= //
const register = async (user) => {
  const { name, email, password } = user;
  const response = await axios.post('http://localhost:3001/register', {
    name: name,
    email: email,
    password: password,
  });
  return response.data;
};

const login = async (user) => {
  const { email, password } = user;
  const response = await axios.post('http://localhost:3001/login', {
    email: email,
    password: password,
  });
  if (response.status === 200) {
    const { token } = response.data;
    sessionStorage.setItem('authToken', token);
  }
  return response.data;
};

const logout = async () => sessionStorage.removeItem('authToken');

const authService = {
  fetchUserDetails,
  register,
  login,
  logout,
};
export default authService;
