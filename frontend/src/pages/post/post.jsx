import "./post.css";
import {Button} from 'react-native';
import { useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import axios from "axios"
import { useState } from 'react';

export default function PostPage(){
    
    const uri = "http://localhost:5050/api";
    const navigate = useNavigate();

    const [text, setText] = useState('')

    const submit = async (e) => {
        console.log("entered submit");
        e.preventDefault();
        try {
            // can add future if statement for media/hashtag/text stuff
            console.log("trying");
            const post = await axios.post(`${uri}/posts/createPost`, { //create new following object
                text
            })

            navigate('/profile')

            // use $push to update a userDetail posts could send author ID rather than just author name and add it to user upon post creation
            
        }
        catch(e) {
            console.log('Something went wrong creating a post')
        }
        
    }


    return (
        <div className="postContainer">
            <h1>What's on your mind? </h1>
            <input type="text" value={text} onChange={(e) => { setText(e.target.value) }} name="postText" id="postText"></input>
            <Button title = "Submit" onPress={submit} color="#bfa1f0" id="submitButton"/> 

        </div>
    )
}