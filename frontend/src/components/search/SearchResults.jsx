import './searchresults.css';
import React, { useEffect, useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from 'axios';

const SearchResults = ({ username, handle, isFollowing: initialIsFollowing}) => {

    const [isFollowing, setIsFollowing] = useState(initialIsFollowing); // Track follow status
    const uri = "http://localhost:5050/api"; 
    // Base URI for your API
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const handleFollowClick = async () => {
        if(isFollowing)
        {
            try {
            const response = await axios.post(`${uri}/users/removeFollowing`, { username });
            console.log(response.data);
            setIsFollowing(false);
        } catch (error) {
            console.error("Error adding follower:", error);
        }
        }
        else{
        try {
            const response = await axios.post(`${uri}/users/addFollower`, { username });
            console.log(response.data); // Handle the response (success message)
            setIsFollowing(true); // Update follow status after successful request
        } catch (error) {
            console.error("Error adding follower:", error);
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
                    <span className="name">{username}</span>
                    <span className="handle">@{handle}</span>
                </div>
            </div>
            <div className='follow-button'>
            <button onClick={handleFollowClick}>
                    {isFollowing ? "Following" : "Follow"}
                </button>
            </div>
        </div>
    );
}

export default SearchResults;