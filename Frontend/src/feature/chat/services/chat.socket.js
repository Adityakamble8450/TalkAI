import { io } from "socket.io-client";

export const initializeSocketClient = () => {
  return io("http://localhost:3000", {
    withCredentials: true,
    autoConnect: false,
  });
};

export const socket = initializeSocketClient();

socket.on("connect", () => {
  console.log(`Socket connected to server: ${socket.id}`);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected from server");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("message", (message) => {
  console.log("Received message:", message);
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const sendMessage = (message) => {
  socket.emit("message", message);
};

export const streamChatMessage = ({ message, chatId }) => {
  connectSocket();
  socket.emit("chat:stream", { message, chatId });
};
