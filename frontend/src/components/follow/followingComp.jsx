import React, { useEffect, useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from 'axios';
const UserCard = ({ username }) => {
    const [isFollowing, setIsFollowing] = useState(true);
    const uri = process.env.REACT_APP_URI; 
    useEffect(() => {
        setIsFollowing(true);
    }, [true]);
    const handleFollowClick = async () => {
        try {
            if (isFollowing) {
                const response = await axios.post(`${uri}/users/removeFollowing`, { username });
                console.log(response.data);
                setIsFollowing(false);
            } else {
                const response = await axios.post(`${uri}/users/addFollower`, { username });
                console.log(response.data);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error("Error updating follow status:", error);
        }
    };
    return (
        <div className="followers">
            <div className="followers-header">
                <AccountCircleOutlinedIcon className="profile-picture" />
                <div className="followers-info">
                    <span className="username">{username}</span>
                </div>
            </div>
            <button onClick={handleFollowClick}>
                {isFollowing ? "Following" : "Follow"}
            </button>
        </div>
    );
};
export default UserCard;