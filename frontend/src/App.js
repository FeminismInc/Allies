import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignUp from "./pages/login/login";
import Home from "./pages/home/Home";
import Form from "./pages/form/Form"
import Profile from "./pages/profile/Profile"
import PostPage from './pages/post/post';
import MessagesPage from './pages/messages/Messages';

function App() {
  return (
    <Router>
            <Routes>
              <Route path="/" element={<LoginSignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path='/messages' element={<MessagesPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post" element = {<PostPage/>} />
            </Routes>
    </Router>
  )
}

export default App;
