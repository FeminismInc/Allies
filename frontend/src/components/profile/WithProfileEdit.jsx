import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import './profileheader.css';
import CreatePostModal from '../../components/profile/CreatePostModal';
import axios from 'axios';

const WithProfileEdit = (WrappedComponent) => {
    return function ProfileHeaderForCurrentUser(props) {
        const { username,isCurrentUser } = props;
        const [bioText, setBioText] = useState("");
        const [showWhiteBox, setShowWhiteBox] = useState(false);
        const [showIconBox, setShowIconBox] = useState(false);
        const [showModal, setShowModal] = useState(false);
        const uri = "http://localhost:5050/api";

        const openModal = () => setShowModal(true);
        const closeModal = () => setShowModal(false);
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
                    <p>blocked accounts, private or public, ...</p>
                    <button className='submit-button' onClick={() => setShowIconBox(false)}>Close</button>
                </div>
            </div>
        );
    };
};

export default WithProfileEdit;