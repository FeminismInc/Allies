import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignUp from "./pages/login/login";
import Home from "./pages/home/Home";
import Form from "./pages/form/Form"
import Profile from "./pages/profile/Profile"
import PostPage from './pages/post/post';
import MessagesPage from './pages/messages/Messages';
import Search from './pages/search/Search';
import PostViewPage from './pages/post_view/post_view'

function App() {
  return (
    <Router>
            <Routes>
              <Route path="/" element={<LoginSignUp />} />
              <Route path="/home" element={<Home />} />
              <Route path='/messages' element={<MessagesPage />} />
              <Route path='/messages/:otherUsername' element={<MessagesPage />} />
              {/* //<Route path="/profile" element={<Profile />} /> */}
              <Route path="/post" element = {<PostPage/>} />
              <Route path="/form" element = {<Form/>} />
              <Route path="/search" element = {<Search/>} />
              <Route path="/profile/:username" element={<Profile />} />  
              {/* <Route path="/postView/:postId" element = {<PostViewPage/>} /> */}
              <Route path="/postView" element = {<PostViewPage/>} />
            </Routes>
    </Router>
  )
}
export default App;
