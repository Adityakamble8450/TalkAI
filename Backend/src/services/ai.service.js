import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import readline from "readline/promises";
import {HumanMessage} from 'langchain'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});
const messages = []
export const testai = async () => {

    while (true){
        const userInput = await rl.question("you: ")

        messages.push(new HumanMessage(userInput) )

        const response = await model.invoke(messages)

        messages.push(response)
        console.log("AI : " + response.content)
    }
  
    rl.close();
  }

