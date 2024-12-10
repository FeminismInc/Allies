import axios from 'axios';
import React, { useState, useEffect } from "react";
import Sidebar from '../../components/sidebar/Sidebar';
import { io } from "socket.io-client"; // Import socket.io
import "./messages.css";
import ConversationList from '../../components/messages/ConversationList';
import MessageLog from '../../components/messages/Messagelog';
import { useLocation } from 'react-router-dom';

export default function MessagesPage() {
    const uri = process.env.REACT_APP_URI;
    const socket = io("http://localhost:5050"); // Initialize socket connection http://54.176.5.254:5050/api
    
    const location = useLocation();
    // const { currentUsername, otherUsername } = location.state || {};
    //const { currentUsername } = useContext(UserContext);
    const [conversationIds, setConversationIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [otherUsername, setOtherUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [currentUsername, setCurrentUsername] = useState('');
    


    // Function to send a message
    const send = async (e) => {
        e.preventDefault();
        if (!currentConversation) return;
        const messageContent = document.getElementById("message-input").value;
        console.log(currentConversation);
        const messageObj = {
            sender: currentUsername,
            destination: currentConversation.users.filter(user => user !== currentUsername)[0],
            id: currentConversation._id,
            message_content: messageContent,
            datetime: Date.now()
        };

        try {
            // Create and save the message to the database
            const newMessage = await axios.post(`${uri}/messages/newMessage`, messageObj);
            console.log(newMessage.data);
            // Emit message to the server
            socket.emit("messageOut", { ...messageObj, _id: newMessage.data._id });

            await axios.post(`${uri}/messages/addMessageConversation`, {
                conversationId: currentConversation._id,
                messageId: newMessage.data._id
            });

            // Clear input
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Listen for incoming messages
    useEffect(() => {
        socket.on('messageIn', (newMessage) => {
            console.log("Message received:", newMessage);
            // If the new message belongs to the current conversation, update the message list
            if (newMessage.id === currentConversation?._id) {
                setMessageList(prevMessages => [...prevMessages, newMessage]);
            }
        });

        return () => {
            socket.off('messageIn'); // Cleanup on component unmount
        };
    }, [currentConversation]);


//     useEffect(() => {
//         axios.get(`${uri}/users/getCurrentUserID`)
//         axios.get(`${uri}/users/findUser`, { withCredentials: true })
                 
//                  console.log("location.state?.username", location.state.username);
//                 if (location.state?.username) {
//                     setOtherUsername(location.state.username);
//                 }              
//                 const response = axios.get(`${uri}/users/getConversations/$ currentUsername}`);
//                 const conversations = Array.isArray(response.data) ? response.data : [response.data];
//                 setConversationIds(conversations);
//             // catch(error => {
//             //     console.error('Error fetching conversations:', error);
//             // });
// },[]);

useEffect(() => {
    axios.get(`${uri}/users/findUser`, { withCredentials: true })
        .then(response => {
            //console.log("currentUsername", response.data.username);
            setCurrentUsername(response.data.username);
            if (location.state?.username) {
                setOtherUsername(location.state.username);
            }              
            return axios.get(`${uri}/users/getConversations/${response.data.username}`);
        })
        .then(response => {
            const conversations = Array.isArray(response.data) ? response.data : [response.data];
            setConversationIds(conversations);
            console.log("setConversationIds", conversations);
        })
        .catch(error => {
            console.error('Error fetching conversations:', error);
        });

}, []);

    useEffect(() => {
        console.log('otherUsername or currentUsername has changed ');
        if (otherUsername && currentUsername) {
            //console.log('otherUsername and currentUsername have been defined:',otherUsername,',',currentUsername);
            handleCreateConversation();
        }
    },  [currentUsername,otherUsername]); // pulls up the createConversation function when both currentUsername and otherUsername 


    useEffect(() => {
        console.log('Updated Conversation IDs:', conversationIds);
    }, [conversationIds]);


    const handleOpenModal = () => setShowModal(true);

    const handleCloseModal = () => {
        setShowModal(false);
        setOtherUsername('');
        setError('');
    };

    // useEffect(() => {
    //         if (location.state?.username) {
    //         axios.get(`${uri}/users/findUser`, { withCredentials: true })
    //         .then(response => {
    //                 setCurrentUsername(response.data.username);
    //                 setOtherUsername(location.state?.username);
    //                 console.log("currentUsername", response.data.username);
    //                 console.log("otherUsername", otherUsername);
    //             })
    //         .then({
    //         console.log("currentUsername", currentUsername);
    //         console.log("location.state.otherUsername", location.state?.username);
    //     });
    //     }
    // }, [location.state?.username]);

    const handleCreateConversation = async () => {
        console.log("creating conversation..", otherUsername);
        // console.log("current..", currentUsername);
        try {
            const response = await axios.post(`${uri}/messages/conversation`, {
             currentUsername,
                otherUsername
            });

            if (response.status === 201) {
                alert('Conversation created successfully');
                setConversationIds(prevConversations => [...prevConversations, response.data]);
                setCurrentConversation(response.data);
                handleCloseModal();
            } else if (response.status === 404) {
                setError('User not found');
            } else if (response.status === 200) {
                // if conversation already exists, direct user to the conversation
                handleCloseModal();
                setCurrentConversation(response.data)
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            setError('Something went wrong, please try again.');
        }
    };

    const deleteConversation = async () => {
        try {
            const response = await axios.delete(`${uri}/messages/conversation/${currentConversation._id}`);
            if (response.status === 200) {
                // alert('Conversation deleted successfully');
                setConversationIds(prevConversations =>
                    prevConversations.filter(convo => convo._id !== currentConversation._id)
                );
                setCurrentConversation(null);

                
            } else if (response.status === 404) {
                setError('Conversation not found');
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
            setError('Something went wrong, please try again.');
        }
    };

    
    const receiveMessages = async () => {
        console.log("currentConversation:", currentConversation);
        try {
            const response = await axios.get(`${uri}/messages/conversation/${currentConversation._id}`);
            // const response = await axios.get(`${uri}/messages/getMessages/${currentConversation.users[1]}`);
            // problem: /getMessages is returning ALL messages that contain the currentUser as either sender or destination, regardless of currentConversation
            setMessageList(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (currentConversation && currentConversation._id) {
            receiveMessages();
        }
    }, [currentConversation]);

    return (
        <div className='conversationMainContent'>
            <Sidebar />
            <ConversationList
                conversationIds={conversationIds}
                currentUsername= {currentUsername}
                currentConversation={currentConversation}
                setCurrentConversation={setCurrentConversation}
                showModal={showModal}
                handleOpenModal={handleOpenModal}
                handleCloseModal={handleCloseModal}
                otherUsername={otherUsername}
                setOtherUsername={setOtherUsername}
                error={error}
                handleCreateConversation={handleCreateConversation}
            />
            {currentConversation && (
                
                <MessageLog
                    currentUsername= {currentUsername}
                    currentConversation={currentConversation}
                    messageList={messageList}
                    message={message}
                    setMessage={setMessage}
                    send={send}
                    deleteConversation={deleteConversation}
                />
                
            )}
        </div>
    );
}
