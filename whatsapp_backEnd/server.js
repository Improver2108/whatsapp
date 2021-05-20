//importing
import express from 'express';
import mongooose from 'mongoose'
import Messages from  './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors'  

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
    const msgCollection=db.collection("messagecontents");
    const changeStream=msgCollection.watch();
    changeStream.on("change",(change)=>{
        console.log(change);
        if(change.operationType=='insert'){
            const messageDetails=change.fullDocument;
            pusher.trigger("messages","inserted",{
                name:messageDetails.name,
                message:messageDetails.message,
                timestamp:messageDetails.timestamp,
                recieved:messageDetails.recieved   
            });
        }else{
            console.log("error triggering pusher");
        }
    });
});


//???

//api routes
app.get("/",(req,res)=>res.status(200).send("Boooom!!"));

app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
    if(err)
        res.status(500).send(err);
    else
        res.status(200).send(data);
    });
});

app.post("/messages/new",(req,res)=>{
    const dbMessage=req.body;
    Messages.create(dbMessage,(err,data)=>{
        if(err) 
            res.status(500).send(err)
        else 
            res.status(201).send(data)    
    });
});

//listen
app.listen(port,()=>console.log('im working on localhost:'+port))