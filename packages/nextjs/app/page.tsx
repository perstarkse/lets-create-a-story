"use client";

import { useState } from "react";
import type { NextPage } from "next";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Story from "~~/components/Story";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

interface GeneratedStory {
  title: string;
  subtitle: string;
  chapters: {
    chapter: number;
    content: string;
  }[];
}

interface StoryData {
  generatedStory: GeneratedStory;
  image: string;
  submittedStory: string;
  timestamp: string;
  imagePrompt: string;
}

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const [savedStory, setStory] = useState<GeneratedStory>({ title: "", subtitle: "", chapters: [] });
  const [coverimage, setCoverImage] = useState<string>("");

  const { data: storyEvents, isLoading } = useScaffoldEventHistory({
    contractName: "StoryInspiration",
    eventName: "InspirationSubmission",
    fromBlock: 0n,
  });

  console.log("storyEvents", storyEvents);

  const latestInspirationSubmission = {
    story: storyEvents?.length ? storyEvents[0]?.args?.story : "",
    // @ts-ignore
    timestamp: storyEvents?.length && storyEvents[0].block ? Number(storyEvents[0].block.timestamp) : 0,
  };

  console.log("latestInspirationSubmission", latestInspirationSubmission);

  const generateStoryBackend = async () => {
    console.log("latestInspirationSubmission", latestInspirationSubmission);
    const response = await fetch("/api/generateStory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(latestInspirationSubmission),
    });
    return await response.json();
  };

  const generateStory = async () => {
    if (isLoading) return;
    const result = (await generateStoryBackend()) as StoryData;
    setStory(result.generatedStory);
  };

  const getStoryFromBackend = async (timestamp: string) => {
    try {
      const response = await fetch(`/api/getStory?timestamp=${timestamp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching story:", error);
      throw error;
    }
  };

  const getStory = async () => {
    if (isLoading) return;
    const result = await getStoryFromBackend(latestInspirationSubmission.timestamp.toString());
    // if (result.status === 404) {
    //   result = await getStoryFromBackend()

    console.log("result", result);
    setStory(result.generatedStory);
    setCoverImage(result.image);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 max-w-5xl mx-auto">
        <div className="px-5">
          <h1 className="text-4xl font-bold">Welcome to Let Us Tell a Story Together</h1>
          <p className="text-lg ">
            This is a shared storytelling experience where users can submit inspiration and the AI will generate a story
            for us. It is an ever changing experience.
          </p>
          <button className="btn btn-primary mt-4">To The Story</button>
          <button className="btn btn-primary mt-4">View Contributions</button>
          <button className="btn btn-primary mt-4">Contribute</button>
          <div className="flex justify-center">
            <button onClick={generateStory} className="btn btn-primary">
              {" "}
              Generate Story
            </button>
            <button onClick={getStory} className="btn btn-primary">
              {" "}
              Get Story
            </button>
          </div>
          <h1 className="text-4xl pt-4 text-center font-serif font-bold">{savedStory.title}</h1>
          <h2 className="text-2xl py-2 text-center italic font-serif font-bold">{savedStory.subtitle}</h2>
          <div className="mt-4">
            {coverimage ? <img src={coverimage} alt="Cover" className="w-full rounded-lg" /> : ""}
          </div>
          <Story chapters={savedStory.chapters.length ? savedStory.chapters : []} />
        </div>
      </div>
    </>
  );
};

export default Home;
