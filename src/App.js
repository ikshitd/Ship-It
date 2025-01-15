import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Home from './components/Pages/Home.js';
import Navbar from './components/Bar/Navbar.js';
import { AppContextProvider } from '../src/context/Context';

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
