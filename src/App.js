import { Routes, Route } from 'react-router-dom';
import Login from './components/Pages/Login.js';
import Register from './components/Pages/Register.js';
import Home from './components/Pages/Home.js';
import Navbar from './components/Bar/Navbar.js';
import NotFound from './components/Pages/NotFound.js';
import SessionExpired from './components/Pages/SessionExpired.js';
import Profile from './components/Pages/Profile.js';
import UserSearch from './components/UserSearch.js';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/session-expired" element={<SessionExpired />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/test" element={<UserSearch />}></Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Navbar />
    </>
  );
}
