"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { generateStoryBackend, getStoryFromBackend } from "~~/utils/api";

const Home: NextPage = () => {
  const { data: contractEvents, isLoading } = useScaffoldEventHistory({
    contractName: "StoryKeeper",
    eventName: "InspirationSubmission",
    fromBlock: 0n,
  });

  const { eventHistory, setEventHistory, storyData, setStoryData } = useGlobalState();
  const [coverimage, setCoverImage] = useState<string>("");

  useEffect(() => {
    if (storyData && eventHistory) {
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

        if (result.status === 404) {
          const secondToLastSubmission = {
            story: contractEvents[1]?.args.story,
            // @ts-ignore
            timestamp: Number(contractEvents[1]?.block.timestamp),
          };
          result = await getStoryFromBackend(secondToLastSubmission.timestamp.toString());
          if (result.status === 404 && latestInspirationSubmission.story) {
            console.log(result);
            console.log("Generating story from latest inspiration submission");
            result = generateStoryBackend(latestInspirationSubmission.story, latestInspirationSubmission.timestamp);
            if (result) {
              setStoryData(result);
            }
          }
        }
        if (result) setStoryData(result);
        console.log("storyData", storyData);
        console.log("result", eventHistory);
      };

      getStory();
    }
  }, [isLoading, eventHistory, storyData, contractEvents, setEventHistory, setStoryData]);

  useEffect(() => {
    if (storyData?.image && !coverimage) {
      setCoverImage(storyData.image);
    }
  }, [storyData, coverimage]);

  return (
    <>
      <div className="hero flex-grow pt-10 max-w-5xl mx-auto text-center">
        <div className="px-5">
          <h1 className="text-4xl font-bold">Let&apos;s Create A Story Together</h1>
          <p className="text-lg ">
            This is a shared storytelling experience where users can submit inspiration and the AI will generate a story
            for us. It is an ever changing experience.
          </p>
          <div className="flex justify-center flex-col">
            {storyData?.generatedStory ? (
              <>
                {" "}
                <h3 className="text-xl mt-4 font-bold">The Current Story:</h3>
                <div className="flex justify-center items-center space-x-2">
                  <p className="text-lg">
                    {storyData?.generatedStory ? `${storyData.generatedStory.title}` : "Loading..."}
                  </p>
                  <span className="text-lg">-</span>
                  <p className="italic text-lg">
                    {storyData?.generatedStory ? `${storyData.generatedStory.subtitle}` : "Loading..."}
                  </p>
                </div>
                <div className="mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {coverimage ? <img src={coverimage} alt="Cover" className="w-full rounded-lg" /> : ""}
                </div>
              </>
            ) : (
              <>
                <p className="italic">
                  The story has not begun yet, enter your inspiration and see the story take fold
                </p>
              </>
            )}
          </div>
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
        </div>
      </div>
    </>
  );
};

export default Home;
