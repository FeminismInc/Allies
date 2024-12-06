import "./post.css";
import { Button } from 'react-native';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from "react";
import axios from "axios"
import { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import AWS from 'aws-sdk';

export default function PostPage() {

    const uri = process.env.REACT_APP_URI;
    const navigate = useNavigate();

    const [text, setText] = useState('')
    const [textPic, setTextPic] = useState('')
    const [mediaUrl, setMediaUrl] = useState(null);
    const [username, setUsername] = useState('');
    const [awsConfig, setAwsConfig] = useState(null);


    useEffect(() => {
        axios.get(`${uri}/users/findUser`, { withCredentials: true })
            .then(response => {
                
                if (response.data.username) { //if a username was provided in the url, then we are trying to view their profile 
                    setUsername(response.data.username)
                }
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            })
    });

    useEffect(() => {
        // Fetch AWS configuration when component mounts
        const fetchAwsConfig = async () => {
            try {
                
                AWS.config.update({
                    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
                    region: process.env.REACT_APP_AWS_REGION,
                });
                // Store bucket name if needed
                setAwsConfig(process.env.REACT_APP_AWS_BUCKET_NAME);
                console.log("Bucket Name:", process.env.REACT_APP_AWS_BUCKET_NAME);
            } catch (error) {
                console.error('Error fetching AWS config:', error);
            }
        };
        fetchAwsConfig();
    }, []);

    const s3 = new AWS.S3();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const params = {
                Bucket: awsConfig,
                Key: `post-media/${username}/${file.name}`, // Path for uploaded media
                Body: file,
                ContentType: file.type,
            };
            s3.upload(params, async (err, data) => {
                if (err) {
                    console.error("Error uploading image to S3:", err);
                    return;
                }
                console.log("Successfully uploaded image to S3:", data.Location);
                
                const savedMedia = await axios.post(`${uri}/posts/uploadMedia`, {
                   url: data.Location,
                })
                setMediaUrl(savedMedia.data._id); // Store the media ObjectId
            });
        }
    };

    const submitPost = async () => {
        try {
            const postPayload = {
                text: textPic,
                media: mediaUrl ? [mediaUrl] : [], // Include the media URL if available
                hashtags: [], // Add hashtags if implemented
            };
    
            const response = await axios.post(`${uri}/posts/createPost`, postPayload);
            console.log("Post created successfully:", response.data);
            // Reset state after submission
            setTextPic("");
            setMediaUrl("");
            navigate(`/profile/${username}`)
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };
    

    return (
        <div className="postMainContent">
            <div className="sidebarContainer">
                <Sidebar />
            </div>
                <div className="postContainer">
                    <h1>What's on your mind with a picture? </h1>
                    <input
                        type="text"
                        value={textPic}
                        onChange={(e) => setTextPic(e.target.value)}
                        name="postText"
                        id="postText"
                        placeholder="Write something..."
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*, .gif"
                        id="imageInput"
                        name="postImage"
                    />
                    <Button title="Submit" onPress={submitPost} color="#bfa1f0" id="submitButton" />
            </div>
        </div>
    )
}