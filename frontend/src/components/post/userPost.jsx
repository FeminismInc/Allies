import axios from 'axios';
import React, { useState, useEffect } from "react";
import "./userPost.css";
import { useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PostContent from './postContent';
import RepostWrapper from './RepostWrapper';
import { IconButton } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import RepeatIcon from '@mui/icons-material/Repeat';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

const Repost = RepostWrapper(PostContent);
export default function UserPost({ post, username }) {  // { post object, username of post we are viewing }
  const uri = 'http://localhost:5050/api';
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [showLikeBox, setShowLikeBox] = useState(false);
  const [showDislikeBox, setShowDislikeBox] = useState(false);
  const [isAParent, setIsAParent] = useState(false);
  const [childPost, setChildPosts] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
    if (post) {
      //console.log("Fetching likes and dislikes for:", post._id);
      fetchLikesByPostID(post);
      fetchDislikesByPostID(post);
    }
  }, );

  const handleLikeClick = () => {
    setShowLikeBox(!showLikeBox);
  };

  const handleDislikeClick = () => {
    setShowDislikeBox(!showDislikeBox);
  };

  const handleCommentClick = () => {
    navigate(`/PostView` ,{ state: { post: post } });

  };

  const handleRepostClick = async (post) => {
    try {
      //console.log("now in try block ");
      await axios.post(`${uri}/posts/createRepost`, { post });

    } catch (error) {
      console.error('Error creating repost:', error);
    }
  };

  const fetchChildPostByRepostID = async (post) => {
    try {
      const response = await axios.get(`${uri}/posts/getChildPost/${post.repost}`, {});
      setChildPosts(response.data);
      //console.log("fetching child post: ", response.data);
    }
    catch (error) {
      console.error('Error fetching child posts:', error);
    }
  };

  useEffect(() => {
    if (post.repost !== null) {

      setIsAParent(true);
      fetchChildPostByRepostID(post);
    }
  }, [post])

  const fetchLikesByPostID = async (post) => {
    try {
      const response = await axios.get(`${uri}/posts/getPostLikes/${post._id}`, {});
      //console.log("response.data(likes) : ", response.data);
      if (response.data)
      setLikes([...response.data] );
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLikes([]);
    }
  }


  const fetchDislikesByPostID = async (post) => {
    try {
      // either returns an empty array or accounts_that_disliked, otherwise error 
      const response = await axios.get(`${uri}/posts/getPostDislikes/${post._id}`, {});
      //console.log("response.data(dislikes) : ", response.data);
      if (response.data) {
        setDislikes([...response.data]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setDislikes([]);
    }
  }


  const likePost = async (post, username) => {
    try {
      await axios.post(`${uri}/posts/addLike/${post._id}`, { username });
      fetchLikesByPostID(post);
    } catch (error) {
      console.error("Error adding like:", error);
    }
  }

  const dislikePost = async (post, username) => {
    try {
      await axios.post(`${uri}/posts/addDislike/${post._id}`, { username });
      fetchDislikesByPostID(post);
    } catch (error) {
      console.error("Error adding like:", error);
    }
  }

  return (
    <div>
      <div className="posts-container">
        <PostContent post={post} username={username} isAParent={isAParent} />
        <Repost post={post} username={username} isAParent={isAParent} childPost={childPost} />
        <div className="post-stats">
          <p onClick={handleLikeClick}> {likes.length} likes</p>
          <p onClick={handleDislikeClick}> {dislikes.length} dislikes</p>
        </div>
        <div className="post-interaction">
          <IconButton className="like-button" aria-label="Likes Icon Button" onClick={() => { likePost(post, username) }}>
            <ThumbUpAltIcon/>
          </IconButton>
          <IconButton className="dislike-button" aria-label="Dislike Icon Button" onClick={() => { dislikePost(post, username) }}>
            <ThumbDownAltIcon/>
          </IconButton>
          <IconButton className="comment-button" aria-label="Comment Icon Button" onClick={() => { handleCommentClick(post) }}>
            <CommentIcon/>
          </IconButton>
          {/* if 'isRepost' == true, don't render this button */}
          {!isAParent && (
            <IconButton className="repost-button" onClick={() => { handleRepostClick(post) }}>
             <RepeatIcon/>
            </IconButton>
          )}
        </div>
      </div>
      <div className={`white-rounded-box ${showLikeBox ? 'show' : ''}`}>
        <h3>Accounts that liked</h3>
        <div className="likes-accounts-container">
          {likes.length > 0 ? (
            likes.map((likes, index) => (
              <div key={index} className="likes-accounts">
                <div className="likes-accounts-header">
                  <AccountCircleOutlinedIcon className="profile-picture" />
                  <div className="likes-accounts-info">
                    <span className="likes-accounts-username">{likes}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No likes found.</p>
          )}
        </div>
        <button className='submit-button' onClick={() => setShowLikeBox(false)}>Close</button>
      </div>
      <div className={`white-rounded-box ${showDislikeBox ? 'show' : ''}`}>
        <h3>Accounts that disliked</h3>
        <div className="dislikes-accounts-container">
          {dislikes.length > 0 ? (
            dislikes.map((dislikes, index) => (
              <div key={index} className="dislikes-accounts">
                <div className="dislikes-accounts-header">
                  <AccountCircleOutlinedIcon className="profile-picture" />
                  <div className="dislikes-accounts-info">
                    <span className="dislikes-accounts-username">{dislikes}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No dislikes found.</p>
          )}
        </div>
        <button className='submit-button' onClick={() => setShowDislikeBox(false)}>Close</button>
      </div>
    </div>
  );
}