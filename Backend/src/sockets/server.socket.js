import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import chatModel from "../model/chat.model.js";
import messageModel from "../model/message.model.js";
import { genrateTitle, streamResponse } from "../services/ai.service.js";

let io = null;

const parseCookies = (cookieHeader = "") =>
  cookieHeader.split(";").reduce((cookies, cookie) => {
    const [key, ...value] = cookie.trim().split("=");
    if (!key) return cookies;
    cookies[key] = decodeURIComponent(value.join("="));
    return cookies;
  }, {});

const authenticateSocket = (socket, next) => {
  try {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Authentication token is missing"));
    }

    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(new Error("Authentication token is invalid"));
  }
};

const handleChatStream = async (socket, payload = {}) => {
  const { message, chatId } = payload;
  const userId = socket.user?.id;
  const trimmedMessage = message?.trim();

  if (!userId || !trimmedMessage) {
    socket.emit("chat:stream:error", { error: "Message is required" });
    return;
  }

  try {
    let chat = chatId ? await chatModel.findOne({ _id: chatId, user: userId }) : null;

    if (!chat) {
      const title = await genrateTitle(trimmedMessage);
      chat = await chatModel.create({ user: userId, title });
    }

    const userMessage = await messageModel.create({
      chat: chat._id,
      senderId: userId,
      text: trimmedMessage,
      role: "user",
    });

    socket.emit("chat:stream:start", {
      chat,
      userMessage,
      assistantMessage: {
        _id: `stream-${Date.now()}`,
        chat: chat._id,
        text: "",
        role: "assistant",
        streaming: true,
      },
    });

    const messages = await messageModel.find({ chat: chat._id }).sort({ createdAt: 1 });
    const finalText = await streamResponse(messages, async (chunk) => {
      socket.emit("chat:stream:chunk", {
        chatId: chat._id,
        chunk,
      });
    });

    const assistantMessage = await messageModel.create({
      chat: chat._id,
      text: finalText,
      role: "assistant",
    });

    chat.updatedAt = new Date();
    await chat.save();

    socket.emit("chat:stream:end", {
      chatId: chat._id,
      assistantMessage,
    });
  } catch (error) {
    console.error("Streaming chat failed:", error);
    socket.emit("chat:stream:error", {
      error: error.message || "Failed to stream response",
    });
  }
};

export const initSocketServer = (server) => {
  if (!server) {
    throw new Error("Server instance is required to initialize Socket.io");
  }

  if (io) {
    return io;
  }

  io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("chat:stream", (payload) => handleChatStream(socket, payload));

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io server not initialized");
  }

  return io;
};
