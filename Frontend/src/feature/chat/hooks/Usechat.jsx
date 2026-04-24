import { connectSocket, disconnectSocket } from "../services/chat.socket";
import {
  createChat,
  getChatList,
  getChatMessages,
  deleteChat,
} from "../services/chat.api";
import {
  removeChat,
  setChatMessages,
  setChats,
  setCurrentChatId,
  setError,
  setIsLoading,
  upsertChat,
} from "../chat.slice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  const getErrorMessage = (error) =>
    error?.response?.data?.error || error?.response?.data?.message || error.message;

  const loadChatList = useCallback(async () => {
    dispatch(setIsLoading(true));
    try {
      const data = await getChatList();
      const chatsById = (data.chats || []).reduce((acc, chat) => {
        acc[chat._id] = { ...chat, messages: [] };
        return acc;
      }, {});

      dispatch(setChats(chatsById));
      dispatch(setError(null));
      return data.chats || [];
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      throw error;
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  const loadChatMessages = useCallback(
    async (chatId) => {
      if (!chatId) return [];

      dispatch(setIsLoading(true));
      try {
        const data = await getChatMessages(chatId);
        dispatch(setChatMessages({ chatId, messages: data.messages || [] }));
        dispatch(setCurrentChatId(chatId));
        dispatch(setError(null));
        return data.messages || [];
      } catch (error) {
        dispatch(setError(getErrorMessage(error)));
        throw error;
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch]
  );

  const handleSendMessage = useCallback(
    async (message, chatId) => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return null;

      dispatch(setIsLoading(true));
      try {
        const data = await createChat({ message: trimmedMessage, chatId });
        const { chat, aiResponse, messages } = data;
        const nextMessages = [
          ...(chats[chat._id]?.messages || []),
          messages,
          aiResponse,
        ].filter(Boolean);

        dispatch(upsertChat({ ...chat, messages: nextMessages }));
        dispatch(setCurrentChatId(chat._id));
        dispatch(setError(null));
        connectSocket();
        return data;
      } catch (error) {
        dispatch(setError(getErrorMessage(error)));
        throw error;
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [chats, dispatch]
  );

  const handleDeleteChat = useCallback(
    async (chatId) => {
      if (!chatId) return;

      dispatch(setIsLoading(true));
      try {
        await deleteChat(chatId);
        dispatch(removeChat(chatId));
        dispatch(setError(null));
      } catch (error) {
        dispatch(setError(getErrorMessage(error)));
        throw error;
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch]
  );

  const startNewChat = useCallback(() => {
    dispatch(setCurrentChatId(null));
    dispatch(setError(null));
  }, [dispatch]);


  return {
    connectSocket,
    disconnectSocket,
    handleSendMessage,
    loadChatList,
    loadChatMessages,
    deleteChat: handleDeleteChat,
    startNewChat,
  };
};
