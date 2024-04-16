"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Chapters from "~~/components/Chapters";
// import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { getStoryFromBackend } from "~~/utils/api";

const Story: NextPage = () => {
  const [coverimage, setCoverImage] = useState<string>("");
  const { eventHistory, setEventHistory, storyData, setStoryData } = useGlobalState();

  const { data: contractEvents, isLoading } = useScaffoldEventHistory({
    contractName: "StoryKeeper",
    eventName: "InspirationSubmission",
    fromBlock: 0n,
  });

  useEffect(() => {
    if (storyData || eventHistory) {
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
        console.log(result);

        if (result.status === 404) {
          const secondToLastSubmission = {
            story: contractEvents[1]?.args.story,
            // @ts-ignore
            timestamp: Number(contractEvents[1]?.block.timestamp),
          };
          result = await getStoryFromBackend(secondToLastSubmission.timestamp.toString());
        }
        if (result) setStoryData(result);
      };

      getStory();
    }
  }, [isLoading, contractEvents, eventHistory, storyData, setEventHistory, setStoryData]);

  useEffect(() => {
    if (storyData?.image && !coverimage) {
      setCoverImage(storyData.image);
    }
  }, [storyData, coverimage]);

  if (!storyData) {
    return <></>;
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 max-w-5xl mx-auto">
        <div className="px-5">
          <div className="flex justify-center">
            {/* <button onClick={generateStory} className="btn btn-primary">
              {" "}
              Generate Story
            </button> */}
          </div>
          <h1 className="text-4xl pt-4 text-center font-serif font-bold">{storyData?.generatedStory.title}</h1>
          <h2 className="text-2xl py-2 text-center italic font-serif font-bold">
            {storyData?.generatedStory.subtitle}
          </h2>
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {coverimage ? <img src={coverimage} alt="Cover" className="w-full rounded-lg" /> : ""}
          </div>
          <Chapters
            showContribute
            chapters={storyData?.generatedStory.chapters.length ? storyData.generatedStory.chapters : []}
          />
        </div>
      </div>
    </>
  );
};

export default Story;
