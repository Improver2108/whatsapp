//importing
import express from 'express';
import mongooose from 'mongoose';
import Users from  './models/User.js';
import Messages from  './models/Message.js';
import Contacts from './models/Contact.js';
import Pusher from 'pusher';
import cors from 'cors';  

//app config
const app=express();
const port=process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1206594",
    key: "995bb00c753e8dbef009",
    secret: "95a36fe7d4fa00ff201a",
    cluster: "eu",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(cors());
//DB config
const connection_url='mongodb+srv://admin:gameofthrones@cluster0.2jzxj.mongodb.net/messageDB?retryWrites=true&w=majority'
mongooose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db=mongooose.connection;
db.once("open",()=>{
    console.log("DB connected");
    const messageCollection=db.collection("messages");
    const contactsCollection=db.collection("contacts")
    const messageChangeStream=messageCollection.watch();
    const contactChangeStream=contactsCollection.watch();
    messageChangeStream.on("change",(change)=>{
        if(change.operationType==='insert'){
            const messageDetails=change.fullDocument;
            pusher.trigger('messages','inserted',{
                content:messageDetails.content,
                recieved:messageDetails.recieved,
                timeStamp:messageDetails.timeStamp
            });
        }else{
            console.log("error triggring messages pusher")
        }        
    });
    contactChangeStream.on("change",(change)=>{
        console.log(change.operationType)
        if(change.operationType==='insert'){
            const contactDetails=change.fullDocument;
            pusher.trigger('contacts','inserted',{
               messages:contactDetails.messages,
               name:contactDetails.name,
               id:contactDetails._id 
            });
        }else{
            console.log("errror triggering contacts pusher");
        }
    });
});


//???

//api routes
app.get("/60aeb69705c362130f39cbee",async (req,res)=>res.status(200).send("60aeb69705c362130f39cbee"));



app.get('/:user_id/contacts',async (req,res)=>{
    await Users.findById(req.params.user_id).lean().populate('contacts').exec((err,user)=>{
        if(err)
            res.status(500).send(err);
        else
            res.status(200).send(user.contacts);
    })
});

app.get('/:contact_id/messages',async (req,res)=>{
    await Contacts.findById(req.params.contact_id).lean().populate('messages').exec((err,contact)=>{
        if(err)
            res.status(500).send(err);
        else
            res.status(200).send(contact.messages)    
    })
});

app.post("/user/new", (req,res)=>{
    const dbUser=req.body;
    Users.create(dbUser,(err,user)=>{        
        if(err) 
            res.status(500).send(err)
        else 
            res.status(201).send(user)    
    });
});
app.post("/:user_id/newContact", (req,res)=>{
    const dbComment=req.body;
    Users.findById(req.params.user_id,(err,user)=>{
        if(err)
            res.status(500).send(err);
        else{
            Contacts.create(dbComment,(err,contact)=>{
                if(err)
                    res.status(500).send(err);
                else{
                    user.contacts.push(contact);
                    user.save();
                    res.status(201).send(contact);
                }
            });
        }    
    });
});
app.post("/:contact_id/newMessage/", (req,res)=>{
    const dbMessage=req.body;
    Contacts.findById(req.params.contact_id,(err,contact)=>{
        if(err)
            res.status(500).send(err);
        else{
            Messages.create(dbMessage,(err,message)=>{
                if(err)
                    res.status(500).send(err);
                else{
                    contact.messages.push(message);
                    contact.save();
                    res.status(201).send(contact);
                }
            });
        }    
    });
});

//listen
app.listen(port,()=>console.log('im working on localhost:'+port));