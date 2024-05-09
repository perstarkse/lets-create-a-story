"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { generateStoryBackend } from "~~/utils/api";

const Timeline: NextPage = () => {
  const { eventHistory, setEventHistory } = useGlobalState();
  const [coverImages, setCoverImages] = useState<[]>([]);
  const [generationResult, setGenerationResult] = useState<boolean>(false);

  const { data: contractEvents, isLoading } = useScaffoldEventHistory({
    contractName: "StoryKeeper",
    eventName: "InspirationSubmission",
    fromBlock: 0n,
  });

  useEffect(() => {
    if (!eventHistory && !isLoading && contractEvents?.length) {
      setEventHistory(contractEvents);
    }
  }, [isLoading, contractEvents, eventHistory, setEventHistory, coverImages, setCoverImages]);
  useEffect(() => {
    const getCoverImages = async () => {
      const response = await fetch("/api/getCoverImages");
      const images = await response.json();
      setCoverImages(images);
    };
    getCoverImages();
  }, [generationResult]);

  const generateStory = async (story: string, timestamp: number) => {
    const result = await generateStoryBackend(story, timestamp);
    if (result) {
      setGenerationResult(true);
    }
  };

  return (
    <div className="flex flex-col items-center m-auto max-w-6xl mt-16 px-6">
      {eventHistory && eventHistory.length > 0 && (
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {eventHistory?.reverse().map((event: any, index: any) => (
            <li key={index}>
              <div className="timeline-middle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div
                className={`timeline-${index % 2 === 0 ? "start" : "end"} md:text-${
                  index % 2 === 0 ? "end" : "start"
                } mb-10`}
              >
                <time className="font-mono italic">
                  {new Date(Number((event as any).block?.timestamp ?? 0) * 1000).toLocaleString()}
                </time>
                <div className={`text-lg font-black flex mt-2 ${index % 2 === 0 ? "justify-start" : "justify-start"}`}>
                  <Address address={event.args[0]} />
                </div>
                {
                  // @ts-ignore
                  coverImages.find(image => image.pathname === `${event.block.timestamp}.png`) ? (
                    </* eslint-disable-next-line @next/next/no-img-element */
                    img
                      // @ts-ignore
                      src={coverImages.find(image => image.pathname === `${event.block.timestamp}.png`).url}
                      className="w-3/4 mt-2"
                    />
                  ) : (
                    <div className="w-1/2 mt-2 h-40 skeleton rounded"></div>
                  )
                }
                <div className="italic mt-2">
                  <strong>Submission:</strong> {event.args[1]}
                </div>
                {
                  //@ts-ignore
                  coverImages.find(image => image.pathname === `${event.block.timestamp}.png`) ? (
                    <Link href={`/story/${event.block.timestamp}`}>
                      <div className="underline text-accent mt-2">View the story at this time</div>
                    </Link>
                  ) : (
                    <div className="underline text-accent mt-2">
                      <div onClick={() => generateStory(event.args.story, event.block.timestamp.toString())}>
                        Generate Story
                      </div>
                    </div>
                  )
                }
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Timeline;
