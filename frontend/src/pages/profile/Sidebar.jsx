import React from "react";
import "./sidebar.css"
import Button from '@mui/material/Button'; 
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';


export default function Sidebar() {

    const navigate = useNavigate();

    return (
        <div>
        <HomeOutlinedIcon className="home_icon"/>
        <AccountCircleOutlinedIcon className="person_icon"/>
        <AddBoxIcon classname ="post_icon"/>
        <ChatBubbleOutlineOutlinedIcon className="chat_icon"/>
        <NotificationsOutlinedIcon className="notif_icon"/>
        <Button
        variant="contained"
        color="secondary"
        startIcon={<LogoutOutlinedIcon />}  // Add the icon to the start of the button
        onClick={() => {navigate('/')}}
        style={{ marginTop: '10px' }} 
        sx={{position: "absolute", bottom: "200px", left: "50px"}} // Add any necessary styling
      >
        Logout
      </Button>
        </div>
    )
}