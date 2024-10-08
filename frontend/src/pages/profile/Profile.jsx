import React, {useEffect,useState} from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './profile.css'
import ProfileTabs from './ProfileTabs';
import axios from "axios";

//NTS: Changes to data in mongoDB: User Barbie is the author of 2 posts

export default function Profile() {
  
  const username = "matthew500"; //change this to username from sessionStorage 
  //const [username, setUsername] = useState('');
  const uri = 'http://localhost:5050/api';


  // useEffect(() => {

  //   axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
  //     .then(response => {
  //       setUsername(response.data.username); 
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user:', error);
        
  //     });
  // }, []); 

  return (
    <div className="profileMainContent">
      
        <div className="sidebarContainer">
          <Sidebar />
        </div>
        <div className="profile-container">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>bio</p>
        </div>
        <div className="profile-tabs">
        <ProfileTabs username={username} /> {/* Renders the  Profile Tabs for Barbie's profile */}
        </div>
      </div>
    </div>
  );
}

