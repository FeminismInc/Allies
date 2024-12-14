import React, { useEffect, useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FollowerCard = ({
        username, // owner of the follow list/currentUser
        followerUser,   // the user that follows the currentuser
        isCurrentUser   // if true, then the currentuser is looking at their own profile and should be able to have the option to unfollow/block people in their follower/following list
                }) => { 
    const [isFollowing, setIsFollowing] = useState(true);
    const uri = process.env.REACT_APP_URI; 
    const [profileImage, setProfileImage] = useState(null);
    useEffect(() => {
        setIsFollowing(true);
        fetchProfilePicture();
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
    const fetchProfilePicture = async () => {
        try {
            const response = await axios.get(`${uri}/users/getProfilePicture/${followerUser}`); // Adjust the endpoint as necessary
            setProfileImage(response.data.profilePicture); // Update state with the retrieved profile picture
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };
    return (
        <div className="followers">
            <Link to={`/profile/${followerUser}`} className="username-link">
            <div className="followers-header">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="profile-picture-smallIcon" />
                ) : (
                    <AccountCircleOutlinedIcon className="profile-picture-icon" />
                )}
                <div className="followers-info">
                
            <span className="username">{followerUser}</span>
         
                </div>
            </div>
            </Link>
            {isCurrentUser? (<button onClick={handleFollowClick}>
                {isFollowing ? "Block" : "UnBlock"}
            </button>) :(<p></p>)
            }
            
        </div>
    );
};
export default FollowerCard;