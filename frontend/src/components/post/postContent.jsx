import React, { useEffect, useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './postcontent.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Filter } from 'bad-words'



export default function PostContent({ post, username, isAParent }) {

  const uri = process.env.REACT_APP_URI;

  const [mediaUrl, setMediaUrl] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  

  useEffect(() => {
    const fetchPostWithMedia = async () => {
      try {
        if(post.media){
          const response = await axios.get(`${uri}/posts/getMedia/${post._id}`);
          const media = response.data;
          setMediaUrl(media);
        }
        // If the post has associated media, extract the media URL
      } catch (err) {
        console.error("Error fetching post with media", err);
      }
    };
    fetchProfilePicture();
    fetchPostWithMedia();
  }, [post.media]);

  const fetchProfilePicture = async () => {
    try {
        const response = await axios.get(`${uri}/users/getProfilePicture/${username}`); // Adjust the endpoint as necessary
        setProfileImage(response.data.profilePicture); // Update state with the retrieved profile picture
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
};
  
  const filter = new Filter()
  if (isAParent || !post) return null;
  return (
    <div className="postContent-container">
      <div className="post-header">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-picture-post"  />
                 ) : (
              <AccountCircleOutlinedIcon className="profile-picture" />
                )}
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
        <p>{filter.clean(post.text)}</p>
        {post.media && post.media.length > 0 && mediaUrl && (
          <div className="post-media-container">
            <img 
              src={mediaUrl} 
              alt="post-media" 
              className="post-media" 
            />
          </div>
        )}
      </div>
    </div>

  );
}