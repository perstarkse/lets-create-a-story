"use client";

import type { NextPage } from "next";
import ContributeToStory from "~~/components/ContributeToStory";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Contribute: NextPage = () => {
  const { data: inspirationCount } = useScaffoldContractRead({
    contractName: "StoryKeeper",
    functionName: "inspirationCount",
  });

  const { data: currentStoryInspirations } = useScaffoldContractRead({
    contractName: "StoryKeeper",
    functionName: "getStory",
  });

  return (
    <div className="flex flex-col items-center m-auto max-w-4xl mt-16">
      <h1 className="text-4xl font-bold mb-8">Contribute</h1>
      <p className="text-lg mb-4 px-6 text-center">
        So far {inspirationCount?.toString()} {inspirationCount?.toString() === "1" ? "user" : "users"} have contributed
        to the story.
      </p>
      <div className="flex flex-col items-center text-lg mb-2 px-6 text-center">
        <h2 className="font-bold">The current inspiration for the story:</h2>
        <p className="italic text-center">{currentStoryInspirations}</p>
      </div>
      <ContributeToStory />
    </div>
  );
};

export default Contribute;
