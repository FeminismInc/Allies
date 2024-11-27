import './searchresults.css';
import React, { useEffect, useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from 'axios';
import { Link } from 'react-router-dom';


const SearchResults = ({ username, handle, isFollowing: initialIsFollowing, isRequested: initialIsRequested}) => {

    const [isFollowing, setIsFollowing] = useState(initialIsFollowing); 
    const [isRequested, setIsRequested] = useState(initialIsRequested);
    const [publicBoolean, setPublicBoolean] = useState(null);// Track follow status
    const uri = "http://localhost:5050/api"; 
    // Base URI for your API
    useEffect(() => {
        // Fetch the public_boolean when the component is mounted
        const fetchPrivacyStatus = async () => {
            try {
                const response = await axios.get(`${uri}/users/getPrivacyStatus`, { params: { username } });
                setPublicBoolean(response.data.public_boolean); // Set public_boolean
            } catch (error) {
                console.error("Error fetching privacy status:", error);
            }
        };
        console.log(initialIsRequested);
        fetchPrivacyStatus();
        setIsFollowing(initialIsFollowing);
        setIsRequested(initialIsRequested);
    }, [initialIsFollowing, initialIsRequested, username]);

    const handleFollowClick = async () => {
        if (!isFollowing && publicBoolean === false) {
            // If the user is not public, request follow
            try {
                if(isRequested)
                {
                    const removeResponse = await axios.post(`${uri}/users/removeFollowRequest`, { username });
                    setIsRequested(false);
                }
                else{
                    const SendResponse = await axios.post(`${uri}/users/sendFollowRequest`, { username });
                    const SaveResponse = await axios.post(`${uri}/users/saveFollowRequest`, { username });
                    setIsRequested(true);
                }
            } catch (error) {
                console.error("Error requesting follow:", error);
            }
        } else {
            // If the user is public, follow/unfollow as usual
            if (isFollowing) {
                try {
                    const response = await axios.post(`${uri}/users/removeFollowing`, { username });
                    console.log(response.data);
                    setIsFollowing(false);
                } catch (error) {
                    console.error("Error removing follower:", error);
                }
            } else {
                try {
                    const response = await axios.post(`${uri}/users/addFollower`, { username });
                    console.log(response.data);
                    setIsFollowing(true);
                } catch (error) {
                    console.error("Error adding follower:", error);
                }
            }
        }
    };


    return(
        <div className='result-container'>
            <div className='user-info'>
                <div className='profile-pic'>
                     <AccountCircleOutlinedIcon style={{ fontSize: '60px' }}/> 
                </div>
                <div className='username'>
                <Link to={`/profile/${username}`} className="username-link">
                    <span className="name">{username}</span>
                </Link>
                    <span className="handle">@{handle}</span>
                </div>
            </div>
            <div className='follow-button'>
            <button onClick={handleFollowClick}>
            {publicBoolean === null
                        ? "Loading..."
                        : publicBoolean === false
                        ? isRequested
                            ? "Requested"
                            : isFollowing
                            ? "Following"
                            : "Follow"
                        : isFollowing
                        ? "Following"
                        : "Follow"}
                </button>
            </div>
        </div>
    );
}

export default SearchResults;