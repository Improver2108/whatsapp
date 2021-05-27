import './App.css';
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Pusher from 'pusher-js';
import axios from "./axios";

function App() {
  const [user,setUser]=useState([])
  const [messages,setMessages]=useState([]);
  const [contacts,setContacts]=useState([]);
  const [currContact,setCurrContact]=useState(()=>'')
  const handleChatChange= async(contact_id)=>{
    setCurrContact(contact_id)
    await axios.get('/'+contact_id+'/messages').then(response=>{
      setMessages(response.data);
    }) 
  }
  useEffect(()=>{
    axios.get('/60aeb69705c362130f39cbee').then(response=>{
      setUser(response.data)
    })
    axios.get('/'+user+'/contacts').then(response=>{
      setContacts(response.data);
    });
  },[user]);


  useEffect(()=>{
    const pusher = new Pusher('995bb00c753e8dbef009', {
      cluster: 'eu'
    });
    const messages_channel = pusher.subscribe("messages");
    const contacts_channel=pusher.subscribe("contacts")
    messages_channel.bind("inserted", (newMessage) =>{
      setMessages([...messages,newMessage]);//push new message persisting existing one
    });
    contacts_channel.bind("inserted", (newContacts) =>{
      setContacts([...contacts,newContacts]);//push new rooms persisting existing one
    });
    return ()=>{
      messages_channel.unbind_all();
      messages_channel.unsubscribe();
      contacts_channel.unbind_all();
      contacts_channel.unsubscribe();
    }
  },[messages,contacts])
  return (
    <div className="app">
      <div className="app_body">
        <Sidebar contacts={contacts} action={(contact_id)=>handleChatChange(contact_id)}/>
        <Chat messages={messages} currContact={currContact}/>
      </div>
    </div>
  );
}

export default App;
