import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Home from './components/Pages/Home';
import Board from './components/Board/Board.js';
import Navbar from './components/Bar/Navbar.js';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/test" element={<Board />}></Route>
      </Routes>
      <Navbar />
    </Router>
  );
}
