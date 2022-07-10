const messageModel = require("../model/messageModel");

// ROUTE-1 : api/messages/addmsg/ for adding the messages in the data base.
module.exports.addMessage = async (req, res, next)=>{
    try {
        const { from , to, message} = req.body;
        const data = await messageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        // if message is created in the db
        if(data){
            return res.json({msg:"Message added successfully"})
        }
        else{
            return res.json({msg: "Failed to add message to the database"});   
        }
    } catch (error) {
        console.log({mgs:"Internal Sever eroor", err});
        
    }
}
// ROUTE-2 : api/messages/getmsg/ for getting all the messages in the data base.

module.exports.getAllMessage = async (req, res, next)=>{
    try{
        const { from , to} = req.body;
        const messages = await messageModel.find({
            users:{
                $all: [from, to] ,    // select all messages

            }
        }).sort({ updatedAt: 1});

        const projectMessages = messages.map((msg) =>{
            return {
                fromSelf: msg. sender.toString() == from,
                message: msg.message.text,
            };

        });
        res.json(projectMessages);
    }
    catch(error){
        console.log({mgs:"Internal Sever eroor", error});
        
    }
}