import Data_Button from "../../components/data_button/data_button";
import "./home.css"
import Sidebar from '../../components/sidebar/Sidebar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserPost from "../../components/post/userPost";

export default function Home({}) {
    const [feedPosts, setFeedPosts] = useState([]);
    const uri = 'http://localhost:5050/api' // http://54.176.5.254:5050/api
    const [username, setUsername] = useState('');
    useEffect(() => {
        //console.log("Username:", username);
        axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
          .then(response => {
            setUsername(response.data.username); 
         }).catch(error => {
           console.error('Error fetching user:', error);
          })
          },
       []); 

    const fetchPostsByUsername = async (username) => {
        try {
          console.log(username);
          const response = await axios.get(`${uri}/users/getPosts/${username}`, {
          });
          setFeedPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      }
      useEffect(() => {
        if (username) {
          fetchPostsByUsername(username);
          console.log(feedPosts)
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
                    username = {username}
                    />
                    
                  </div>
                ))
              ) : (
                <p>No posts found.</p>
              )}
            </div>
            </div>
        </div>
               

    )
}