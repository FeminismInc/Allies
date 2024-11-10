import React from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import './commentlog.css';

export default function CommentLog({
    currentUsername,
    currentPost,
    commentList,
    message,
    setMessage,
    send
}) {
    const [comments, setComments] = useState([]);

    const fetchCommentsById = async (PostId) => {
        try {
          console.log(PostId);
          const response = await axios.get(`${uri}/posts/getPostComments/${PostId}`, {
          });
          setComments(response.data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    return (
        <div>
            <div className="comments-container">
              {comments.length > 0 ? (
                posts.map((post, index) => (
                  <div key={index} className="comment">
                    <div className="comment-header">
                      <AccountCircleOutlinedIcon className="profile-picture" />
                      <div className="comment-info">
                        <span className="username">{username}</span>
                        <span className="handle">@{post.author}</span>
                        <span className="comment-date">
                          {new Date(comment.datetime).toLocaleString()}

                        </span>
                      </div>
                    </div>
                    <div className="comment-content">
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments found.</p>
              )}
            </div>
            
          </div>
    )
}
