import React, {useEffect, useState} from "react";
import  {gapi} from 'gapi-script';
// import LoginButton from "../../components/google_auth/google_login"; import later
import "./login.css";
import personIcon from '../../assets/person_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import passwordIcon from '../../assets/lock_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import {Button} from 'react-native';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const clientID = "989398909621-2iju5rvgm8n9cbj22oc44e6hmnl7ht40.apps.googleusercontent.com";

const uri = process.env.REACT_APP_URI; //http://54.176.5.254:5050/api

export default function LoginSignUp() {

  useEffect(()=>{
      function start() {
          gapi.auth2.init({
          clientId: clientID,
          scope: ""
          })
      };
      gapi.load('client:auth2', start)

      const signUpButton = document.getElementById('signUpButton');
    if (signUpButton) {
      signUpButton.addEventListener('click', () => navigate('/form'));
    }

  });
  
  const [email, setEmail] = useState("");
  const [password, setHandle] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const GoToHomePage = () => {
    navigate(`/profile/${username}`);
  };

  const postEmail  = () => {
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }
    axios.post(`${uri}/users/findUserbyEmail`, { email, password })
      .then(response => {
        console.log(response.data); 
        if (response.data) {
          navigate(`/profile/${response.data.username}`);
        } else {
          alert("Email not found. Please sign up.");
        }
      })
      .catch(err => console.log(err));  
    }

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
          <input type="email" placeholder ="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className = "inputPassword">
          <img src={passwordIcon}/>
          <input type="password" placeholder ="password" value={password} onChange={(e) => setHandle(e.target.value)}/>
        </div>
        <Button 
        title="Login"
        color= "#f194ff"
        onPress={postEmail}
      />                               
        <hr className = "separator"/>
          <h3>Don't have an Account? <span id="signUpButton">Sign up!</span></h3>
      </div>
      </div>
    </div>
  );
}

