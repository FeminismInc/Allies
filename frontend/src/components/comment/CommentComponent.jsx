import axios from 'axios';
import React, { useState, useEffect } from "react";
import "./commentComponent.css";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { IconButton } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link } from 'react-router-dom';

export default function CommentComponent({ comment, username }) {
  const uri = 'http://localhost:5050/api'
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [showLikeBox, setShowLikeBox] = useState(false);
  const [showDislikeBox, setShowDislikeBox] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (comment) {
      fetchProfilePicture();
      fetchLikesByCommentID(comment);
      fetchDislikesByCommentID(comment);
    }
  }, [comment])

  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(`${uri}/users/getProfilePicture/${comment.author}`); // Adjust the endpoint as necessary
      setProfileImage(response.data.profilePicture); // Update state with the retrieved profile picture
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  const handleLikeClick = () => {
    setShowLikeBox(!showLikeBox);
  };

  const handleDislikeClick = () => {
    setShowDislikeBox(!showDislikeBox);
  };

  // likes and dislikes are both fetched on mount and when a user likes/dislikes a comment
  // in the backend, when a user likes/dislikes a comment they've already liked/disliked, their username gets removed
  // therefore, the state depends on whether the response includes the username... in theory?
  const fetchLikesByCommentID = async (comment) => {
    try {
      const response = await axios.get(`${uri}/comments/getCommentLikes/${comment._id}`, {});

      if (response.data) {
        console.log("response in comment component LIKES: ", response.data);
        setLikes([...response.data]);
        setUserLiked(response.data.includes(username));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }


  const fetchDislikesByCommentID = async (comment) => {
    try {

      const response = await axios.get(`${uri}/comments/getCommentDislikes/${comment._id}`, {});
      if (response.data) {
        //console.log('dislikes: response in comment component DISLIKES: ',response.data.accounts_that_disliked)
        setDislikes([...response.data]);
        setUserDisliked(response.data.includes(username)); //should check 
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }



  const likeComment = async (comment, username) => {
    try {
      await axios.post(`${uri}/comments/addLike/${comment._id}`, { username });
      fetchLikesByCommentID(comment);
    } catch (error) {
      console.error("Error adding like:", error);
    }
  }

  const dislikeComment = async (comment, username) => {
    try {
      await axios.post(`${uri}/comments/addDislike/${comment._id}`, { username });
      fetchDislikesByCommentID(comment);
    } catch (error) {
      console.error("Error adding like:", error);
    }
  }
  //dislikes and likes are continuously being fetched

  return (
    <div>
      <div className="comment-header">
        {profileImage ? (
          <img src={profileImage} alt="Comment" className="profile-picture-smallIcon" />
        ) : (
          <AccountCircleOutlinedIcon className="profile-picture-comments" />
        )}
        <div className="comment-info">
          <Link to={`/profile/${comment.author}`} className="username-link">
            <span className="comment-username">{comment.author}</span>
          </Link>


          {/* <span className="handle">@{comment.author}</span> */}
          <span className="comment-date">
            {new Date(comment.datetime).toLocaleString()}
          </span>
          </div>
          

       
        
      </div>
      <div className="comment-content">
          <p>{comment.text}</p>
        </div>
        <div>
            <div className="comment-stats">
              <p onClick={handleLikeClick}> {likes.length} likes</p>
              <p onClick={handleDislikeClick}> {dislikes.length} dislikes</p>
            </div>
            <div className="comment-interaction">
              <IconButton
                className={`engage-button ${userLiked ? 'liked' : ''}`}
                onClick={() => { likeComment(comment, username) }}
              >
                <ThumbUpAltIcon color={userLiked ? 'primary' : 'inherit'} />
              </IconButton>
              <IconButton className={`engage-button ${userDisliked ? 'disliked' : ''}`} onClick={() => { dislikeComment(comment, username) }}>
                <ThumbDownAltIcon color={userDisliked ? 'primary' : 'inherit'} />
              </IconButton>
            </div>
          </div>



      <div className={`white-rounded-box ${showLikeBox ? 'show' : ''}`}>
        <h3>Accounts that liked</h3>
        <div className="likes-accounts-container">
          {likes.length > 0 ? (
            likes.map((likes, index) => (
              <div key={index} className="likes-accounts">
                <div className="likes-accounts-header">
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