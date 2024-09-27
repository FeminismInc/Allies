import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignUp from "./pages/login/login";
import Home from "./pages/home/Home";
import Form from "./pages/form/Form"
import Profile from "./pages/profile/Profile"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/home" element={<Home/>} />
        <Route path='/form' element={<Form/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  )
  }

export default App;
