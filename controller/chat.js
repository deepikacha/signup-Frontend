const Message=require('../model/messages')
exports.message=async (req,res)=>{
    const {message}=req.body;
    const userId=req.user.id;
    if(!message){
        return res.status(400).json({message:"message cannot be empty"})
    }
    try{
      const newMessage=await Message.create({userId,message})
      res.status(201).json({message:"message stored successfully"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error"})
    }
}
