"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Chapters from "~~/components/Chapters";
import { getStoryFromBackend } from "~~/utils/api";

const StoryPage = () => {
  const [coverimage, setCoverImage] = useState<string>("");
  const [storyData, setStoryData] = useState<any>(null);
  const { timestamp } = useParams();

  useEffect(() => {
    const fetchStory = async () => {
      const result = await getStoryFromBackend(timestamp as string);
      setStoryData(result);
    };

    fetchStory();
  }, [timestamp]);

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
          <h1 className="text-4xl pt-4 text-center font-serif font-bold">{storyData?.generatedStory.title}</h1>
          <h2 className="text-2xl py-2 text-center italic font-serif font-bold">
            {storyData?.generatedStory.subtitle}
          </h2>
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {coverimage ? <img src={coverimage} alt="Cover" className="w-full rounded-lg" /> : ""}
          </div>
          <Chapters chapters={storyData?.generatedStory.chapters.length ? storyData.generatedStory.chapters : []} />
        </div>
      </div>
    </>
  );
};

export default StoryPage;
