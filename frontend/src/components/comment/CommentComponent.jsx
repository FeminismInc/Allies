import axios from 'axios';
import React, { useState, useEffect } from "react";
import "./commentComponent.css";


export default function CommentComponent({ comment, username }) {
  const uri = 'http://localhost:5050/api'
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [showLikeBox, setShowLikeBox] = useState(false);
  const [showDislikeBox, setShowDislikeBox] = useState(false);
  
  useEffect(() => {
    if (comment) {
      fetchLikesByCommentID(comment);
      fetchDislikesByCommentID(comment);
    }
  }, [comment])
  const handleLikeClick = () => {
    setShowLikeBox(!showLikeBox);
  };

  const handleDislikeClick = () => {
    setShowDislikeBox(!showDislikeBox);
  };

  const fetchLikesByCommentID = async (comment) => {
    try {
      const response = await axios.get(`${uri}/comments/getCommentLikes/${comment._id}`, {});
      if (response.data) {
        console.log("response in comment component LIKES: ",response.data);
        setLikes([...response.data]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  const fetchDislikesByCommentID = async (comment) => {
    try {
      const response = await axios.get(`${uri}/comments/getCommentDislikes/${comment._id}`, {});
      if (response.data) {
        console.log("response in comment component DISLIKES: ",response.data);
        setDislikes([...response.data]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  
  

  // const fetchDislikesByCommentID = async (comment) => {
  //   try {

  //     const response = await axios.get(`${uri}/comments/getCommentDislikes/${comment._id}`, {});
  //     if (response.data) {
  //       setDislikes([...response.data]);
  //       //console.log('dislikes: response in comment component DISLIKES: ',response.data.accounts_that_disliked)
        
  //     }
  //   } catch (error) {
  //     console.error('Error fetching comments:', error);
  //   }
  // }

  
  

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
          <div className="comment-info">
            <div className="username">{comment.author}
              {/* <span className="handle">@{comment.author}</span> */}
              <span className="comment-date">
                {new Date(comment.datetime).toLocaleString()}
              </span>
              <div>
                <div className="comment-stats">
                  <p onClick={handleLikeClick}> {likes.length} likes</p>
                  <p onClick={handleDislikeClick}> {dislikes.length} dislikes</p>
                </div>
                <div className="comment-interaction">
                  <button className="engage-button-like" 
                  onClick={() => { likeComment(comment, username) }}
                  aria-label="like-button"
                  data-testid="like-button">
                    Like
                  </button>
                  <button className="engage-button-dislike" 
                    onClick={() => { dislikeComment(comment, username) }
                    }
                    aria-label="dislike-button"
                    data-testid="dislike-button">
                    Dislike
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="comment-content">
            <p>{comment.text}</p>
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