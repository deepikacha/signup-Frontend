const User=require('../model/user');
const bcrypt=require('bcrypt');

exports.signup= async (req,res)=>{
    const {name,email,phoneno,password}=req.body;
    try{
        const existingUser=await User.findOne({where:{email:email}});
        if(existingUser){
            return res.status(409).json({message:"user already exists"})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            phoneno,
            password:hashedPassword
        })
        res.status(201).json({message:"user created successfully"})
    }
    catch(Error){
        console.log(Error);
        return res.status(500).json({message:"Internal server error"})
    }
}