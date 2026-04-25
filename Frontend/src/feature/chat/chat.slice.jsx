import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    upsertChat(state, action) {
      const chat = action.payload;
      state.chats[chat._id] = {
        ...state.chats[chat._id],
        ...chat,
      };
    },
    setChatMessages(state, action) {
      const { chatId, messages } = action.payload;
      if (!state.chats[chatId]) {
        state.chats[chatId] = { _id: chatId, title: "New chat" };
      }
      state.chats[chatId].messages = messages;
    },
    appendChatMessage(state, action) {
      const { chatId, message } = action.payload;
      if (!state.chats[chatId]) {
        state.chats[chatId] = { _id: chatId, title: "New chat", messages: [] };
      }
      if (!state.chats[chatId].messages) {
        state.chats[chatId].messages = [];
      }
      state.chats[chatId].messages.push(message);
    },
    appendAssistantChunk(state, action) {
      const { chatId, chunk } = action.payload;
      const messages = state.chats[chatId]?.messages;
      if (!messages?.length) return;

      const streamingMessage = [...messages].reverse().find(
        (message) => message.role === "assistant" && message.streaming
      );

      if (streamingMessage) {
        streamingMessage.text = `${streamingMessage.text || ""}${chunk}`;
      }
    },
    finishAssistantMessage(state, action) {
      const { chatId, assistantMessage } = action.payload;
      const messages = state.chats[chatId]?.messages;
      if (!messages?.length) return;

      const streamingIndex = messages.findIndex(
        (message) => message.role === "assistant" && message.streaming
      );

      if (streamingIndex !== -1) {
        messages[streamingIndex] = assistantMessage;
      }
    },
    removeChat(state, action) {
      delete state.chats[action.payload];
      if (state.currentChatId === action.payload) {
        state.currentChatId = null;
      }
    },
    setCurrentChatId(state, action) {
      state.currentChatId = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  upsertChat,
  setChatMessages,
  appendChatMessage,
  appendAssistantChunk,
  finishAssistantMessage,
  removeChat,
  setCurrentChatId,
  setIsLoading,
  setError,
} = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
export default chatSlice.reducer;
