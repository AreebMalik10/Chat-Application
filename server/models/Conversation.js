const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
    lastMessage: {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
        message: String,
        timestamp: {type: Date, default: Date.now}
    }}, {timestamps: true});

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;