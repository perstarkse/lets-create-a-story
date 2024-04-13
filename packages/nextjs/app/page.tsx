"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Story from "~~/components/Story";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [savedStory, setStory] = useState<string>("");

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
    const result = await generateStoryBackend();
    setStory(result.story);
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
    console.log("result", result);
    setStory(result.generatedStory);
    getStoryParts();
  };

  const getStoryParts = () => {
    const parts = [
      savedStory.slice(0, savedStory.indexOf("\n\n## ")),
      savedStory.slice(savedStory.indexOf("\n\n## "), savedStory.indexOf("\n\n## ", savedStory.indexOf("\n\n## ") + 1)),
      savedStory.slice(
        savedStory.indexOf("\n\n## ", savedStory.indexOf("\n\n## ") + 1),
        savedStory.indexOf("\n\n## ", savedStory.indexOf("\n\n## ", savedStory.indexOf("\n\n## ") + 1) + 1),
      ),
      savedStory.slice(
        savedStory.indexOf("\n\n## ", savedStory.indexOf("\n\n## ", savedStory.indexOf("\n\n## ") + 1) + 1),
      ),
    ];

    // console.log(parts);
    return parts;
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Lets Create A Story</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <button onClick={generateStory} className="btn btn-primary">
            {" "}
            Generate Story
          </button>
          <button onClick={getStory} className="btn btn-primary">
            {" "}
            Get Story
          </button>
          <Story storyArray={savedStory.length ? getStoryParts() : []} />
          {/* <p className="text-center text-lg">{savedStory.length ? savedStory : ""}</p> */}
        </div>
      </div>
    </>
  );
};

export default Home;
