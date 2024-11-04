import React, { useState } from 'react';
import './profileheader.css';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';

const ForOtherUser = (WrappedComponent) => {
    return function ProfileHeaderForOthertUser(props) {
        const { isCurrentUser } = props;
        console.log("iscurrentuser:",isCurrentUser);

        return (
             <div className="otheruser-header-container">
                    {!isCurrentUser && (
                        <>
                         <div className='header'>
                        <WrappedComponent {...props} />
                        <div className='otheruser-header-rightside'> 
                            <Link to={`/messages/`} className="messages-link">
                                <button className='message'>
                                    <EmailIcon/>
                                </button>
                            </Link>
                         </div>
                         </div></> 
                       
                    )} 
                
             </div>
        );
    };
};

export default ForOtherUser;