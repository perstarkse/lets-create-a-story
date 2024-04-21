"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useScaffoldContractWrite, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { generateStoryBackend } from "~~/utils/api";

export default function ContributeToStory() {
  const [inputValue, setInputValue] = useState("");
  const [fetchEvents, setFetchEvents] = useState(false);
  const [effectExecuted, setEffectExecuted] = useState(false);
  const [generationResult, setGenerationResult] = useState<boolean>(false);

  const { writeAsync, isLoading, isMining, isSuccess } = useScaffoldContractWrite({
    contractName: "StoryKeeper",
    functionName: "submitOrReplaceInspiration",
    args: [inputValue],
    blockConfirmations: 1,
    onBlockConfirmation: () => {
      console.log("Block confirmation received");
      setFetchEvents(true);
    },
  });

  const { data: contractEvents, isLoading: isLoadingHistory } = useScaffoldEventHistory({
    contractName: "StoryKeeper",
    eventName: "InspirationSubmission",
    fromBlock: 0n,
    enabled: fetchEvents,
  });

  const { setEventHistory, setStoryData } = useGlobalState();

  const generateStory = async (story: string, timestamp: number) => {
    console.log("Generating story from latest inspiration submission");
    const result = await generateStoryBackend(story, timestamp);
    if (result) {
      setStoryData(result);
      setGenerationResult(true);
    }
  };

  useEffect(() => {
    if (!effectExecuted && !isLoadingHistory && contractEvents?.length) {
      setEffectExecuted(true);
      console.log("contractEvents", contractEvents);
      setEventHistory(contractEvents);

      const latestInspirationSubmission = {
        story: contractEvents[0].args.story,
        // @ts-ignore
        timestamp: Number(contractEvents[0].block.timestamp),
      };

      if (latestInspirationSubmission.story) {
        generateStory(latestInspirationSubmission.story, latestInspirationSubmission.timestamp);
      }
    }
  }, [isLoadingHistory, contractEvents, setEventHistory, generateStory, effectExecuted]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Contribute to the Story</h3>
      {!(isLoading || isMining || isSuccess) && (
        <>
          <p className="mb-4">
            Please take part and contribute to the story. Enter your contribution below and submit it. Your contribution
            will influence the story.
          </p>
          <input
            type="text"
            placeholder="Enter your contribution"
            className="input input-bordered w-full rounded-lg"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            onClick={() => writeAsync()}
            className={`btn btn-primary mt-4 ${isLoading || isMining ? "loading" : ""}`}
            disabled={isLoading || isMining}
          >
            {isLoading || isMining ? "Loading..." : "Submit"}
          </button>
        </>
      )}
      {isSuccess && !generationResult && (
        <div className="alert alert-success shadow-lg mt-4">
          <div className="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Your contribution has been submitted successfully and the story will now regenerate!</span>
          </div>
        </div>
      )}
      {generationResult && (
        <div className="alert alert-success shadow-lg mt-4">
          <div className="flex gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>The story has been successfully generated!</span>
            <Link href="/story">
              <a className="btn btn-primary">View Story</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
