import axios from 'axios';
import React, { useState, useEffect } from "react";
import "./userPost.css";
import { useNavigate } from 'react-router-dom';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PostContent from './postContent';
import RepostWrapper from './RepostWrapper';


const Repost = RepostWrapper(PostContent);
export default function UserPost({ post, username }) {  // { post object, username of post we are viewing }
  const uri = 'http://localhost:5050/api';
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [showLikeBox, setShowLikeBox] = useState(false);
  const [showDislikeBox, setShowDislikeBox] = useState(false);
  const [isAParent, setIsAParent] = useState(false);
  const [childPost, setChildPosts] = useState('');



  const handleLikeClick = () => {
    setShowLikeBox(!showLikeBox);
  };

  const handleDislikeClick = () => {
    setShowDislikeBox(!showDislikeBox);
  };

  const handleRepostClick = async (post) => {
    try {
      console.log("now in try block ");
      await axios.post(`${uri}/posts/createRepost`, { post });

    } catch (error) {
      console.error('Error creating repost:', error);
    }
  };
  // const fetchChildPostByRepostID = async (post.repost) => {

  //   //get objID of posts, which will have all post information
  //   // wrap the post component itself with a repost wrapper, which will add the delete button '{username} reposted at {datetime}
  //   //click repost: post gets added to user's repost db
  // };
  const fetchChildPostByRepostID = async (post) => {
    try {
      const response = await axios.get(`${uri}/posts/getChildPost/${post.repost}`, {});
      setChildPosts(response.data);
      console.log("fetching child post: ", response.data);
    }
    catch (error) {
      console.error('Error fetching child posts:', error);
    }
  };

  useEffect(() => {
    if (post.repost != null) {
      console.log("is a parent post");
      setIsAParent(true);
      fetchChildPostByRepostID(post);
    }
  }, [post])

  const fetchLikesByPostID = async (post) => {
    try {
      const response = await axios.get(`${uri}/posts/getPostLikes/${post._id}`, {});
      setLikes([...response.data]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  fetchLikesByPostID(post);
  const fetchMyLikes = async () => {
    fetchLikesByPostID(post);
  }

  const fetchDislikesByPostID = async (post) => {
    try {
      const response = await axios.get(`${uri}/posts/getPostDislikes/${post._id}`, {});
      setDislikes([...response.data]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  fetchDislikesByPostID(post);
  const fetchMyDislikes = async () => {
    fetchDislikesByPostID(post);
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
          <button onClick={() => { likePost(post, username) }}>
            Like
          </button>
          <button onClick={() => { dislikePost(post, username) }}>
            Dislike
          </button>
          <button>
            Comment
          </button>
          {/* if 'isRepost' == true, don't render this button */}
          {!isAParent && (
            <button onClick={() => { handleRepostClick(post) }}>
              Repost
            </button>
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