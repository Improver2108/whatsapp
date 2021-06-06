import './Main.css';
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Pusher from 'pusher-js';
import axios from "./axios";

function Main({history}) {
    const [messages,setMessages]=useState([]);
    const [contacts,setContacts]=useState([]);
    const [currContact,setCurrContact]=useState(()=>'')
    const user=history.location.state;
    const handleChatChange= (contact)=>{
      console.log(contact)
      setCurrContact(contact)
      axios.get('/'+user._id+'/'+contact.reciever_id+'/messages').then(response=>{
        setMessages(response.data);
      })
    }
    useEffect(()=>{
      axios.get('/'+user._id+'/contacts').then(response=>{
        console.log(response.data)
        setContacts(response.data)
      });
    
    },[user]);
    useEffect(()=>{
      const pusher = new Pusher('995bb00c753e8dbef009', {
        cluster: 'eu'
      });
      const contact_channel=pusher.subscribe("contacts");
      contact_channel.bind("inserted",(newContact)=>{
        console.log(newContact)
        setContacts([...contacts,newContact])
      });
      const messages_channel = pusher.subscribe("messages");
      messages_channel.bind("inserted", (newMessage) =>{
        console.log(newMessage)
        setMessages([...messages,newMessage]);
      });
      return ()=>{
        contact_channel.unbind_all();
        contact_channel.unsubscribe()
        messages_channel.unbind_all();
        messages_channel.unsubscribe();
      }
    },[contacts,messages])
    let chat;
    if(currContact)
      chat=<Chat currContact={currContact}  messages={messages} user={user} />
    else
      chat=<p>chat with whomever you want</p>  
    return (
      <div className="main">
        <div className="main_body">
          <Sidebar contacts={contacts}  user={user} action={(contact)=>handleChatChange(contact)}/>
          {chat}
        </div>
      </div>
    );
}   

export default Main

