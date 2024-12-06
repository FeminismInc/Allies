import React, { useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './repostwrapper.css';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// params: (childPost,isARepost)
// in userPost, if isRepost is true, on
const RepostWrapper = (WrappedComponent) => {
    return function Repost(props) {
        const { post,username,isAParent,childPost } = props;
        const navigate = useNavigate();
        if (!isAParent) return null;
        //console.log('wrapper: post',post);
        //console.log('wrapper: childpost',childPost);
        const uri = process.env.REACT_APP_URI // http://54.176.5.254:5050/api

        const handleChildPostClick = () => {
           navigate(`/PostView` ,{ state: { post: childPost } });
        }


        return (
            <div className='repost-container'>
                {/* if we have time, should probably make the post header into a component */}
                <div className="repost-header">
                    <AccountCircleOutlinedIcon className="profile-picture" />
                    <div className='repost-info'>
                    <Link to={`/profile/${username}`} className="username-link">
                        <span className="repost-username">{username}</span>    
                    </Link>
                    <span className="repost-handle">@{post.author}</span>
                    <span className="repost-date">
                    {new Date(post.datetime).toLocaleString()}
                    </span>
                    </div>
                </div>
                    
                   
                    {/* in the css, repost child will have a shadow */}
                    <div className='child-post'> 
                    
                        
                    {/* <Link to={`/PostView/${post._id}`} className="repost">
                    <WrappedComponent post={childPost} username={username} isAParent={false} />
                    </Link>  */}
                    <button onClick={handleChildPostClick} className='childPost'>
                    <WrappedComponent post={childPost} username={childPost.author} isAParent={false} />
                    </button>  
                    </div>
                

            </div>

        );

    };
};
export default RepostWrapper;