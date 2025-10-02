const express = require("express");
const userAuth = require("../middlewares/auth");
const chatRouter = express.Router();
const { Chat } = require("../models/chat");

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
   const userId = req.user._id
   const {targetUserId} = req.params;
  try {
    const chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName photoUrl");

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    
    res.json(chat)
  
  } catch (err){
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = chatRouter;
