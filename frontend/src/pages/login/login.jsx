import React, {useEffect} from "react";
import  {gapi} from 'gapi-script';
import LoginButton from "../../components/google_auth/google_login";
import "./login.css";
import personIcon from '../../assets/person_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import passwordIcon from '../../assets/lock_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';
import {Button} from 'react-native';
import { useNavigate } from 'react-router-dom';

const clientID = "" //change to Client ID

export default function LoginSignUp() {

  useEffect(()=>{
      function start() {
          gapi.client.init({
          clientId: clientID,
          scope: ""
          })
      };
      gapi.load('client:auth2', start)
  });

  const navigate = useNavigate();

  const GoToHomePage = () => {
    navigate('/home');
  };

  return (
    <div className = "loginPage">
      <div className = "column left">
        <div className = "company">
        <h1 className = "appName">Allies</h1>
        <p className = "mission">Connect, Collaborate, and Empower</p>
        </div>
      </div>
      <div className ="column right">
        <h1>Sign up or Log in</h1>
        <div className ="inputEmail"> {/*Make inputs into components */}
          <img src={personIcon}/>
          <input type="email" placeholder ="email"/>
        </div>
        <div className = "inputPassword">
          <img src={passwordIcon}/>
          <input type="password" placeholder ="password"/>
        </div>
        <Button 
        title="Login"
        color= "#f194ff"
        onPress={GoToHomePage}
      />                                {/*Probably get rid of Button styling is shit*/}
        <hr className = "separator"/>
        <LoginButton GotoHomePage={GoToHomePage}/>
      </div>
    </div>
  );
}

