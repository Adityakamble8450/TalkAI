import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import readline from "readline/promises";
import { HumanMessage } from "@langchain/core/messages";
import { tavily } from "@tavily/core";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { createAgent } from "langchain";
// import {  } from "@langchain/langgraph/prebuilt";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createTavilyClient = () => {
  if (!process.env.TAVILY_API_KEY) {
    return null;
  }

  return tavily({
    apiKey: process.env.TAVILY_API_KEY,
  });
};

const tavilyTool = new DynamicStructuredTool({
  name: "tavily_search",
  description: "Search the internet for latest or real-time information",
  schema: z.object({
    query: z.string().describe("Search query"),
  }),
  func: async ({ query }) => {
    const tvly = createTavilyClient();

    if (!tvly) {
      return "TAVILY_API_KEY is missing";
    }

    try {
      const result = await tvly.search(query);
      return JSON.stringify(result);
    } catch (error) {
      console.error("Tavily error:", error.message);
      return "Error fetching data from web";
    }
  },
});




const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

const agent = createAgent({
 model,
  tools: [tavilyTool]
});

export const main = async () => {
  console.log("AI Chat Console - Type your messages (Ctrl+C to exit)\n");
  
  while (true) {
    try {
      const userMessage = await rl.question("You: ");
      
      if (!userMessage.trim()) continue;
      
      const response = await agent.invoke({ 
        messages: [new HumanMessage(userMessage)] 
      });

      const aiResponse = response.messages[response.messages.length - 1];
      console.log("\nAI:", aiResponse.content, "\n");
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};

// Run the main function
main().catch(console.error).finally(() => rl.close());
