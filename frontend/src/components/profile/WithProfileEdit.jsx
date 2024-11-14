import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import './profileheader.css';
import CreatePostModal from '../../components/profile/CreatePostModal';


const WithProfileEdit = (WrappedComponent) => {
    return function ProfileHeaderForCurrentUser(props) {
        const { isCurrentUser } = props;
        const [bioText, setBioText] = useState("");
        const [showWhiteBox, setShowWhiteBox] = useState(false);
        const [showIconBox, setShowIconBox] = useState(false);
        const [showModal, setShowModal] = useState(false);

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
            console.log("submitted bio:", bioText); // im just logging the text rn im not sure what to do
                                                    //TODO: create profile APIs for bio
            setShowWhiteBox(false);
        }

        return (
            <div className="currentuser-header-container">
                    {isCurrentUser && (
                        <>
                        <div className='header'>
                        <WrappedComponent {...props} />
                        <div className='currentuser-header-rightside'>
                        <button className="right-icon-button" onClick={handleIconButtonClick}>
                            <div className="right-icon-wrapper">
                                <SettingsIcon className='right-icon' />
                            </div>
                        </button>
                        </div>
                        </div>
                        </>
                    )}
                
                {isCurrentUser && (
                    <div className='currentuser-header-below'>
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
                            />
                      
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