import { useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import "./form.css"
import { Button } from 'react-native';

export default function ProfileForm() {

    const navigate = useNavigate();

    const GoToProfile = () => {
        navigate('/profile');
    };

    return (
        <div className='userForm'>
            <form className="userInfo">
                <div class="Username">
                    <label for="username">Username: </label>
                    <input type="text" name="username" id="username" placeholder='Enter your username' required />
                </div>
                <div class="Email">
                    <label for="email">Enter your email: </label>
                    <input type="email" name="email" id="email" placeholder='Enter your email' required />
                </div>
                <div class="Password">
                    <label for="password">Enter your password: </label>
                    <input type="password" name="password" id="password" minlength="8" placeholder='Enter your password' required />
                    <p className='passwordRec'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                </div>
                <div class="Handle">
                    <label for="handle">Enter your Handle (Name): </label>
                    <input type="text"  name="handle" id="handle" placeholder='Enter your profile name' required />
                </div>
                <div className="Pronouns">
                <legend>Preferred Pronouns?</legend>
                    <div className='Radio'>
                        <label><input type="radio" name="radio" value="she/her"/>She/Her</label>
                        <label><input type="radio" name="radio" value="he/him"/>He/Him</label>
                        <label><input type="radio" name="radio" value="they/them"/>They/Them</label>
                        <label><input type="radio" name="radio" value="other"/>Other</label>
                    </div>
                </div>
                <div className="Birthdate">
                    <label for="birthdate">What is your birthday? </label>
                    <input type="date" id="birthdate" name="birthdate"/>
                </div>
                <p className='termsOfService'>By creating an account, you agree to the Terms of Use and Privacy Policy. </p>
                <Button title = "Submit" color="#bfa1f0"></Button>
            </form>
        </div>
      );

}
