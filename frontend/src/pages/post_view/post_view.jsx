import "./post_view.css";
import {Button} from 'react-native';
import { useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import axios from "axios"
import { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

export default function PostViewPage(){

    const uri = "http://localhost:5050/api";
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    const [text, setText] = useState('')

    // useEffect(() => {

    //     axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
    //       .then(response => {
    //         setUsername(response.data.username); 
    //       })
    //       .catch(error => {
    //         console.error('Error fetching user:', error);
            
    //       });
    //   }, []); 

    const submit = async (e) => {
        console.log("entered submit");
        e.preventDefault();
        try {
            // create a comment
            // comments are tied to posts or another comment
            // comments should not infinately chain, a comment of a comment cannot shouldnt have further comments
            // instagram style
            console.log("trying");
            const comment = await axios.post(`${uri}/posts/addComment`, { //create new comment object
                username, text, 
            })

            // add it to the post currently on screen
            // small note, it seems that creating a comment for a post, and creating a comment for a comment are in different controllers


            navigate('/profile')
            
        }
        catch(e) {
            console.log('Something went wrong creating a comment')
        }
        
    }
    // This page should be accessed upon clicking a post, that post should be saved and used to repopulate this page,
    // page should consist of the original post content at the top, a separator, and then subsequent comments
    // adding a comment to the post can be done with textbox submit, either directly underneath the post, or at the bottom of the screen
    // not sure how we want to handle comments of a comment

    return (
        <div className="postViewContent">
            <div className="sidebarContainer">
                <Sidebar/>
            </div>
            {/** will likely have a component deal with post and comments that are displayed */}

            <div className='post-container'>
                <div className='main-post'>
                    <h1>Imagine this is an actual post</h1>
                </div>

                {/* <div className="comment-input-container">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="comment-input"
                        placeholder="Type your message..."
                        id="comment-input"
                    />
                    <IconButton aria-label="send-button" size='large' onClick={send}>
                        <SendIcon fontSize="inherit" />
                    </IconButton>
                </div> */}
            </div>
        </div>
    )
}