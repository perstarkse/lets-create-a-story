// static by default, unless reading the request
import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

const getStoryPrompt = (story: string) => {
  const prompt = `
  Your role is to create a story using snippets of texts that users \
  has provided. It's a collective project where a users may submit inspiration \
  that together you take to form a story. It should be safe for work and children. \ 
  Make sure you provide a full story, albeit short, 300 words. Make sure it is interesting. \
  ALWAYS Split the story into three chapters. Make sure the story contains three chapters! \
  Use markdown to format the story. \
  THE OUTPUT SHOULD BE A JSON OBJECT WITH THE FOLLOWING FORMAT: \
  { \
    "title": "THE TITLE" \
    "subtitle": "THE SUBTITLE" \
    "chapters": [ \
      { chapter: 1 , content:"CHAPTER 1" }, \
      { chapter: 2 , content:"CHAPTER 2" }, \
      { chapter: 3 , content:"CHAPTER 3" } \
    ] \
  } \

  User Inputs
  ${story}
  
  Generate the story
  `;
  return prompt;
};

const getImagePrompt = (story: string) => {
  const prompt = `
  Your role is to create a prompt for an AI that will generate the illustration for the story provided. \
  The prompt should be based on the story provided by the user. It should be safe for work and children. \
  Make sure the prompt is interesting and engaging. \
  Use references to artists, styles, and themes to guide the AI. \
  Anatomy of a good prompt \ 
  A good prompt needs to be detailed and specific. A good process is to look through a list of keyword categories \
  and decide whether you want to use any of them. \
  Make sure to use a short and concise prompt. \

  The keyword categories are: \
  Subject \
  Medium \ 
  Style \ 
  Art-sharing website \
  Resolution \
  Additional details \
  Color \
  Lighting \ 

  Example prompts: \
  "a beautiful and powerful mysterious sorceress, smile, sitting on a rock, lightning magic, hat, detailed leather clothing with gemstones, dress, castle background" \
  "A beautiful Ukrainian Girl with very long straight hair, full lips, a gentle look, and very light white skin. She wears a medieval dress." \
  
  Story: \
  ${story}
  
  Generate the prompt for the illustration according to instructions and only answer with the prompt.
  `;
  return prompt;
};

interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const { story, timestamp } = await request.json();
    if (!story) return;
    console.log("Getting story from timestamp", timestamp);

    // GENERATE THE STORY

    const storyResult = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:beta",
        messages: [{ role: "user", content: getStoryPrompt(story) }],
      }),
    });

    const storyData = await storyResult.json();
    console.log("Generation of story completed");

    // GENERATE THE IMAGE PROMPT

    const imagePromptResult = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:beta",
        messages: [{ role: "user", content: getImagePrompt(storyData.choices[0].message.content) }],
      }),
    });

    const imagePromptData = await imagePromptResult.json();
    const imagePrompt = imagePromptData.choices[0].message.content;

    console.log("Generation of image prompt completed");

    // GENERATING THE IMAGE

    const engineId = "stable-diffusion-v1-6";
    const apiKey = process.env.STABILITY_API_KEY;

    const response = await fetch(`https://api.stability.ai/v1/generation/${engineId}/text-to-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: imagePrompt,
          },
        ],
        cfg_scale: 7,
        height: 512,
        width: 1024,
        steps: 30,
        samples: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const responseJSON = (await response.json()) as GenerationResponse;

    console.log("Generation of image completed");

    // SAVE TO BLOB AND KV

    const filename = `${timestamp}.png`;
    const imageBuffer = Buffer.from(responseJSON.artifacts[0].base64, "base64");
    const blob = await put(filename, imageBuffer, {
      access: "public",
    });

    await kv.hset(timestamp, {
      timestamp: timestamp,
      generatedStory: storyData.choices[0].message.content,
      submittedStory: story,
      image: blob.url,
      imagePrompt: imagePrompt,
    });

    console.log("Image and Story object saved to Vercel");

    return new Response(JSON.stringify({ story: storyData.choices[0].message.content }), {
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
