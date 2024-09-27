import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignUp from "./pages/login/login";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  )
  }

export default App;
