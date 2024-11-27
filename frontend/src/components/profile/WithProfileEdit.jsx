import React, { useEffect, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import './profileheader.css';
import CreatePostModal from '../../components/profile/CreatePostModal';
import { Switch } from '@mui/material';
import axios from 'axios';

import axios from 'axios';

const WithProfileEdit = (WrappedComponent) => {
    return function ProfileHeaderForCurrentUser(props) {

        const uri = 'http://localhost:5050/api'

        const { username,isCurrentUser } = props;
        const [bioText, setBioText] = useState("");
        const [showWhiteBox, setShowWhiteBox] = useState(false);
        const [showIconBox, setShowIconBox] = useState(false);
        const [showModal, setShowModal] = useState(false);
        const [checked, setChecked] = useState(true);

        const openModal = () => setShowModal(true);
        const closeModal = () => setShowModal(false);

        useEffect(() => {
            const fetchPrivacyStatus = async () => {
                try {
                    const response = await axios.get(`${uri}/users/getPrivacyStatus`);
                    setChecked(response.data.public_boolean); // Set the state to the fetched public_boolean
                } catch (error) {
                    console.error("Error fetching privacy status:", error);
                }
            };

            if (isCurrentUser) {
                fetchPrivacyStatus(); // Fetch only if it's the current user
            }
        }, [isCurrentUser]);

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
            try {
                axios.post(`${uri}/users/updateBio`,{username,bioText})
                setShowWhiteBox(false);
                console.log("submitted bio:", bioText);

            } catch (error) {
                console.error('Error fetching following:', error);
            }

           
            
        }
        
        const handleChange = async (event) => {
            const newChecked = event.target.checked;
            setChecked(newChecked);
        
            try {
                // Update the privacy status by calling the API (no need to send public_boolean)
                const response = await axios.patch(`${uri}/users/updatePrivacyStatus`);
                console.log("Privacy status updated:", response.data);
            } catch (error) {
                console.error("Error updating privacy status:", error);
            }
        };



        
        if (!isCurrentUser) return null;
        console.log("iscurrentuser:",isCurrentUser);
        console.log("username :",username);

        return (
            <div className="currentuser-header-container">
                    {isCurrentUser && (
                        <>
                        <div className='currentuser-header-top'>
                        <WrappedComponent {...props} />
                        <div className='currentuser-header-rightside'>
                        <button className="right-icon-button" onClick={handleIconButtonClick}>
                            <div className="right-icon-wrapper">
                                <SettingsIcon className='right-icon' />
                            </div>
                        </button>
                        <button className='edit-bio-button' onClick={handleButtonClick}>
                                    <h3>Edit Bio</h3>
                         </button>
                         <button className='create-post-button' onClick={openModal} >
                                New Post
                            </button>
                            <CreatePostModal
                                showModal={showModal}
                                closeModal={closeModal}
                                onPostCreated={() => console.log("Post created!")}
                                username={username}
                            />
                        </div>
                        </div>
                        </>
                    )}
                
                {isCurrentUser && (
                    <div className='currentuser-header-below'>
                        {/* <button className='edit-bio-button' onClick={handleButtonClick}>
                            <h3>Edit Bio</h3>
                        </button> */}
                            
                      
                    </div>

                )}
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
                    <div className="switch-container">
                        <label className="switch-label">
                            Private Account?
                        </label>
                        <Switch
                            id="settings-switch"
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </div>
                    <button className='submit-button' onClick={() => setShowIconBox(false)}>Close</button>
                </div>
            </div>
        );
    };
};

export default WithProfileEdit;