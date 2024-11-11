import axios from 'axios';
import React, { useState } from "react";
import "./userPost.css";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


export default function UserPost({post, username}) {
    const uri = 'http://localhost:5050/api'
    const [isLiked, setisLiked] = useState();
    const [isDisliked, setisDisliked] = useState();
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    
    const fetchLikesByPostID = async (post) => {
        try {
          const response = await axios.get(`${uri}/posts/getPostLikes/${post._id}`, {
          });
          setLikes(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
    }

    const fetchMyLikes = async () => {
        fetchLikesByPostID(post);
    }
    
    const fetchDislikesByPostID = async (post) => {
        try {
          const response = await axios.get(`${uri}/posts/getPostDislikes/${post._id}`, {
          });
          setDislikes(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
    }

    const fetchMyDislikes = async () => {
        fetchDislikesByPostID(post);
    }
    
    const likePost = async (post, username) => {
        try {
            console.log(post)
            const response = await axios.post(`${uri}/posts/addLike/${post._id}`, { username });
            setLikes(response.data);
            } catch (error) {
            console.error("Error adding like:", error);
        }
    }
    
    const dislikePost = async (post, username) => {
        try {
            const response = await axios.post(`${uri}/posts/addDislike/${post._id}`, { username });
            setLikes(response.data);
            } catch (error) {
            console.error("Error adding like:", error);
        }
    }

    return(
        <div className="posts-container">
                <div className="post-header">
                  <AccountCircleOutlinedIcon className="profile-picture" />
                  <div className="post-info">
                    <span className="username">{username}</span>
                    <span className="handle">@{post.author}</span>
                    <span className="post-date">
                      {new Date(post.datetime).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="post-content">
                  <p>{post.text}</p>
                </div>
                <div className = "post-stats"> 
                  <p onClick = {fetchMyLikes}> {likes.length} likes</p>
                  <p onClick = {fetchMyDislikes}> {dislikes.length} dislikes</p>
                </div>
                <div className = "post-interaction">
                  <button onClick={()=>{likePost(post, username)}}>
                    Like
                  </button>
                  <button onClick={()=>{dislikePost(post, username)}}>
                    Dislike
                  </button>
                  <button>
                    Comment
                  </button>
                  <button>
                    Repost
                  </button>
                </div>
              </div>
    );
}