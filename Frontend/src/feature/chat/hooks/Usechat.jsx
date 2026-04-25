import { connectSocket, disconnectSocket, socket, streamChatMessage } from "../services/chat.socket";
import {
  getChatList,
  getChatMessages,
  deleteChat,
} from "../services/chat.api";
import {
  removeChat,
  appendAssistantChunk,
  appendChatMessage,
  finishAssistantMessage,
  setChatMessages,
  setChats,
  setCurrentChatId,
  setError,
  setIsLoading,
  upsertChat,
} from "../chat.slice";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  const getErrorMessage = (error) =>
    error?.response?.data?.error || error?.response?.data?.message || error.message;

  useEffect(() => {
    const handleStreamStart = ({ chat, userMessage, assistantMessage }) => {
      dispatch(upsertChat(chat));
      dispatch(setCurrentChatId(chat._id));
      dispatch(appendChatMessage({ chatId: chat._id, message: userMessage }));
      dispatch(appendChatMessage({ chatId: chat._id, message: assistantMessage }));
      dispatch(setError(null));
    };

    const handleStreamChunk = ({ chatId, chunk }) => {
      dispatch(appendAssistantChunk({ chatId, chunk }));
    };

    const handleStreamEnd = ({ chatId, assistantMessage }) => {
      dispatch(finishAssistantMessage({ chatId, assistantMessage }));
      dispatch(setIsLoading(false));
      dispatch(setError(null));
    };

    const handleStreamError = ({ error }) => {
      dispatch(setError(error || "Failed to stream response"));
      dispatch(setIsLoading(false));
    };

    socket.on("chat:stream:start", handleStreamStart);
    socket.on("chat:stream:chunk", handleStreamChunk);
    socket.on("chat:stream:end", handleStreamEnd);
    socket.on("chat:stream:error", handleStreamError);

    return () => {
      socket.off("chat:stream:start", handleStreamStart);
      socket.off("chat:stream:chunk", handleStreamChunk);
      socket.off("chat:stream:end", handleStreamEnd);
      socket.off("chat:stream:error", handleStreamError);
    };
  }, [dispatch]);

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
        streamChatMessage({ message: trimmedMessage, chatId });
        dispatch(setError(null));
        return { message: trimmedMessage, chatId };
      } catch (error) {
        dispatch(setError(getErrorMessage(error)));
        dispatch(setIsLoading(false));
        throw error;
      }
    },
    [dispatch]
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
