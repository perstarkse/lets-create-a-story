"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function Story({ storyArray }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // Display one story at a time

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = storyArray.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination logic
  const totalPages = Math.ceil(storyArray.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "h":
        case "ArrowLeft":
          setCurrentPage(Math.max(currentPage - 1, 1));
          break;
        case "l":
        case "ArrowRight":
          setCurrentPage(Math.min(currentPage + 1, totalPages));
          break;
        case "j":
        case "ArrowDown":
          setCurrentPage(Math.min(currentPage + 1, totalPages));
          break;
        case "k":
        case "ArrowUp":
          setCurrentPage(Math.max(currentPage - 1, 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentPage, totalPages]);

  return (
    <div className="container mx-auto px-4 py-8">
      {currentItems.map((story: any, index: number) => (
        <div key={index} className="my-4">
          <Markdown>{story}</Markdown>
        </div>
      ))}

      <div className="btn-group">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`btn btn-sm ${page === currentPage ? "btn-active" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
