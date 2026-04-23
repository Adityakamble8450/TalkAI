import { Server } from "socket.io";

let io = null;

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

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

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
