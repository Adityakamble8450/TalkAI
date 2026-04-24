import { getResponse, genrateTitle } from '../services/ai.service.js';
import chatModel from '../model/chat.model.js';
import messageModel from '../model/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const { message, chat: chatId } = req.body;
        const userId = req.user.id;
        let title, chat;
        if (!chatId) {
            title = await genrateTitle(message);
            chat = await chatModel.create({ user: userId, title });
        } else {
            chat = await chatModel.findById(chatId);
        }

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        await messageModel.create({
            chat: chat._id,
            senderId: userId,
            text: message,
            role: "user"
        });
        const messages = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 });
        const aiResponse = await getResponse(messages);
        await messageModel.create({
            chat: chat._id,
            text: aiResponse,
            role: "assistant"
        });
        res.status(200).json({
            message: "Message sent successfully",
            title,
            chat,
            messages :{
                text: message,
                chatId: chat._id,
                role: "user"
            } ,
            aiResponse :{
                text: aiResponse,
                chatId: chat._id,
                role: "assistant"
            }
        });

    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ error: "Failed to send message" });
    }

}

export const getChats = async (req , res) =>{
    const userId = req.user.id;
    const chats = await chatModel.find({user: userId})
    res.status(200).json({
        message: 'Chats fetch successfully',
        success: true,
        chats
    })
}

 export const getMessages = async (req , res) => {
    const userId = req.user.id;
    const chatId = req.params.chatId;
    const messages = await messageModel.find({chat: chatId}).sort({createdAt: 1})
    res.status(200).json({
        message: 'Messages fetch successfully',
        success: true,
        messages
    })
}

export const deleteChat = async (req , res) => {
    const userId = req.user.id;
    const chatId = req.params.chatId;
    await messageModel.deleteMany({chat: chatId})
    await chatModel.findByIdAndDelete(chatId)
    res.status(200).json({
        message: 'Chat deleted successfully',
        success: true,
    })
}

