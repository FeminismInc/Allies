import React from 'react';
import './profileheader.css';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';

const ForOtherUser = (WrappedComponent) => {
    return function ProfileHeaderForOtherUser(props) {
        const { isCurrentUser,routeUsername,username } = props;
        const navigate = useNavigate();
        const handleMessageClick = () => {
            navigate('/messages', { state: { routeUsername } });
        }; 
        // const [isCurrentUser, setIsCurrentUser] = useState(false);
        // console.log("iscurrentuser:",isCurrentUser);
        // console.log("username :",username);
        if (isCurrentUser) return null;
        console.log("iscurrentuser:",isCurrentUser);
        console.log("username :",username);
        return (
             <div className="otheruser-header-container">
                    {!isCurrentUser && (
                        <>
                         <div className='otheruser-header-top'>
                        <WrappedComponent {...props} />
                        <div className='otheruser-header-rightside'> 
                                <button  aria-label="message-button" onClick={handleMessageClick} className='message-button'>
                                    <EmailIcon/>
                                </button>
                            
                         </div>
                         </div></> 
                       
                    )} 
                
             </div>
        );
    };
};

export default ForOtherUser;