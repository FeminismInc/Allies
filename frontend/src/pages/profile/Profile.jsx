
import axios from 'axios';
import React, { useState, useEffect } from "react";
import './sidebar.css'
import './Sidebar'
import Sidebar from "./Sidebar";
import './profile.css'
import ProfileTabs from './ProfileTabs';

//NTS: Changes to data in mongoDB: User Barbie is the author of 2 posts

export default function Profile() {
  
  const username = "BarbieRoberts59"; //change this to username from sessionStorage 


  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{username}'s Profile</h1>
        <p>bio</p>
      </div>
      <ProfileTabs username={username} /> {/* Renders the  Profile Tabs for Barbie's profile */}
      {/* <div class="row">
          <div class="col">
            <div class="username-box">Lex_the_cat</div>
            <div><p> </p></div>
            <img src={ require('./IMG_4628.jpg') } width={350} height={350}/>
          </div>
        </div> */}
    </div>
  );
}

