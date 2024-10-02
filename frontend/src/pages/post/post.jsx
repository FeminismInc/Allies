import "./post.css";
import {Button} from 'react-native';

export default function PostPage(){

    return (
        <div className="postContainer">
            <h1>What's on your mind? </h1>
            <input type="text" name="postText" id="postText"></input>
            <Button title = "Submit" color="#bfa1f0" id="submitButton"/> 
        </div>
    )
}