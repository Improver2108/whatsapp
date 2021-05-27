import React from 'react'
import "./Sidebar.css"
import { DonutLarge, SearchOutlined } from '@material-ui/icons';
import { IconButton,Avatar } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SidebarChat from './SidebarChat'
function Sidebar({contacts,action}) {
    return (
        <div className="sidebar">
            <div className="sidebar_header"> 
                <Avatar src="https://wallpapercave.com/wp/wp4023747.png"/>
                <div className="sidebar_header_right">
                    <IconButton>
                        <DonutLarge/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>
            <div className="sidebar_search">
                <div className="sidebar_search_container">
                    <SearchOutlined/>
                    <input type="text" placeholder="Find someone to have a conversation" />
                </div>
            </div>
            <div className="sidebar_chat">
                {contacts.map((contact)=>(
                    <SidebarChat key={contact._id}  contact={contact}  onClick={()=>action(contact._id)}/>
                ))}
            </div>
        </div>
    );
}

export default Sidebar
