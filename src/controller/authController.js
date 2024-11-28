const jwt = require("jsonwebtoken");
const bcrypt =require("bcryptjs");
const User = require("../models/userModel");

// Register a new user

const register=async(req, res)=>{
    try{
const{username, password, role}=req.body;
const hashedPassedword=await bcrypt.hash(password, 10);

const newUser = new User({username,password: hashedPassedword, role});
await newUser.save();
res
.status(201)
.json({message: `User registered with username ${username}`});
} catch (err) {
    res
    .status(500)
    .json({message: "Something went worng" });  
}
};

// Login an existing user

const login = async (req , res)=>{
    try{
    const {username , password}=req.body;
    // Find the user by their username in the database.
    const user= await User.findOne({username});

    if(!user){
        return res
        .status(404)
        .json({message : `user with username ${username} not found`});
    }
   // Compare the provided password with the stored hashed password.

    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: `Invalid credentails`});
    }
// Generate a JWT for the authenticated user.
    const token =jwt.sign(
    { id: user._id, role: user.role},
    process.env.JWT_SECRET,
    { expiresIn: "1h"}

);

res.status(200).json({token});
}catch(err) {
    res
    .status(500)
    .json({message: "Something went worng" });
}
};

module.exports={
    register,
    login,
};