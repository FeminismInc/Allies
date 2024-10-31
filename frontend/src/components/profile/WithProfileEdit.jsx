import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import './profileheader.css';

const WithProfileEdit = (WrappedComponent) => {
    return function ProfileHeaderForCurrentUser(props) {
        const { isCurrentUser } = props;
        const [bioText, setBioText] = useState("");
        const [showWhiteBox, setShowWhiteBox] = useState(false);
        const [showIconBox, setShowIconBox] = useState(false);
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

        return (
            <div className="profile-header-container">
                <div className='user-info-container'>
                    <WrappedComponent {...props} />
                    {isCurrentUser && (
                        <button className="right-icon-button" onClick={handleIconButtonClick}>
                            <div className="right-icon-wrapper">
                                <SettingsIcon className='right-icon' />
                            </div>
                        </button>
                    )}
                </div>
                {isCurrentUser && (
                    <div className='edit-bio-container'>
                        <button className='edit-bio-button' onClick={handleButtonClick}>
                            <h3>Edit Bio</h3>
                        </button>
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