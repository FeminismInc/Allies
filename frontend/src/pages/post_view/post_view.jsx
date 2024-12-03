import "./post_view.css";
import {Button} from 'react-native';
// import { useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import axios from "axios"
import { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Commentlog from '../../components/postView/Commentlog'
import UserPost from '../../components/post/userPost'
import { useLocation } from 'react-router-dom';

export default function PostViewPage(){

    const uri = "http://localhost:5050/api";
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    //const [post, setPost] = useState('');
    const location = useLocation();
    const post =location.state?.post;
    console.log(post);


    //const PostId = '67358b16426e9b7ea12adc2c'; {/**For testing purposes */}
    
    // useEffect(() => {
    //     // Function to fetch the post data
    //     const getPostById = async (PostId) => {
    //         try {
    //             const response = await axios.get(`${uri}/post/getPost/${PostId}`);
    //             setPost(response.data); // Set the fetched post in state
                
    //         } catch (err) {
    //             console.error('Error fetching post:', err);
                
    //         }
    //     };

    //     getPostById(PostId); // Call the function to fetch the post when the component mounts
    // }, [PostId]); // Re-run this effect whenever `postId` changes


    useEffect(() => {
        axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
          .then(response => {
            setUsername(response.data.username); 
          })
          .catch(error => {
            console.error('Error fetching user:', error);
            
          });
      }, []); 

    const send = async (e) => {
        console.log("entered submit");
        e.preventDefault();
        const text = document.getElementById("comment-input").value;

        try {
            // create a comment
            // comments are tied to posts or another comment
            // comments should not infinately chain, a comment of a comment cannot shouldnt have further comments
            // instagram style
            console.log("trying");
            const comment = await axios.post(`${uri}/posts/addComment/${post._id}`, { //create new comment object
                username, text,  //gonna swap out postId
            })

            // add it to the post currently on screen
            // small note, it seems that creating a comment for a post, and creating a comment for a comment are in different controllers

            setMessage('');
            
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
                <div className='post'>
                    <UserPost
                        post = {post}
                        username = {post.author}
                    />
                </div>

                
                    
                        <Commentlog 
                            PostId = {post._id}
                            username = {username}
                            message = {message}
                            setMessage={setMessage}
                            send={send}
                            /> 
                 
                    

            </div>
        </div>
    )
}