import React, { useState } from 'react'
import './profileheader.css'
import SettingsIcon from '@mui/icons-material/Settings'
import { Button } from '@mui/material';
import axios from "axios";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Settings } from 'react-native';

const ProfileHeader = ({ username }) => {
    const [showWhiteBox, setShowWhiteBox] = useState(false);
    const [bioText, setBioText] = useState("");
    const [showIconBox, setShowIconBox] = useState(false);

    const [followers, setFollowersList] = useState([]);
    const [following, setFollowingList] = useState([]);

    const [showFollowing, setShowFollowing] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);

    const uri = 'http://localhost:5050/api';
    
    const handleButtonClick = () => {
        setShowWhiteBox(!showWhiteBox);
    };

    const handleIconButtonClick = () => {
        setShowIconBox(!showIconBox);
    }

    const handleTextChange = (e) => {
        setBioText(e.target.value);
    }

    const handleSubmit = () => {
        console.log("submitted bio:", bioText); // im just logging the text rn im not sure what to do
        setShowWhiteBox(false);
    }

    const fetchFollowers = async (username) => {
        try {
            const response = await axios.get(`${uri}/users/followers/${username}`);
            
            // The response should include the follower accounts populated with usernames
            const followersList = response.data.follower_accounts;
            const usernames = followersList.map(follower => follower.username); // This will have populated user documents
            // Set the followers list in your component state
            setFollowersList(usernames);
        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    
        // Toggle the visibility of the followers list
        setShowFollowers(!showFollowers);
    };

    const fetchMyFollowers = async () => {
        fetchFollowers(username);
    }

    const fetchFollowing = async (username) => {
        try {
            console.log(username);
            axios.get(`${uri}/users/following/${username}`).then(response => {
                const usernames = (response.data.accounts_followed || []).map(following.username);
                setFollowingList(usernames);
                console.log(response);
            });
          } catch (error) {
            console.error('Error fetching following:', error);
        }
        setShowFollowing(!showFollowing)
    }

    const fetchMyFollowing = async () => {
        fetchFollowing(username);
    }

    return (
        <div>
            <div className="profile-container">
                <div className='user-info'>
                    <div className="username">
                        <h1>{username}</h1>
                    </div>
                    <button className='followers' onClick = {fetchMyFollowers}>
                        following
                    </button>
                    <button className='following' onClick = {fetchMyFollowing}>
                        followers
                    </button>
                    <button
                        className='right-icon-button'
                        onClick={handleIconButtonClick}
                        aria-label='Settings'
                    >
                        <div className='right-icon-wrapper'>
                            <SettingsIcon className='right-icon' />
                        </div>
                        
                    </button>
                </div>
                <button className='edit-bio-button' onClick={handleButtonClick}>
                    <h3>edit bio</h3>
                </button>
            </div>

            {showWhiteBox && <div className="overlay" onClick={handleButtonClick}></div>}

            {/* conditional show class for transition */}
            <div className={`white-rounded-box ${showWhiteBox ? 'show' : ''}`}>
                <h3>Edit Bio</h3>
                <textarea
                    className="textbox"
                    value={bioText}
                    onChange={handleTextChange}
                    placeholder="Write your bio here..."
                ></textarea>
                <button className="submit-button" onClick={handleSubmit}>Save</button>
            </div>

            <div className={`white-rounded-box ${showIconBox ? 'show' : ''}`}>
                <h3>Settings</h3>
                <p>blocked accounts, private or public, ...</p>
                <button className='submit-button' onClick={() => setShowIconBox(false)}>Close</button>
            </div>

            <div className={`white-rounded-box ${showFollowers ? 'show' : ''}`}>
                <h3>Following</h3>
                <div className="following-container">
                    {followers.length > 0 ? (
                        followers.map((followers, index) => (
                        <div key={index} className="followers">
                            <div className="followers-header">
                            <AccountCircleOutlinedIcon className="profile-picture" />
                            <div className="followers-info">
                                <span className="username">{followers}</span>
                            </div>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>Not following anyone.</p>
                    )}
                </div>
                <button className='submit-button' onClick={() => setShowFollowers(false)}>Close</button>
            </div>

            <div className={`white-rounded-box ${showFollowing ? 'show' : ''}`}>
                <h3>Followers</h3>
                <div className="following-container">
                    {following.length > 0 ? (
                        following.map((following, index) => (
                        <div key={index} className="following">
                            <div className="following-header">
                            <AccountCircleOutlinedIcon className="profile-picture" />
                            <div className="following-info">
                                <span className="username">{following}</span>
                            </div>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>No followers found</p>
                    )}
                </div>
                <button className='submit-button' onClick={() => setShowFollowing(false)}>Close</button>
            </div>
        </div>
    )
}

export default ProfileHeader;