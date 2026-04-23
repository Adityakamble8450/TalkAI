import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
});

export const getResponse = async (userMessages) => {
  const messages = Array.isArray(userMessages)
    ? userMessages
        .map((msg) => {
          if (msg.role === "user") {
            return new HumanMessage(msg.text);
          }

          if (msg.role === "assistant") {
            return new AIMessage(msg.text);
          }

          return null;
        })
        .filter(Boolean)
    : [new HumanMessage(userMessages)];

  const response = await geminiModel.invoke(messages);
  return response.text
}

export const genrateTitle = async (userMessage) => {
  const response = await mistralModel.invoke([ new SystemMessage("You are a helpful assistant that generates concise and relevant titles for user queries."), new HumanMessage(`Generate a concise and relevant title for the following user query: "${userMessage}"`)]);
  return response.text
}
