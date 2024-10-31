import React, { useEffect, useState } from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './profile.css'
import ProfileTabs from '../../components/profile/ProfileTabs';
import axios from "axios";
import ProfileHeader from '../../components/profile/ProfileHeader'
import { useParams } from "react-router-dom"; // for dynamic routing
import WithProfileEdit from '../../components/profile/WithProfileEdit';

const ProfileHeaderForCurrentUser = WithProfileEdit(ProfileHeader);

export default function Profile() {

  const { username: routeUsername } = useParams(); // gets the username from url params

  const [username, setUsername] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const uri = 'http://localhost:5050/api';


  useEffect(() => {
    if (routeUsername) { //if a username was provided in the url, then we are trying to view their profile 
      setUsername(routeUsername);
      setIsCurrentUser(false);
      console.log("display other user's profile:", routeUsername);
    } else {  //otherwise, we are trying to view the currently logged in user's profile 
      axios.get(`${uri}/users/findUser`, { withCredentials: true })
        .then(response => {
          setUsername(response.data.username);
          setIsCurrentUser(true);
          console.log("display current user's profile:", response.data.username);
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
        <ProfileHeaderForCurrentUser
          username={username}
          isCurrentUser={isCurrentUser}
        />
        <div className="profile-tabs">
          <ProfileTabs username={username} />
        </div>
      </div>
    </div>
  );
}

