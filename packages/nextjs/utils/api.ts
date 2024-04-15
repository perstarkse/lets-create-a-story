export const getStoryFromBackend = async (timestamp: string): Promise<any> => {
  try {
    const response = await fetch(`/api/getStory?timestamp=${timestamp}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return response;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching story:", error);
    throw error;
  }
};

export const generateStoryBackend = async (story: string, timestamp: number) => {
  const response = await fetch("/api/generateStory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ story, timestamp }),
  });
  return await response.json();
};
