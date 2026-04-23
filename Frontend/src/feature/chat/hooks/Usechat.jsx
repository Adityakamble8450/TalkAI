import { connectSocket, disconnectSocket } from "../services/chat.socket";

export const useChat = () => {
  return {
    connectSocket,
    disconnectSocket,
  };
};

