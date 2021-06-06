//importing
import express from 'express';
import mongooose from 'mongoose';
import Users from  './models/User.js';
import Contacts from './models/Contact.js';
import Messages from  './models/Message.js';
import Pusher from 'pusher';
import cors from 'cors';  
import User from './models/User.js';

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
    const contactCollection=db.collection("contacts");
    const contactChangeStream=contactCollection.watch();
    contactChangeStream.on("change",(change)=>{
        if(change.operationType==='insert'){
            const contactDetails=change.fullDocument
            console.log(contactDetails);
            pusher.trigger('contacts','inserted',{
                _id:contactDetails._id,
                reciever_name:contactDetails.reciever_name,
                reciever_id:contactDetails.reciever_id,
            })
        }
    });
    const messageCollection=db.collection("messages");
    const messageChangeStream=messageCollection.watch();
    messageChangeStream.on("change",(change)=>{
        if(change.operationType==='insert'){
            const messageDetails=change.fullDocument;
            console.log(messageDetails);
            pusher.trigger('messages','inserted',{
                _id:messageDetails._id,
                timeStamp:messageDetails.timeStamp,
                recieved:messageDetails.recieved,
                content:messageDetails.content
            })
        }
    })
});


//???

//api routes
//get apis
app.get("/:user_id/",(req,res)=>{
    User.findById(req.params.user_id).exec((err,user)=>{
        if(err)
            res.status(500).send(err);
        else
            res.status(200).send(user)
    });
})



app.get('/:user_id/contacts',async (req,res)=>{
    Contacts.find({"sender_id":req.params.user_id}).lean().exec((err,contacts)=>{
        if(err)
            res.status(500).send(err);
        else
            res.status(200).send(contacts);
    })
});

app.get('/:user_id/:contact_id/messages',async (req,res)=>{
    const contact=await Contacts.findOne({"sender_id":req.params.user_id,"reciever_id":req.params.contact_id})
    await contact.populate('messages').execPopulate((err,contact)=>{
        if(err)
            res.status(500).send(err);
        else
            res.status(200).send(contact.messages)
    });
});
//post apis
app.post("/user/new", (req,res)=>{
    const dbUser=req.body;
    Users.create(dbUser,(err,user)=>{        
        if(err) 
            res.status(500).send(err)
        else 
            console.log(user._id)
            res.status(201).send(user)    
    });
});
app.post("/:user_id/newContact/",(req,res)=>{
    const dbContact=req.body;
    User.findById(req.params.user_id).exec(async (err,user)=>{
        if(err)
            res.status(500).send(err)
        else{
            await Contacts.create({"reciever_id":dbContact._id,"sender_id":req.params.user_id,"reciever_name":dbContact.name});
            await Contacts.create({"sender_id":dbContact._id,"reciever_id":req.params.user_id,"reciever_name":user.name});
        }
    })
    
});
app.post("/:user_id/:contact_id/newMessage/", async (req,res)=>{
    const dbMessage=req.body
    Messages.create(dbMessage,async(err,message)=>{
        if(err)
            res.status(500).send(err);
        else{
            Contacts.findOne({"sender_id":req.params.user_id,"reciever_id":req.params.contact_id}).exec((err,contact)=>{
                if(err)
                    res.status(500).send(err)
                else{
                    contact.messages.push(message);
                    contact.save();
                }
            })
            Contacts.findOne({"sender_id":req.params.contact_id,"reciever_id":req.params.user_id}).exec((err,contact)=>{
                if(err)
                    res.status(500).send(err)
                else{
                    contact.messages.push(message._id);
                    contact.save();
                }
            })
            res.status(201).send(message);
        }
    })
    
});
//delete apis
app.delete('/:user_id/:contact_id/deleteContact',(req,res)=>{
    Messages.deleteOne({"sender_id":req.params.user_id,"reciever_id":req.params.contact_id}).exec((err,contact)=>{
        if(err)
            res.status(500).send(err);
        else
            res.send(202).send(contact)
    });
    Messages.deleteOne({"sender_id":req.params.contact_id,"reciever_id":req.params.user_id}).exec((err,contact)=>{
        if(err)
            res.status(500).send(err);
        else
            res.send(202).send(contact)
    });
});
//listen
app.listen(port,()=>console.log('im working on localhost:'+port));