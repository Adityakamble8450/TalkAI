import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});

export const testai = async ()=>{
   const response = await model.invoke('what is ai can you explaine')

   console.log(response.text)
}