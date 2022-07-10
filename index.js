const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoute = require('./routes/messagesRoute');

const app = express();

const socket = require('socket.io');

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/messages", messageRoute)


// connecting with the mongoose
mongoose.connect(process.env.MONGO_URL, {
    // To fix all deprecation warning we will set
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connected to the db sucessfully");
}).catch((err)=>{
    console.log(err.message);
})

const server = app.listen(process.env.PORT, ()=>{
    console.log(`listening on port${process.env.PORT}`);
}); 


const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    }
});

// it storing all online users into a map
global.onlineUsers  = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId)=>{
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        // if the user is online
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
})