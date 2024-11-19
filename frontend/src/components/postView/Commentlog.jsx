import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import './commentlog.css';

import CommentComponent from '../comment/CommentComponent';

export default function CommentLog({
    PostId,
    username,
    message,
    setMessage,
    send
  }) {

    const uri = 'http://localhost:5050/api' // http://54.176.5.254:5050/api
    const [comments, setComments] = useState([]);

  
  useEffect(() => {
    const fetchCommentsById = async () => {
      try {
        console.log(PostId);
        const response = await axios.get(`${uri}/posts/getPostComments/${PostId}`);
        setComments(response.data);  
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (PostId) {
      fetchCommentsById();
    }
  }, [PostId]);

    // render comments underneath a post
    return (
        <div>
            <div className="comments-container">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <CommentComponent
                      comment = {comment}
                      username = {comment.author}
                      />
                  </div>
                ))
              ) : (
                <p>No comments found.</p>
              )}
            </div>

            <div className="comment-input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="comment-input"
                    placeholder="Type your comment..."
                    id="comment-input"
                />
                <IconButton aria-label="send-button" size='large' onClick={send}>
                    <SendIcon fontSize="inherit" />
                </IconButton>
            </div>
            
          </div>
    )
}
