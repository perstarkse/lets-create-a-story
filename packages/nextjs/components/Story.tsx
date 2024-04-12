"use client";

import React from "react";
import Markdown from "react-markdown";

export default function Story({ story }: any) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Markdown>{story}</Markdown>
    </div>
  );
}
