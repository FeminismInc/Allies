import React from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


export default function PostContent({post,username,isAParent}) {
  if (isAParent) return null;
  console.log('this post is not a parent',post);
return (
    <div className="postContent-container">
        <div className="post-header">
                  <AccountCircleOutlinedIcon className="profile-picture" />
                  <div className="post-info">
                    <span className="post-username">{post.author}</span>
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