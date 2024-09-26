import { useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import "./form.css"
import { Button } from 'react-native';
import axios from "axios"
import { useState } from 'react';

export default function ProfileForm() {

    const uri = "mongodb+srv://kenhun2020:lhOAvQxVo7yJskRE@cluster0.ebktn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [handle, setHandle] = useState('')
    const [pronouns, setPronouns] = useState('')
    const [birthdate, setBirthdate] = useState('')

    const navigate = useNavigate();

    const GoToProfile = () => {
        navigate('/profile');
    };

    //when pressing submit button take all input data for processing
    async function submit(e) {
        console.log(username)
        e.preventDefault();
        try {
            await axios.post(`${uri}/form`, { //send data to index.js to check
                username, email, password, handle, pronouns, birthdate
            })
            .then(res=> {
                if (res.data === "exist") {
                    alert("User already exists")
                } else if(res.data === "notexist") { //if new account created open to profile
                    navigate('/profile');
                }
            })
        }
        catch(e) {
            console.log('test')
        }
    }

    return (
        <div className='userForm'>
            <form className="userInfo">
                <div class="Username">
                    <label for="username">Username: </label>
                    <input type="text" onChange={(e) => { setUsername(e.target.value) }} name="username" id="username" placeholder='Enter your username' required />
                </div>
                <div class="Email">
                    <label for="email">Enter your email: </label>
                    <input type="email" onChange={(e) => { setEmail(e.target.value) }} name="email" id="email" placeholder='Enter your email' required />
                </div>
                <div class="Password">
                    <label for="password">Enter your password: </label>
                    <input type="password" onChange={(e) => { setPassword(e.target.value) }} name="password" id="password" minlength="8" placeholder='Enter your password' required />
                    <p className='passwordRec'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                </div>
                <div class="Handle">
                    <label for="handle">Enter your Handle (Name): </label>
                    <input type="text" onChange={(e) => { setHandle(e.target.value) }} name="handle" id="handle" placeholder='Enter your profile name' required />
                </div>
                <div className="Pronouns">
                <legend>Preferred Pronouns?</legend>
                    <div className='Radio'>
                        <label><input type="radio" onClick={(e) => { setPronouns(e.target.value) }} name="radio" value="she/her"/>She/Her</label>
                        <label><input type="radio" onClick={(e) => { setPronouns(e.target.value) }} name="radio" value="he/him"/>He/Him</label>
                        <label><input type="radio" onClick={(e) => { setPronouns(e.target.value) }} name="radio" value="they/them"/>They/Them</label>
                        <label><input type="radio" onClick={(e) => { setPronouns(e.target.value) }} name="radio" value="other"/>Other</label>
                    </div>
                </div>
                <div className="Birthdate">
                    <label for="birthdate">What is your birthday? </label>
                    <input type="date" onChange={(e) => { setBirthdate(e.target.value) }} id="birthdate" name="birthdate"/>
                </div>
                <p className='termsOfService'>By creating an account, you agree to the Terms of Use and Privacy Policy. </p>
                <Button title = "Submit" onClick={submit} color="#bfa1f0"></Button>
            </form>
        </div>
      );

}
