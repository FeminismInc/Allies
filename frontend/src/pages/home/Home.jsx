import Data_Button from "../../components/data_button/data_button";
import "./home.css"
import Sidebar from '../../components/sidebar/Sidebar';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserPost from "../../components/post/userPost";

export default function Home() {
    const [feedPosts, setFeedPosts] = useState([]);
    const uri = process.env.REACT_APP_URI; // http://54.176.5.254:5050/api
    const [username, setUsername] = useState('');
  

    useEffect(() => {
        axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
          .then(response => {
            setUsername(response.data.username); 
            fetchFeedPosts(response.data.username);
         }).catch(error => {
           console.error('Error fetching user:', error);
          })
          },
       []); 
       
    const fetchFeedPosts = async (username) => {
    try {
         const response = await axios.get(`${uri}/posts/getFeedPosts/${username}`);
        setFeedPosts(response.data); // posts will already be sorted in the backend
    } catch (error) {
        console.error('Error fetching feed posts:', error);
     }
    };

    useEffect(() => {
        if (username) {
            console.log("logged in username", username );
            fetchFeedPosts(username);
            
        }
    }, [username]);
    
   
    
    return (
        <div>
            <div className="homeMainContent">
            <div className="sidebarContainer">
                <Sidebar/>
            </div>
            <div className="feed-container">
              {feedPosts.length > 0 ? (
                feedPosts.map((post, index) => (
                  <div key={index} className="post">
                    <UserPost
                    post = {post}
                    username = {post.author}
                    />
                    
                  </div>
                ))
              ) : (
                <p></p>
              )}
            </div>
            </div>
        </div>
               

    )
}