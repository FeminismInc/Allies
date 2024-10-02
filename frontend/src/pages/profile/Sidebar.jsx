import React from "react";
import "./sidebar.css"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function Sidebar() {
    return (
        <div>
        <HomeOutlinedIcon className="home_icon"/>
        <AccountCircleOutlinedIcon className="person_icon"/>
        <AddBoxIcon classname ="post_icon"/>
        <ChatBubbleOutlineOutlinedIcon className="chat_icon"/>
        <NotificationsOutlinedIcon className="notif_icon"/>
        <LogoutOutlinedIcon className="logout_icon"/>
        </div>
    )
}