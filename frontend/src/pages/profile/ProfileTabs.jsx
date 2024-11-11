import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profiletabs.css';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import UserPost from '../../components/post/userPost';

export default function ProfileTabs({ username }) {

  const uri = 'http://localhost:5050/api' // http://54.176.5.254:5050/api
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
  const media = ["Image 1", "Video 1", "Image 2"];
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
                    />
                  </div>
                ))
              ) : (
                <p>No posts found.</p>
              )}
            </div>
            
          </div>
        );
      case 'media':
        return (
          <div>
            <div className='media-container'>
              <div className="username-box">Lex_the_cat</div>
              <div><p> </p></div>
              <img src={require('./IMG_4628.jpg')} width={350} height={350} />
            </div>

          </div>
        );
      case 'followers':
        return (
          <div>
            <h3>Reposts</h3>
            <ul>
              {followers.map((follower, index) => (
                <li key={index}>{follower}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
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
        <button
          className={activeTab === 'media' ? 'active' : ''}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
        <button
          className={activeTab === 'followers' ? 'active' : ''}
          onClick={() => setActiveTab('followers')}
        >
          Reposts
        </button>
      </div>

      {/* Render the content based on the active tab */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}