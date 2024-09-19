
import './Data_Button.css';
import axios from 'axios';
import React, { useState } from "react";

export default function Data_Button() {
    const [users, setUsers] = useState([]);
    const fetchData = () => {
        axios.get('http://localhost:5050/getUsers')
            .then(response => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch(err => console.log(err));
    };
    const [posts, setPosts] = useState([]);
    const fetchPosts = () => {
        axios.get('http://localhost:5050/getPosts')
            .then(response => {
                setPosts(response.data);
            })
            .catch(err => console.error(err));
    };
    const [convos, setConvos] = useState([]);
    const fetchConvos = () => {
        axios.get('http://localhost:5050/getConvos')
            .then(response => {
                setConvos(response.data);
            })
            .catch(err => console.error(err));
    };
    return (
        <div className="container">
                {/* Button for the first table */}
            <button onClick={fetchData}>Display Data</button>
            <div className="table-container">
                {users.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Handle</th>
                                <th>Joined</th>
                                <th>Bio</th>
                                <th>Birthday</th>
                                <th>Blocked</th>


                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.handle}</td>
                                    <td>{user.joined}</td>
                                    <td>{user.bio}</td>
                                    <td>{user.birthday}</td>
                                    <td>{user.blocked}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
                <button onClick={fetchPosts}> Posts</button>
            <div className="table-container">
                {posts.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Creator</th>
                                <th>Date Created</th>
                                <th>Text</th>
                                <th>Media</th>
                                <th>Likes</th>

                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post._id}>
                                    <td>{post.creatorAccountId}</td>
                                    <td>{post.dateTime}</td>
                                    <td>{post.textBox}</td>
                                    <td>{post.media}</td>
                                    <td>{post.likes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchConvos}>Conversations</button>
            <div className="table-container">
                {posts.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Users</th>
                                <th>Text</th>
                                <th>Date</th>


                            </tr>
                        </thead>
                        <tbody>
                            {convos.map(convo => (
                                <tr key={convo._id}>
                                    <td>{convo.users}</td>
                                    <td>{convo.messages}</td>
                                    <td>{convo.dateTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}