import { list } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list();

    if (!blobs || blobs.length === 0) {
      return new Response(JSON.stringify({ message: "no images found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(blobs), {
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
