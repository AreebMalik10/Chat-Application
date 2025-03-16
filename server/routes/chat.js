const express = require("express");
const Message = require ("../models/Message");
const authMiddleware = require("../middleware/auth")

const router = express.Router();


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