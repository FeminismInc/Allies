import React, { useState } from "react";
import "./sidebar.css"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { NavLink } from 'react-router-dom';
import {FaBars} from "react-icons/fa";
import SearchBar from "../search_bar/searchBar";

//will connect to pages: Home, Profile, Messages, Notifications, Logout

export default function Sidebar({children}) {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem =[
        {
            path: "/home",
            name: "home",
            icon:<HomeOutlinedIcon/>
        },
        {
            path: "/profile",
            name: "Profile",
            icon:<AccountCircleOutlinedIcon/>
        },
        {
            path: "/post",
            name: "Post",
            icon:<AddBoxIcon/>
        },
        {
            path: "/form",
            name: "Messages",
            icon:<ChatBubbleOutlineOutlinedIcon/>
        },

       {
            path: "/notifications",
            name: "Notifications",
            icon:<NotificationsOutlinedIcon/>
        },
        {
            path: "/",
            name: "Logout",
            icon:<LogoutOutlinedIcon/>
        }

    ]
    return (
        <div className="container">
           <div style={{width: isOpen ? "200px" : "50px"}} className="sidebar">
           
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Allies</h1>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               <div className="searchbar">
                    <SearchBar/>
               </div>
                {   
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                        </NavLink>
                        
                    ))
                }
            </div>
           <main>{children}</main>
           
        </div>
    );

  /*  return (
        <div>
        <HomeOutlinedIcon className="home_icon"/>
        <AccountCircleOutlinedIcon className="person_icon"/>
        <ChatBubbleOutlineOutlinedIcon className="chat_icon"/>
        <NotificationsOutlinedIcon className="notif_icon"/>
        <LogoutOutlinedIcon className="logout_icon"/>
        </div> 
    ) */
};