"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { getStoryFromBackend } from "~~/utils/api";

const Home: NextPage = () => {
  const { data: contractEvents, isLoading } = useScaffoldEventHistory({
    contractName: "StoryInspiration",
    eventName: "InspirationSubmission",
    fromBlock: 0n,
  });

  const { eventHistory, setEventHistory, storyData, setStoryData } = useGlobalState();

  useEffect(() => {
    if (eventHistory || storyData) {
      return;
    }
    if (!isLoading && contractEvents?.length) {
      setEventHistory(contractEvents);

      const latestInspirationSubmission = {
        story: contractEvents[0].args.story,
        // @ts-ignore
        timestamp: Number(contractEvents[0].block.timestamp),
      };

      const getStory = async () => {
        let result = await getStoryFromBackend(latestInspirationSubmission.timestamp.toString());
        if (!result) {
          const secondToLastSubmission = {
            story: contractEvents[1]?.args.story,
            // @ts-ignore
            timestamp: Number(contractEvents[1]?.block.timestamp),
          };
          result = await getStoryFromBackend(secondToLastSubmission.timestamp.toString());
        }
        if (result) setStoryData(result);
        console.log("storyData", storyData);
        console.log("result", eventHistory);
      };

      getStory();
    }
  }, [isLoading, eventHistory, storyData, contractEvents, setEventHistory, setStoryData]);

  return (
    <>
      <div className="hero flex-grow pt-10 max-w-5xl mx-auto text-center">
        <div className="px-5">
          <h1 className="text-4xl font-bold">Let&apos;s Create A Story Together</h1>
          <p className="text-lg ">
            This is a shared storytelling experience where users can submit inspiration and the AI will generate a story
            for us. It is an ever changing experience.
          </p>
          <div className="flex justify-center gap-2">
            <Link passHref href="/story">
              <button className="btn btn-primary mt-4">The Story</button>
            </Link>
            <Link passHref href="/timeline">
              <button className="btn btn-primary mt-4">Timeline</button>
            </Link>
            <Link passHref href="/contribute">
              <button className="btn btn-primary mt-4">Contribute</button>
            </Link>
          </div>

          <div className="flex justify-center">
            <p className="text-sm text-gray-600 mt-4">
              {storyData?.generatedStory
                ? `Last story generated: ${storyData.generatedStory.title} - ${storyData.generatedStory.subtitle}`
                : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
