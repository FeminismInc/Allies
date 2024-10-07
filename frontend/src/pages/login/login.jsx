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

const uri = 'http://localhost:5050/api';

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
      signUpButton.addEventListener('click', () => navigate('/form'));
    }

  });
  
  const [email, setUsername] = useState("");
  const [password, setHandle] = useState("");
  const navigate = useNavigate();

  const GoToHomePage = () => {
    navigate('/profile');
  };

  const postEmail  = () => {
    
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }

    axios.post(`${uri}/users/findUserbyEmail`, { email, password })
      .then(response => {
        console.log(response.data); 
        if (response.data.exists) {
          navigate("/profile");
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
          <input type="email" placeholder ="email" value={email} onChange={(e) => setUsername(e.target.value)}/>
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
        <h2><span>OR</span></h2>
        {/* <LoginButton GotoHomePage={GoToHomePage}/>
        <LoginButton GotoHomePage={GoToHomePage}/> 
        <LoginButton GotoHomePage={GoToHomePage}/> */}
        <hr className = "separator"/>
          <h3>Don't have an Account? <span id="signUpButton">Sign up!</span></h3>
      </div>
      </div>
    </div>
  );
}

