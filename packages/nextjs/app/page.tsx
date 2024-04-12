"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Story from "~~/components/Story";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [savedStory, setStory] = useState<string>("");

  const { data: story, isLoading } = useScaffoldContractRead({
    contractName: "StoryInspiration",
    functionName: "getStory",
  });

  const generateStoryBackend = async () => {
    const response = await fetch("/api/generateStory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story }),
    });
    return await response.json();
  };

  const generateStory = async () => {
    if (isLoading) return;
    const result = await generateStoryBackend();
    setStory(result.story);
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
          <Story story={savedStory.length ? savedStory : ""} />
          {/* <p className="text-center text-lg">{savedStory.length ? savedStory : ""}</p> */}
        </div>
      </div>
    </>
  );
};

export default Home;
