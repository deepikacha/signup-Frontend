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

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        console.log("User logged in:", user.email);
        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};
