import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profiletabs.css';
import UserPost from '../../components/post/userPost';
import CachedIcon from '@mui/icons-material/Cached';

export default function ProfileTabs({ username }) {

  const uri = process.env.REACT_APP_URI // http://54.176.5.254:5050/api
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  const fetchPostsByUsername = async (username) => {
    try {
      console.log(username);
      const response = await axios.get(`${uri}/users/getPosts/${username}`, {
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  // Fetch posts when the "Posts" tab is active
  useEffect(() => {
    if (activeTab === 'posts' && username) {
      fetchPostsByUsername(username);
      console.log(posts)
    }
  }, [activeTab, username]);


  // Dummy data for media, and followers

  const followers = ["Follower 1", "Follower 2", "Follower 3"];

  // render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div>
            <div className="posts-container">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div key={index} className="post">
                    <UserPost
                    post = {post}
                    username = {username}
                    />
                    
                  </div>
                ))
              ) : (
                <p>No posts found.</p>
              )}
            </div>
            
          </div>
        );
     
    }
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="tabs">
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
       
      </div>
      {/* Render the content based on the active tab */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}