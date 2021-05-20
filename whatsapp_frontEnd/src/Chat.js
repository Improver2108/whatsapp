import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, InsertEmoticon, SearchOutlined } from '@material-ui/icons'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MicIcon from '@material-ui/icons/Mic';
import React, { useState } from 'react';
import axios from './axios';
import "./Chat.css";
function Chat({messages}) {
    const [input,setInput]=useState('');
    const sendMessage=async (e)=>{
        e.preventDefault();
        await axios.post("/messages/new",{
            message:input,
            name:"Put your name here",
            timestamp:"just now",
            recieved:false
        });
        setInput('');
    };
    return (
        <div class="chat">
            <div className="chat_header">
                <Avatar/>
                <div className="chat_header_info">
                    <h3>Room name</h3>
                    <p>Last see at..</p>
                </div>
                <div className="chat_header_right">
                    <IconButton>
                        <SearchOutlined/>
                    </IconButton>                   
                    <IconButton>
                        <AttachFile/>
                    </IconButton>                   
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>                   
                </div>    
            </div>
            <div className="chat_body">
                {messages.map((message)=>(                    
                    <p className={"chat_message "+ (message.recieved?"chat_reciever":"")}>
                        <span className="chat_name">{message.name}</span>
                        <span>{message.message}</span>
                        <span className="chat_timestamp">
                            {message.timestamp}
                        </span>
                    </p> 
                ))}          
                                       
            </div>
            <div className="chat_footer">
                <IconButton>
                    <InsertEmoticon/>
                </IconButton> 
                <form>
                    <input 
                        value={input} 
                        onChange={(e)=>setInput(e.target.value)} 
                        type="text" 
                        placeholder="Type something"
                    />
                    <button type="submit" onClick={sendMessage}>Send</button>
                </form>
                <IconButton>
                    <MicIcon/>
                </IconButton>
            </div>
        </div>
    )
}
export default Chat
