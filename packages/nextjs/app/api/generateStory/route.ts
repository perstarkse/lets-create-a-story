// static by default, unless reading the request
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

const getPrompt = (story: string) => {
  const prompt = `
  Your role is to create a story using snippets of texts that users \
  has provided. It's a collective project where a users may submit inspiration \
  that together you take to form a story. It should be safe for work and children. \ 
  Make sure you provide a full story, albeit short, 300 words. Make sure it is interesting. \
  ALWAYS Split the story into three chapters. Make sure the story contains three chapters! \
  Use markdown to format the story. \

  User Inputs
  ${story}
  
  Generate the story
  `;
  return prompt;
};

export async function POST(request: Request) {
  try {
    const { story, timestamp } = await request.json();
    if (!story) return;
    console.log("getting story from ai at timestamp", timestamp);
    const result = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: getPrompt(story) }],
      }),
    });

    const data = await result.json();

    await kv.hset(timestamp, {
      timestamp: timestamp,
      generatedStory: data.choices[0].message.content,
      submittedStory: story,
    });

    return new Response(JSON.stringify({ story: data.choices[0].message.content }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ message: "Error processing request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
