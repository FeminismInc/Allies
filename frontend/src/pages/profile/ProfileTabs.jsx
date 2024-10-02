import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './profiletabs.css';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export default function ProfileTabs({username}) {

    const uri = 'http://localhost:5050'

    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);

    const fetchPostsByUsername = async (username) => {
        if (!username) {
          console.error('No userId provided!');
          return;
        }
        try {
          console.log(username);
          const response = await axios.get(`${uri}/api/users/getPosts/${username}`, {
          });
          setPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
    
      // Fetch posts when the "Posts" tab is active
    useEffect(() => {
        if (activeTab === 'posts' && username) {
          fetchPostsByUsername(username);
        }
      }, [activeTab,username]); 


    // Dummy data for posts, media, and followers
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
                              <div className="post-header">
                                  <AccountCircleOutlinedIcon className="profile-picture"/>
                                <div className="post-info">
                                  <span className="username">{username}</span>  
                                  <span className="handle">@{post.author}</span>
                                  <span className="post-date">
                                    {new Date(post.datetime).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="post-content">
                                <p>{post.text}</p>
                              </div>
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