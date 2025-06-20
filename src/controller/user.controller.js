const User = require("../models/user.schema");
const bcrypt = require("bcryptjs");


const signup = async (req, res) =>{
    const {firstName, lastName, email, password, phoneNumber} = req.body;
    if(!firstName || !lastName || !email || !password || !phoneNumber){
        return res.status(400).json({message: "All Fields Are Required"})
    }
    try{
        const user = await User.findOne({email: email})
        if(user){
            return res.status(400).json({message: "User Already Exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber
        })
        await newUser.save()
        return res.status(201).json({message: "User Signed Up Successfully"})
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const login = async (req, res) =>{
    const {email, password} = req.body;
      if(!email || !password){
        return res.status(400).json({message: "All Fields Are Required"})
    }
    try{
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(400).json({message: "User Doesn't Exist Please Signup"})
        }
        const comparePassword = await bcrypt.compare(password, user.password);        
        if(!comparePassword){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        return res.status(200).json({message: "User Logged IN Succesfully"})
        }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = {
    signup,
    login,
}