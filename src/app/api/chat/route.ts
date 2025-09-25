import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log("Received message:", message);  // Log input

    const llm = new ChatOpenAI({
      model: "sonar",
      temperature: 0.7,
      apiKey: process.env.PERPLEXITY_API_KEY,
      configuration: {
        baseURL: "https://api.perplexity.ai",
      },
    });
    console.log("LLM initialized");  // Confirm setup

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant."],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({ input: message });
    console.log("LLM response:", response.content);  // Log output

    return NextResponse.json({ response: response.content }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);  // Log any errors
    return  NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
