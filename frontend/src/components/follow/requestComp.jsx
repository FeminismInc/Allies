import React, { useEffect, useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import axios from 'axios';
const RequestCard = ({ userID }) => {
    const [isRequested, setIsRequested] = useState(true);
    const [username, setUsername] = useState('');
    const uri = "http://localhost:5050/api";
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${uri}/users/findUserById/${userID}`);
                console.log("DJKAHSDKAJWDHAKLSJDLAWKDJAW");
                console.log(response.data.username);
                setUsername(response.data.username);  // Assuming response contains { username: 'someUsername' }
                setIsRequested(true);  // Set to true after fetching user data
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (userID) {
            fetchUserDetails();  // Call the async function
        }
    }, [userID]);
    const handleAcceptance = async () => {
        const response = await axios.post(`${uri}/users/acceptFollowRequest`, {username})
        setIsRequested(false);
    };
    const handleDecline = async () => {
        const response = await axios.post(`${uri}/users//removeFollowRequest`, {username})
        setIsRequested(false);
    };

    if (!isRequested) return null;

    return (
        <div className="followers">
            <div className="followers-header">
                <AccountCircleOutlinedIcon className="profile-picture" />
                <div className="followers-info">
                    <span className="username">{username}</span>
                </div>
            </div>
            <button onClick={handleAcceptance}>
                "Accept"
            </button>
            <button onClick={handleDecline}>
                "Decline"
            </button>
        </div>
    );
};
export default RequestCard;