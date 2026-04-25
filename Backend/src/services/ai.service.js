import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { getInternetData } from "./internet.service.js";


const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
});

const searchTool = tool(
  async ({ query }) => {
    const parsedQuery = z.string().min(1, "Search query cannot be empty").parse(query);
    return getInternetData({ query: parsedQuery });
  },
  {
    name: "search",
    description:
      "Search the internet for current, recent, or specific information. Use this for latest news, current facts, prices, schedules, or anything that may have changed.",
    schema: z.object({
      query: z.string().min(1).describe("The search query to look up on the internet."),
    }),
  }
);

const geminiModelWithTools = geminiModel.bindTools([searchTool]);

const answerSystemPrompt = new SystemMessage({
  content:
    "You are TalkAI, a helpful assistant. Use the search tool when the user asks about recent, current, latest, time-sensitive, or factual information that may have changed. When search results are used, answer from those results and include source links when available. If search fails or results are insufficient, say what could not be verified.",
});

const getMessageText = (message) => {
  if (message.text) return message.text;
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) {
    return message.content
      .map((part) => {
        if (typeof part === "string") return part;
        return part.text || "";
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
};

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

  const conversation = [answerSystemPrompt, ...messages];
  let response = await geminiModelWithTools.invoke(conversation);

  for (let i = 0; i < 3 && response.tool_calls?.length; i += 1) {
    const toolMessages = await Promise.all(
      response.tool_calls.map(async (toolCall, index) => {
        if (toolCall.name !== searchTool.name) {
          return new ToolMessage({
            content: `Unknown tool: ${toolCall.name}`,
            tool_call_id: toolCall.id || `${toolCall.name}-${i}-${index}`,
            status: "error",
          });
        }

        try {
          const result = await searchTool.invoke(toolCall.args);
          return new ToolMessage({
            content: typeof result === "string" ? result : JSON.stringify(result),
            tool_call_id: toolCall.id || `${toolCall.name}-${i}-${index}`,
            status: "success",
          });
        } catch (error) {
          return new ToolMessage({
            content: error.message || "Search failed",
            tool_call_id: toolCall.id || `${toolCall.name}-${i}-${index}`,
            status: "error",
          });
        }
      })
    );

    conversation.push(response, ...toolMessages);
    response = await geminiModelWithTools.invoke(conversation);
  }

  return getMessageText(response);
}

const resolveToolCalls = async (conversation) => {
  let response = await geminiModelWithTools.invoke(conversation);

  for (let i = 0; i < 3 && response.tool_calls?.length; i += 1) {
    const toolMessages = await Promise.all(
      response.tool_calls.map(async (toolCall, index) => {
        const toolCallId = toolCall.id || `${toolCall.name}-${i}-${index}`;

        if (toolCall.name !== searchTool.name) {
          return new ToolMessage({
            content: `Unknown tool: ${toolCall.name}`,
            tool_call_id: toolCallId,
            status: "error",
          });
        }

        try {
          const result = await searchTool.invoke(toolCall.args);
          return new ToolMessage({
            content: typeof result === "string" ? result : JSON.stringify(result),
            tool_call_id: toolCallId,
            status: "success",
          });
        } catch (error) {
          return new ToolMessage({
            content: error.message || "Search failed",
            tool_call_id: toolCallId,
            status: "error",
          });
        }
      })
    );

    conversation.push(response, ...toolMessages);
    response = await geminiModelWithTools.invoke(conversation);
  }

  return conversation;
};

export const streamResponse = async (userMessages, onToken) => {
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

  const conversation = await resolveToolCalls([answerSystemPrompt, ...messages]);
  let finalText = "";

  for await (const chunk of await geminiModel.stream(conversation)) {
    const token = getMessageText(chunk);
    if (!token) continue;

    finalText += token;
    await onToken(token);
  }

  return finalText;
};

export const genrateTitle = async (userMessage) => {
  const response = await mistralModel.invoke([ new SystemMessage("You are a helpful assistant that generates concise and relevant titles for user queries."), new HumanMessage(`Generate a concise and relevant title for the following user query: "${userMessage}"`)]);
  return getMessageText(response)
}
