"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";

const Story: NextPage = () => {
  const { eventHistory, setEventHistory } = useGlobalState();

  const { data: contractEvents, isLoading } = useScaffoldEventHistory({
    contractName: "StoryKeeper",
    eventName: "InspirationSubmission",
    fromBlock: 0n,
  });

  useEffect(() => {
    if (!eventHistory && !isLoading && contractEvents?.length) {
      setEventHistory(contractEvents);
    }
  }, [isLoading, contractEvents, eventHistory, setEventHistory]);

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
              <div className="timeline-start md:text-end mb-10">
                <time className="font-mono italic">
                  {new Date(Number((event as any).block?.timestamp ?? 0) * 1000).toLocaleString()}
                </time>
                <div className="text-lg font-black flex justify-end mt-2">
                  <Address address={event.args[0]} />
                </div>
                <div className="italic mt-2">{event.args[1]}</div>
                <Link href={`/story/${event.block.timestamp}`}>
                  <div className="underline text-accent mt-2">View the story at this time</div>
                </Link>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Story;
