import React, { useEffect, useState } from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './profile.css'
import ProfileTabs from './ProfileTabs';
import axios from "axios";
import ProfileHeader from './ProfileHeader'
import { useParams } from "react-router-dom"; // for dynamic routing



export default function Profile() {

  const { username: routeUsername } = useParams(); // gets the username from url params

  const [username, setUsername] = useState('');
  const uri = 'http://localhost:5050/api';


  useEffect(() => {
    if (routeUsername) { //if a username was provided in the url, then we are trying to view their profile 
      setUsername(routeUsername);
      console.log("display other user's profile:",username);
    } else {  //otherwise, we are trying to view the currently logged in user's profile 
      axios.get(`${uri}/users/findUser`, { withCredentials: true })
        .then(response => {
          setUsername(response.data.username);
          console.log("display current user's profile:",username);
        })
        .catch(error => {
          console.error('Error fetching user:', error);

        });
    }
  }, [routeUsername]);  //if routeUsername changes, call this effect again

  return (
    <div className="profileMainContent">
      <div className="sidebarContainer">
        <Sidebar />
      </div>
      <div className="profile-container">
        {/* since ProfileHeader includes profile editing buttons, we would need to conditionally render those buttons 
        based on whether or not 'username' is the authorized user or not */}
        <ProfileHeader username={username} />   
        <div className="profile-tabs">
          <ProfileTabs username={username} /> 
        </div>
      </div>
    </div>
  );
}

