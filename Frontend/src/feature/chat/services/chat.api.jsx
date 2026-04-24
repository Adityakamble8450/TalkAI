import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export const createChat = async ({ message, chatId }) => {
    try {
        const response = await api.post('/api/chats/message', { 
            message,
            chat: chatId
         });
        return response.data;
    } catch (error) {
        console.error('Error creating chat:', error);
        throw error;
    }
};

export const getChatList = async () => {
    try {
        const response = await api.get('/api/chats/get');
        return response.data;
    } catch (error) {
        console.error('Error fetching chat list:', error);
        throw error;
    }
};


export const getChatMessages = async (chatId) => {
    try {
        const response = await api.get(`/api/chats/messages/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
    }
};

export const deleteChat = async (chatId) => {
    try {
        const response = await api.delete(`/api/chats/chats/${chatId}`);

        return response.data;
    } catch (error) {
        console.error('Error deleting chat:', error);
        throw error;
    };  
};


