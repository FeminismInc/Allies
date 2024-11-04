import "./post.css";
import {Button} from 'react-native';
import { useNavigate } from 'react-router-dom';
import React, {useEffect} from "react";
import axios from "axios"
import { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import AWS from 'aws-sdk';

export default function PostPage(){
    
    const uri = process.env.REACT_APP_URI;
    const navigate = useNavigate();

    const [text, setText] = useState('')

    const [imageFile, setImageFile] = useState(null); // State for image file

    const [awsConfig, setAwsConfig] = useState(null);
    
    useEffect(() => {
        // Fetch AWS configuration when component mounts
        const fetchAwsConfig = async () => {
            try {
                const response = await axios.get(`${uri}/users/aws-config`);
                AWS.config.update({
                    accessKeyId: response.data.accessKeyId,
                    secretAccessKey: response.data.secretAccessKey,
                    region: response.data.region,
                });
                // Store bucket name if needed
                setAwsConfig(response.data);
            } catch (error) {
                console.error('Error fetching AWS config:', error);
            }
        };

        fetchAwsConfig();
    }, []);

    const handleImageUpload = (e) => {
        setImageFile(e.target.files[0]);
    };

    const submitWithMedia = async (e) => {
        e.preventDefault();
        
        if (imageFile && awsConfig) {
            const s3 = new AWS.S3();
            const params = {
                Bucket: awsConfig.bucketName,
                Key: `Post-Pictures/${imageFile.name}`, // Use unique path
                Body: imageFile,
                ContentType: imageFile.type,
            };

            // Upload to S3
            s3.upload(params, async (err, data) => {
                if (err) {
                    console.error("Error uploading image to S3:", err);
                    return;
                }
                console.log("Successfully uploaded image to S3:", data.Location);

                // Step 2: Save URL as a Media object in MongoDB
                try {
                    const mediaResponse = await axios.post(`${uri}/posts/createMedia`, {
                        url: data.Location,
                        tagged_accounts: [] // Add tagged accounts if needed
                    });
                    const mediaId = mediaResponse.data._id; // Media object's ID

                    // Step 3: Create a post with the media ID
                    await axios.post(`${uri}/posts/createPost`, {
                        text,
                        media: [mediaId] // Associate media with post
                    });

                    console.log("Post created with media");
                    navigate('/profile');
                } catch (error) {
                    console.error("Error saving media or creating post:", error);
                }
            });
        } else {
            console.log("No image file selected or AWS config missing.");
        }
    };


    const submit = async (e) => {
        console.log("entered submit");
        e.preventDefault();
        try {
            // can add future if statement for media/hashtag/text stuff
            console.log("trying");
            const post = await axios.post(`${uri}/posts/createPost`, { //create new following object
                text,
            })

            navigate('/profile')

            // use $push to update a userDetail posts could send author ID rather than just author name and add it to user upon post creation
            
        }
        catch(e) {
            console.log('Something went wrong creating a post')
        }
        
    }

    return (
        <div className="postMainContent">
            <div className="sidebarContainer">
                <Sidebar/>
            </div>
            <div className="postContainer">
                <h1>What's on your mind? </h1>
                <input type="text" value={text} onChange={(e) => { setText(e.target.value) }} name="postText" id="postText"></input>
                <Button title = "Submit" onPress={submit} color="#bfa1f0" id="submitButton"/> 
                <h1>What's on your mind? </h1>
                <input type="file" onChange={handleImageUpload} />
                <input type="text" value={text} onChange={(e) => { setText(e.target.value) }} name="postText" id="postText"></input>
                <Button title = "Submit" onPress={submitWithMedia} color="#bfa1f0" id="submitButton"/> 
            </div>
        </div>
    )
}