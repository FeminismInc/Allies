import React, {useEffect, useState} from "react";
import  {gapi} from 'gapi-script';
import LoginButton from "../../components/google_auth/google_login";
import "./login.css";
import personIcon from '../../assets/person_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import passwordIcon from '../../assets/lock_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import {Button} from 'react-native';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const clientID = "";

const uri = 'http://localhost:5050';

export default function LoginSignUp() {

  useEffect(()=>{
      function start() {
          gapi.client.init({
          clientId: clientID,
          scope: ""
          })
      };
      gapi.load('client:auth2', start)

      const signUpButton = document.getElementById('signUpButton');
    if (signUpButton) {
      signUpButton.addEventListener('click', () => navigate('/home'));{/*Change this to the sign up route */}
    }

  }, []);
  
  const [username, setUsername] = useState("");
  const [handle, setHandle] = useState("");
  const navigate = useNavigate();

  const GoToHomePage = () => {
    navigate('/home');
  };

  const postEmail = () => {
    
    if (!username || !handle) {
      alert("Please fill in both username and password.");
      return; // Exit the function early
    }

    axios.post(`${uri}/findUserbyEmail`, { username, handle })
      .then(response => {
        console.log(response.data); 
        if (response.data.exists) {
          navigate("/profile");
        } else {
          alert("Email not found. Please sign up.");
        }
      })
      .catch(err => console.log(err));  
    
  const GoToForm = () => {
    navigate('/form');
  };
  const GoToProfilePage = () => {
    navigate('/profile');
  };

  return (
    <div className = "loginPage">
      <div className="leftSide">
      <div className = "column left">
        <div className = "company">
        <h1 className = "appName">Allies</h1>
        <p className = "mission">Connect, Collaborate, and Empower</p>
        </div>
      </div>
      </div>
      <div className="rightSide">
      <div className ="column right">
        <h1>Log in</h1>
        <div className ="inputEmail"> {/*Make inputs into components */}
          <img src={personIcon}/>
          <input type="email" placeholder ="email" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className = "inputPassword">
          <img src={passwordIcon}/>
          <input type="password" placeholder ="password" value={handle} onChange={(e) => setHandle(e.target.value)}/>
        </div>
        <Button 
        title="Login"
        color= "#f194ff"
        onPress={postEmail}
      />                                {/*Probably get rid of Button styling is shit*/}
        <h2><span>OR</span></h2>
        <LoginButton GotoHomePage={GoToHomePage}/>
        <LoginButton GotoHomePage={GoToHomePage}/>  {/*facebook*/}
        <LoginButton GotoHomePage={GoToHomePage}/>  {/*github*/}
        <hr className = "separator"/>
          <h3>Don't have an Account? <span id="signUpButton">Sign up!</span></h3>
      </div>
      </div>
    </div>
  );
}
} {/* temporary bracket to make the code run */}
