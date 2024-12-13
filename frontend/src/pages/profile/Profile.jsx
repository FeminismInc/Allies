import React, { useEffect, useState } from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import './profile.css'
import ProfileTabs from '../../components/profile/ProfileTabs';
import axios from "axios";
import ProfileHeader from '../../components/profile/ProfileHeader'
import { useParams } from "react-router-dom"; // for dynamic routing
import WithProfileEdit from '../../components/profile/WithProfileEdit';
import ForOtherUser from "../../components/profile/ForOtheruser";

const ProfileHeaderForCurrentUser = WithProfileEdit(ProfileHeader);
const ProfileHeaderForOtherUser = ForOtherUser(ProfileHeader);

export default function Profile() {

  const { username: routeUsername } = useParams(); // gets the username from url params
  const [isCurrentUser, setIsCurrentUser] = useState('');

  const uri = process.env.REACT_APP_URI;


  useEffect(() => {
    axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
      .then(response => {
        console.log("routeUsername:", routeUsername);
         if (routeUsername && response.data.username && (routeUsername!==response.data.username)) { //if a username was provided in the url, then we are trying to view their profile 
          setIsCurrentUser(false);
          console.log("display other user's profile:", routeUsername);
      }
      else {  //otherwise, we are trying to view the currently logged in user's profile 
        setIsCurrentUser(true);
        
      }
    })
      .catch(error => {
       console.error('Error fetching user:', error);
      })
      }); 
    


  // useEffect(() => {
  //   if (routeUsername && (routeUsername!=loggedInUsername)) { //if a username was provided in the url, then we are trying to view their profile 
  //     setUsername(routeUsername);
  //     setIsCurrentUser(false);
  //     console.log("display other user's profile:", routeUsername);
  //   } else {  //otherwise, we are trying to view the currently logged in user's profile 
  //         setUsername(loggedInUsername);
  //         setIsCurrentUser(true);
  //         console.log("display current user's profile:", loggedInUsername);
  //       }
  //   }
  // , [routeUsername]);  //if routeUsername changes, call this effect again
  // //if routeusername = anything or

  return (
    <div className="profileMainContent">
      <div className="sidebarContainer">
        <Sidebar />
      </div>
      <div className="profile-container">
      <ProfileHeaderForCurrentUser
            username={routeUsername}
            isCurrentUser={isCurrentUser}/>
      <ProfileHeaderForOtherUser
            username={routeUsername}
            isCurrentUser={isCurrentUser}/>
        
        <div className="profile-tabs">
          <ProfileTabs username={routeUsername} />
        </div>
      </div>
    </div>
  );
}

