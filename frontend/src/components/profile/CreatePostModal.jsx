import React, { useState } from 'react';
import axios from 'axios';
import './createPostModal.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreatePostModal = ({ showModal, closeModal, onPostCreated }) => {
    const uri = "http://localhost:5050/api";
    const navigate = useNavigate();

    const [text, setText] = useState('');

    const submit = async (e) => {
        console.log("entered submit");
        e.preventDefault();
        try {
            await axios.post(`${uri}/posts/createPost`, { text });
            closeModal(); 
            navigate('/profile') //replace this with code that refreshes the page after post creation 
        } 
        catch(e) {
            console.log('Something went wrong creating a post')
        }
    };
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" >
                <h1>What's on your mind?</h1>
                    <input type="text" value={text} onChange={(e) => { setText(e.target.value) }} name="postText" id="postText"></input>
                <Button title="Submit" onClick={submit} color="#bfa1f0" id="submitButton">
                    Submit
                </Button>
                <Button onClick={closeModal} color="secondary" variant="outlined">
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default CreatePostModal;