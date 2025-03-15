const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth")

const router = express.Router();

//Sign Up Route
router.post("/signup", async(req, res) => {
    try {
        const {username, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(400).json({message: "User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET , {expiresIn: "1h"});
        
        res.status(201).json({ token, userId: newUser._id});
    } catch (error) {
        res.status(500).json({error: error.message})
        
    }
});

//Login Route
router.post("/login", async(req, res) => {
    try {   
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return res.status(404).json({ error: "User not Found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ error: "Invalid Credentials"});

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET , {expiresIn: "1h"});

        res.status(200).json({ token, userId: user._id});


    } 
    catch (error) {
        res.status(500).json({error: error.message})
        
    }
});


//Protected Route
router.get("/me", authMiddleware, async(req, res) => {  
    try {
        const user = await User.findById(req.user.userId).select("-password ");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message})
        
    }   
    
});

module.exports = router;