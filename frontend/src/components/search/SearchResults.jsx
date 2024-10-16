import './searchresults.css';
import React from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

export default function SearchResults(){
    const username = 'username';
    const handle = 'handle_goes_here';

    return(
        <div className='result-container'>
            <div className='user-info'>
                <div className='profile-pic'>
                     <AccountCircleOutlinedIcon style={{ fontSize: '60px' }}/> 
                </div>
                <div className='username'>
                    <span className="name">{username}</span>
                    <span className="handle">@{handle}</span>
                </div>
            </div>
            <div className='follow-button'>
                <button>Follow</button>
            </div>
        </div>
    );
}