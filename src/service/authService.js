import axios from 'axios';

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
  register,
  login,
  logout,
};
export default authService;
