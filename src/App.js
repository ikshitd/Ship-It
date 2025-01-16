import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Pages/Login.js';
import Register from './components/Pages/Register.js';
import Home from './components/Pages/Home.js';
import Navbar from './components/Bar/Navbar.js';
import { AppContextProvider } from '../src/context/Context.js';

export default function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
        <Navbar />
      </Router>
    </AppContextProvider>
  );
}
