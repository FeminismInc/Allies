import { useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import "./form.css"
import { Button } from 'react-native';
import axios from "axios"
import { useState } from 'react';

export default function ProfileForm() {

    const uri = process.env.REACT_APP_URI; //http://54.176.5.254:5050/api

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [handle, setHandle] = useState('')
    const [pronouns, setPronouns] = useState('')
    const [birthdate, setBirthdate] = useState('')

    const navigate = useNavigate();

    const GoToProfile = () => {
        navigate(`/profile/${username}`);
    };

    //when pressing submit button take all input data for processing
    const submit = async (e) => {
        console.log(username)
        
        e.preventDefault();
        try {
            if (!email || !password ||  !username || !handle || !pronouns || !birthdate) {
                alert("Please fill out all sections.");
                return; // Exit the function early
              }
                    try {
                        const response = await axios.post(`${uri}/users/form`, { //send data to index.js to check
                            username, email, password, handle, pronouns, birthdate,
                        })
                        console.log(response)
                        `/profile/${response.data.username}`
                    }
                    catch(e) {
                        console.log('test1')
                    }
                    //console.log(response)
                }
                catch(e) {
                    console.log('test2')
                }
                
                axios.post(`${uri}/users/findUserbyEmail`, { email, password })
                .then(response => {
                  console.log(response.data); 
                  if (response.data.exists) {
                    navigate(`/profile/${response.data.username}`);
                  } else {
                    alert("Email not found. Please sign up.");
                  }
                })
                .catch(err => console.log(err)); 
    }

    function hidePassword() {
        var passInput = document.getElementById("password");
        if (passInput.type === "password") {
            passInput.type = "text";
        } else {
            passInput.type = "password";
        }
      } 

    function otherTextBox() {
        var other = document.getElementById("other");
        var otherPronouns = document.getElementById("otherPronouns");
        if (other.checked === true) {
            setPronouns("");
            otherPronouns.style.display = 'block';
        }
    }

    return (
        <div className='userForm'>
            <form className="userInfo">
                <div class="Username">
                    <div className = "required"><label for="username">Username: *</label> <span>* = required</span></div>
                    <input type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} name="username" id="username" placeholder='Enter your username' required />
                </div>
                <div class="Email">
                    <label for="email">Enter your email: *</label>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} name="email" id="email" placeholder='Enter your email' required />
                </div>
                <div class="Password">
                    <div className='passHide'>
                        <label for="password">Enter your password: *</label>
                        <Button title = "Hide" id="passwordButton" color="#bfa1f0" onPress={hidePassword}> Hide</Button>
                    </div>
                    <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} name="password" id="password" minlength="8" placeholder='Enter your password' required />
                    <p className='passwordRec'>Recommended to use 8 or more characters with a mix of letters, numbers & symbols</p>
                </div>
                <div class="Handle">
                    <label for="handle">Enter your Handle (Name): *</label>
                    <input type="text" value={handle} onChange={(e) => { setHandle(e.target.value) }} name="handle" id="handle" placeholder='Enter your profile name' required />
                </div>
                <div className="Pronouns">
                <legend>Preferred Pronouns?*</legend>
                    <div className='Radio'>
                        <div className='radioButtons'>
                            <label><input type="radio" onClick={(e) => { setPronouns(e.target.value) }} name="radio" id = "she/her" value="she/her"/>She/Her</label>
                            <label><input type="radio" onClick={(e) => { setPronouns(e.target.value) }} name="radio" id="he/him" value="he/him"/>He/Him</label>
                            <label><input type="radio" onClick={(e) => { setPronouns(e.target.value) }} name="radio" id="they/them" value="they/them"/>They/Them</label>
                            <label><input type="radio" onClick= {otherTextBox} name="radio" id = "other"/>Other</label>
                        </div>
                        <div className='otherText'>
                            <input type='text' value = {pronouns} onChange={(e) => { setPronouns(e.target.value) }} name="otherPronouns" id="otherPronouns" placeholder='Enter your preferred pronouns' required/>
                        </div>
                    </div>
                </div>
                <div className="Birthdate">
                    <label for="birthdate">What is your birthday? *</label>
                    <input type="date" value={birthdate} onChange={(e) => { setBirthdate(e.target.value) }} id="birthdate" name="birthdate"/>
                </div>
                <p className='termsOfService'>By creating an account, you agree to the Terms of Use and Privacy Policy. </p>
                <Button title = "Submit" onPress={submit} color="#bfa1f0"/>
            </form>
        </div>
      );

}
