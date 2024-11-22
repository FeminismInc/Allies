import React from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './postcontent.css'
import { Link } from 'react-router-dom';


{/* TODO: post only returns author (usernmae), not handle. 
Make post contain both handle and username */}

export default function PostContent({post,username,isAParent}) {
  if (isAParent) return null;
  //console.log('this post is not a parent',post);
return (
    <div className="postContent-container">
        <div className="post-header">
        
                  <AccountCircleOutlinedIcon className="profile-picture" />
                  <div className="post-info">
                  <Link to={`/profile/${username}`} className="username-link">
                  <span className="post-username">{username}</span>
                </Link>
                    
                    <span className="post-handle">@{post.author}</span>
                    <span className="post-date">
                      {new Date(post.datetime).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="post-content">
                  <p>{post.text}</p>
        </div>
    </div>
                
);
}