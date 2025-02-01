import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Pages/Login.js';
import Register from './components/Pages/Register.js';
import Home from './components/Pages/Home.js';
import Navbar from './components/Bar/Navbar.js';
import { AppContextProvider } from '../src/context/Context.js';
import NotFound from './components/Pages/NotFound.js';
import SessionExpired from './components/Pages/SessionExpired.js';

export default function App() {
  return (
    <AppContextProvider>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/session-expired" element={<SessionExpired />}></Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Navbar />
    </AppContextProvider>
  );
}
