import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
const messageController = {
  async sendMessage(req, res) {
    try {
      const { message } = req.body;
      const { id: receiverId } = req.params;

      const senderId = req.user._id;

      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
      console.log(newMessage, "newMessage");
      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }

      await Promise.all([conversation.save(), newMessage.save()]);
      return res.status(200).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      return res
        .status(500)
        .json({ error: "internal server error in controller" });
    }
  },
  async getMessage(req, res) {
    try {
      const { id: userToChatId } = req.params;
      const senderId = req.user._id;
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages");
      if (!conversation) return res.status(201).json([]);
      const message = conversation.messages;
      return res.status(200).json(message);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      return res
        .status(500)
        .json({ error: "internal server error in controller" });
    }
  },
};
export default messageController;
