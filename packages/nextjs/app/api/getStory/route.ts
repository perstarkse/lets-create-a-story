// static by default, unless reading the request
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timestamp = url.searchParams.get("timestamp");

    if (!timestamp) {
      return new Response(JSON.stringify({ message: "Timestamp is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const storyData = await kv.hgetall(timestamp);

    return new Response(JSON.stringify(storyData), {
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
