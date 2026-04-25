import { tavily as Tavily } from '@tavily/core'

const tavily = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export const getInternetData = async ({ query }) => {
    try {
        const result = await tavily.search(query, {
            numResults: 5,
            searchDepth: 'basic',
            includeSummary: true,
        });
        console.log("Internet data fetched successfully:", JSON.stringify(result));
        return JSON.stringify(result);
    } catch (error) {
        console.error("Error fetching internet data:", error);
        throw error;
    }
}