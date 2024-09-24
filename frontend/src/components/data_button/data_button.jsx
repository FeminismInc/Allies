
import './Data_Button.css';
import axios from 'axios';
import React, { useState } from "react";

export default function Data_Button() {

    const uri = 'http://localhost:5050'

    const [users, setUsers] = useState([]);
    const fetchData = () => {
        axios.get(`${uri}/getUsers`)
            .then(response => {
                console.log(response.data);
                setUsers(response.data);
            })
            .catch(err => console.log(err));
    };
    const [posts, setPosts] = useState([]);
    const fetchPosts = () => {
        axios.get(`${uri}/getPosts`)
            .then(response => {
                setPosts(response.data);
            })
            .catch(err => console.error(err));
    };
    const [convos, setConvos] = useState([]);
    const fetchConvos = () => {
        axios.get(`${uri}/getConvos`)
            .then(response => {
                setConvos(response.data);
            })
            .catch(err => console.error(err));
    };
    const [messages, setMessages] = useState([]);
    const fetchMessages = () => {
        axios.get(`${uri}/getMessages`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(err => console.error(err));
    };
    const [likes, setLikes] = useState([]);
    const fetchLikes = () => {
        axios.get(`${uri}/getLikes`)  // Call the new getLikes API endpoint
            .then(response => {
                console.log(response.data);  // Log the likes data
                setLikes(response.data);
            })
            .catch(err => console.log(err));
    };
    const [media, setMedia] = useState([]);
    const fetchMedia = () => {
        axios.get(`${uri}/getMedia`)
            .then(response => {
                console.log(response.data);  // Log the fetched media data
                setMedia(response.data);     // Store the media data in state
            })
            .catch(err => console.log(err));
    };
    const [following, setFollowing] = useState([]);
    const fetchFollowing = () => {
        axios.get(`${uri}/getFollowing`)
            .then(response => {
                console.log(response.data);  // Log the fetched media data
                setFollowing(response.data);     // Store the media data in state
            })
            .catch(err => console.log(err));
    };
    const [followers, setFollowers] = useState([]);
    const fetchFollowers = () => {
        axios.get(`${uri}/getFollowers`)
            .then(response => {
                console.log(response.data);  // Log the fetched media data
                setFollowers(response.data);     // Store the media data in state
            })
            .catch(err => console.log(err));
    };
    const [dislikes, setDislikes] = useState([]);
    const fetchDislikes = () => {
        axios.get(`${uri}/getDislike`)  // Call the new getLikes API endpoint
            .then(response => {
                console.log(response.data);  // Log the likes data
                setDislikes(response.data);
            })
            .catch(err => console.log(err));
    };
    const [comments, setComments] = useState([]);
    const fetchComments = () => {
        axios.get(`${uri}/getComment`)  // Assuming you have an endpoint to get comments
            .then(response => {
                setComments(response.data);
            })
            .catch(err => console.log(err));
    };
    const [blockedAccounts, setBlockedAccounts] = useState([]);
    const fetchBlockedAccounts = () => {
        axios.get(`${uri}/getBlocked`)
            .then(response => {
                console.log(response.data);
                setBlockedAccounts(response.data);  // Store the blocked accounts in state
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="container">
            {/* Button for the first table */}
            <button onClick={fetchData}>Users</button>
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
                                <th>Followers</th>
                                <th>following</th>
                                <th>posts</th>
                                <th>pronouns</th>
                                <th>tagged_media</th>
                                <th>conversations</th>
                                <th>public_boolean</th>
                                <th>profile_picture</th>
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
                                    <td>{user.followers}</td>
                                    <td>{user.following}</td>
                                    <td>{user.posts}</td>
                                    <td>{user.pronouns}</td>
                                    <td>{user.tagged_media}</td>
                                    <td>{user.conversations}</td>
                                    <td>{user.public_boolean ? 'True': 'False'}</td>
                                    <td>{user.profile_picture}</td>
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
                                <th>Text</th>
                                <th>Author</th>
                                <th>DateTime</th>
                                <th>Comments</th>
                                <th>Dislikes</th>
                                <th>Media</th>
                                <th>Likes</th>
                                <th>Hashtags</th>
                                <th>Repost</th>

                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post._id}>
                                    <td>{post.text}</td>
                                    <td>{post.author}</td>
                                    <td>{post.datetime}</td>
                                    <td>{post.comments}</td>
                                    <td>{post.dislikes}</td>
                                    <td>{post.media}</td>
                                    <td>{post.likes}</td>
                                    <td>{post.hashtags}</td>
                                    <td>{post.repost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchConvos}>Conversations</button>
            <div className="table-container">
                {convos.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Users</th>
                                <th>Messages</th>
                            </tr>
                        </thead>
                        <tbody>
                            {convos.map(convo => (
                                <tr key={convo._id}>
                                    <td>
                                        <ul>
                                            {convo.users.map(user => (
                                                <li key={user._id}>{user}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{convo.messages}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchMessages}>Messages</button>
            <div className="table-container">
                {messages.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Date</th>
                                <th>Message Content</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(message => (
                                <tr key={message._id}>
                                    <td>{message.sender}</td>
                                    <td>{message.datetime}</td>
                                    <td>{message.message_content}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchLikes}>Likes</button>
            <div className="table-container">
                {likes.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Accounts That Liked </th>
                            </tr>
                        </thead>
                        <tbody>
                            {likes.map(like => (
                                <tr key={like._id}>
                                    <td>
                                        {like.accounts_that_liked && like.accounts_that_liked.length > 0 ? (
                                            <ul>
                                                {like.accounts_that_liked.map(accountId => (
                                                    <li key={accountId}>{accountId}</li>  
                                                ))}
                                            </ul>
                                        ) : (
                                            "No accounts liked"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchMedia}>Media</button>
            <div className="table-container">
                {media.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Tagged Accounts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {media.map(med => (
                                <tr key={med._id}>
                                    <td>{med.url}</td>
                                    <td>
                                        {med.tagged_accounts && med.tagged_accounts.length > 0 ? (
                                            <ul>
                                                {med.tagged_accounts.map(accountId => (
                                                    <li key={accountId}>{accountId}</li>  
                                                ))}
                                            </ul>
                                        ) : (
                                            "No accounts liked"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchFollowing}>Following</button>
            <div className="table-container">
                {following.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Accounts Followed</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {following.map(follow => (
                                <tr key={follow._id}>

                                    <td>
                                        {follow.accounts_followed && follow.accounts_followed.length > 0 ? (
                                            <ul>
                                                {follow.accounts_followed.map(accountId => (
                                                    <li key={accountId}>{accountId}</li>  
                                                ))}
                                            </ul>
                                        ) : (
                                            "No accounts followed"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchFollowers}>Followers</button>
            <div className="table-container">
                {followers.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Followers</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {followers.map(follow => (
                                <tr key={follow._id}>

                                    <td>
                                        {follow.follower_accounts && follow.follower_accounts.length > 0 ? (
                                            <ul>
                                                {follow.follower_accounts.map(accountId => (
                                                    <li key={accountId}>{accountId}</li>  
                                                ))}
                                            </ul>
                                        ) : (
                                            "No followers"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchDislikes}>Dislikes</button>
            <div className="table-container">
                {dislikes.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Accounts That Disliked (ObjectId)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dislikes.map(dislike => (
                                <tr key={dislike._id}>
                                    <td>
                                        {dislike.accounts_that_disliked && dislike.accounts_that_disliked.length > 0 ? (
                                            <ul>
                                                {dislike.accounts_that_disliked.map(accountId => (
                                                    <li key={accountId}>{accountId}</li>  
                                                ))}
                                            </ul>
                                        ) : (
                                            "No accounts liked"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button onClick={fetchComments}>Comments</button>
            <div className="table-container">
                {comments.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Text</th>
                                <th>Author</th>
                                <th>Likes</th>
                                <th>Dislikes</th>
                                <th>Replies</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map(comment => (
                                <tr key={comment._id}>
                                    <td>{comment.text}</td>
                                    <td>{comment.author}</td>
                                    <td>{comment.likes}</td>
                                    <td>{comment.dislikes}</td>
                                    <td>
                                        {comment.replies && comment.replies.length > 0 ? (
                                            <ul>
                                                {comment.replies.map(reply => (
                                                    <li key={reply}>{reply}</li>  
                                                ))}
                                            </ul>
                                        ) : (
                                            "No replies"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
             
             <div className="button-container">
                <button onClick={fetchBlockedAccounts}>Blocked Accounts</button>
            </div>

            <div className="table-container">
                {blockedAccounts.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Blocked Account ID</th>  
                            </tr>
                        </thead>
                        <tbody>
                            {blockedAccounts.map(account => (
                                <tr key={account._id}>
                                    <td>
                                        {account.blocked_accounts && account.blocked_accounts.length > 0 ? (
                                            <ul>
                                                {account.blocked_accounts.map(blckd_acc => (
                                                    <li key={blckd_acc}>{blckd_acc}</li>  
                                                ))}
                                            </ul>
                                        ) : (
                                            "No blocked accounts"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            


        </div>
    );
}