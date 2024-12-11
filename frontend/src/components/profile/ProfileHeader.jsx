import React, { useState, useEffect } from 'react'
import './profileheader.css'
import axios from "axios";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Link } from 'react-router-dom';
import UserCard from '../../components/follow/followingComp';
import FollowerCard from '../../components/follow/followerComp';
import AWS from 'aws-sdk';


const ProfileHeader = ({ username }) => {
    const [followers, setFollowersList] = useState([]);
    const [following, setFollowingList] = useState([]);
    const [showFollowing, setShowFollowing] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [bio, setBio] = useState('');

    const uri = process.env.REACT_APP_URI;

    const [awsConfig, setAwsConfig] = useState(null);

    useEffect(() => {
        // Fetch AWS configuration when component mounts
        const fetchAwsConfig = async () => {
            try {
                
                AWS.config.update({
                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                    region: process.env.REACT_APP_AWS_REGION,
                });
                // Store bucket name if needed
                setAwsConfig(process.env.REACT_APP_AWS_BUCKET_NAME);
                console.log("Bucket Name:", process.env.REACT_APP_AWS_BUCKET_NAME);
            } catch (error) {
                console.error('Error fetching AWS config:', error);
            }
        };
        fetchProfilePicture();
        fetchBio(username); //for unit resting purposes
        fetchAwsConfig();
    }, []);
    const s3 = new AWS.S3();

    const fetchProfilePicture = async () => {
        try {
            const response = await axios.get(`${uri}/users/getProfilePicture/${username}`); // Adjust the endpoint as necessary
            setProfileImage(response.data.profilePicture); // Update state with the retrieved profile picture
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const params = {
                Bucket: awsConfig,
                Key: `profile-pictures/${username}/${file.name}`, // Unique key for the uploaded image
                Body: file,
                ContentType: file.type,
            };
            console.log("Uploading with params:", params);
            s3.upload(params, async (err, data) => {
                if (err) {
                    console.error("Error uploading image to S3:", err);
                    return;
                }
                console.log("Successfully uploaded image to S3:", data.Location);
                setProfileImage(data.Location); // Set the uploaded image URL
                // Now store the image URL in MongoDB (implement this in your backend)
                try {
                    await axios.post(`${uri}/users/updateProfilePicture`, {
                        imageUrl: data.Location,
                    });
                    console.log("Image URL stored in MongoDB");
                } catch (error) {
                    console.error("Error storing image URL in MongoDB:", error);
                }
            });
        }
    };

    const handleFollowingListClick = () => {
        setShowFollowing(!showFollowing);
    }

    const handleFollowerListClick = () => {
        setShowFollowers(!showFollowers);
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
        // setShowFollowers(!showFollowers);
    };

    const fetchMyFollowers = async () => {
        fetchFollowers(username);
    };

    const fetchFollowing = async (username) => {
        try {
            console.log(username);
            axios.get(`${uri}/users/following/${username}`).then(response => {
                const usernames = response.data.accounts_followed.map(following => following.username);
                setFollowingList(usernames);
                console.log("fetch following usernames: ",usernames);
            });
          } catch (error) {
            console.error('Error fetching following:', error);
        }
        // setShowFollowing(!showFollowing)
    };

    // const fetchBio = async (username) => {
    //     try {
    //         console.log(username);
    //         axios.get(`${uri}/users/getBio/${username}`).then(response => {
    //             //console.log("response: ", response);
    //             setBio(response.data);
                
    //         })
    //       } catch (error) {
    //         console.error('Error fetching following:', error);
    //     }
    //     // setShowFollowing(!showFollowing)
    // };
    const fetchBio = async (username) => {
        try {
            const response = await axios.get(`${uri}/users/getBio/${username}`);
            setBio(response.data);
        } catch (error) {
            console.error('Error fetching bio:', error);
        }
    };
    

    // const fetchBio = async (username) => {
    //     try {
    //         const response = axios.get(`${uri}/users/getBio/${username}`);
    //         console.log( "response",response);
    //         if (!response.data) {
    //                 setBio('no bio');
    //                 //console.log( "response",response.data);
    //             }
    //             else {
    //             setBio(response.data);
    //             }
 
    //     } catch (error) {
    //         console.error('Error fetching following:', error);
    //     }
        
    // }

    const fetchMyFollowing = async () => {
        fetchFollowing(username);
    };

    useEffect(() => {
        if (username){
            fetchMyFollowers();
            fetchMyFollowing();
            fetchBio(username);
        }

    }, [username])

    return (
        <div>
            <div className="profile-container">
                <div className='user-info'>
                    <div onClick={() => document.getElementById('fileInput').click()} className="profile-upload">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="profile-picture" />
                        ) : (
                            <AccountCircleOutlinedIcon className="profile-picture" />
                        )}
                    </div>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="header-username">
                        <h1>{username}</h1>
                    </div>
                    <button className='followers-button' onClick = {handleFollowingListClick}>
                       {following.length} following
                    </button>
                    <button className='following-button' onClick = {handleFollowerListClick}>
                        {followers.length} followers
                    </button>
                    
                </div>
                <div className="profile-bio">
                    <span>{bio}</span>

                </div>
            </div>
            <div className={`white-rounded-box ${showFollowers ? 'show' : ''}`}>
                <h3>Followers</h3>
                <div className="following-container">
                    {followers.length > 0 ? (
                        followers.map((follower, index) => (
                        <div key={index} className="followers">
                            <FollowerCard username={follower}/>
                        </div>
                        ))
                    ) : (
                        <p>Not following anyone.</p>
                    )}
                </div>
                <button className='submit-button' onClick={() => setShowFollowers(false)}>Close</button>
            </div>
            <div className={`white-rounded-box ${showFollowing ? 'show' : ''}`}>
                <h3>Following</h3>
                <div className="following-container">
                    {following.length > 0 ? (
                        following.map((following, index) => (
                        <div key={index} className="following">
                            <UserCard username={following}/>
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