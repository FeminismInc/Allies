import React, {useEffect, useState } from "react";
import axios from "axios";
import "./sidebar.css"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { NavLink } from 'react-router-dom';
import {FaBars} from "react-icons/fa";
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';


//will connect to pages: Home, Profile, Messages, Notifications, Logout
export default function Sidebar() {
    const[isOpen ,setIsOpen] = useState(true);
    const toggle = () => setIsOpen (!isOpen);
    const uri = process.env.REACT_APP_URI;
    const [username, setUsername] = useState('');

    useEffect(() => {
        axios.get(`${uri}/users/findUser`, { withCredentials: true }) 
          .then(response => {
            setUsername(response.data.username); 
            //console.log("loggininusername:",response.data.username);
          })
          .catch(error => {
            console.error('Error fetching user:', error);
          });
      }, []); 

    const menuItem =[
        {
            path: "/home",
            name: "Home",
            icon:<HomeOutlinedIcon/>
        },
        {
            path: `/profile/${username}`,
            name: "Profile",
            icon:<AccountCircleOutlinedIcon/>
        },
        {
            path: "/post",
            name: "Post",
            icon:<AddBoxIcon/>
        },
        {
            path: "/messages",
            name: "Messages",
            icon:<ChatBubbleOutlineOutlinedIcon/>
        },
        {
            path: "/search",
            name: "Search",
            icon: <SearchIcon />
        },
       
        {
            path: "/",
            name: "Logout",
            icon:<LogoutOutlinedIcon/>
        }

    ]
    return (
           <div style={{width: isOpen ? "240px" : "100px"}} className="sidebar">
           
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo">Allies</h1>
                   <div style={{marginLeft: isOpen ? "75px" : "5px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>
               </div>
               {/* <div className="searchbar">
                    <SearchBar/>
               </div> */}
                {   
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div style={{marginLeft: isOpen ? "0px" : "15px"}} className="icon" >{item.icon}</div>
                            <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                        </NavLink>
                        
                    ))
                }
            </div>           
    );
};