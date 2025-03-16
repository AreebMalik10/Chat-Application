const express = require("express");
const Message = require ("../models/Message");
const Conversation = require("../models/Conversation");
const authMiddleware = require("../middleware/auth")

const router = express.Router();


router.get("/recent/:userId", async(req, res) => {
    try{
        const {userId} = req.params;

        const conversations = await Conversation.find({
            participants: userId
        }).populate("participants", "username email _id message")
        .sort({ updatedAt: -1 })

        res.status(200).json(conversations);
        }
    
    catch (error) {
        res.status(500).json({error: error.message})
    }
})


router.get("/:userId/:otherUserId", async(req, res) =>{
    try{
        const {userId, otherUserId} = req.params;

        const messages = await Message.find({
            $or: [
                {
                    senderId: userId, receiverId: otherUserId
                },
                {
                    senderId: otherUserId, receiverId: userId
                }
            ]
        }).sort({timestamp: 1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router;