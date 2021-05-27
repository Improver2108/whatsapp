import { Avatar } from '@material-ui/core'
import React from 'react'
import './SidebarChat.css'

function SidebarChat({contact,onClick}) {
    return (
        <div className="sidebarChat" onClick={onClick}>
            <Avatar></Avatar>
            <div className="sidebarChat_info">
                <h2>{contact.name}</h2>
                <p>this is the last message</p>
            </div>
        </div>
    )
}

export default SidebarChat
