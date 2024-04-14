import React, { useEffect, useState } from "react";
import ContributeToStory from "./ContributeToStory";
import Markdown from "react-markdown";

export default function Chapters({ chapters }: { chapters: { chapter: number; content: string }[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showContributeSection, setShowContributeSection] = useState(false);
  const itemsPerPage = 1;

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chapters.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination logic
  const totalPages = Math.ceil(chapters.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setShowContributeSection(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "h":
        case "ArrowLeft":
          setCurrentPage(Math.max(currentPage - 1, 1));
          setShowContributeSection(false);
          break;
        case "l":
        case "ArrowRight":
          if (currentPage === totalPages) {
            setShowContributeSection(true);
            return;
          }
          setCurrentPage(Math.min(currentPage + 1, totalPages));
          setShowContributeSection(false);
          break;
        case "j":
        case "ArrowDown":
          setCurrentPage(Math.min(currentPage + 1, totalPages));
          setShowContributeSection(false);
          break;
        case "k":
        case "ArrowUp":
          setCurrentPage(Math.max(currentPage - 1, 1));
          setShowContributeSection(false);
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

  // Show the "Contribute to the Story" section after 2 seconds on the last page
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (currentPage === totalPages) {
      timer = setTimeout(() => {
        setShowContributeSection(true);
      }, 2000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentPage, totalPages]);

  return (
    <div className="container mx-auto px-4 py-8">
      {currentItems.map((chapter: { chapter: number; content: string }, index: number) => (
        <div key={index} className={`mx-auto`}>
          <h2 className="text-2xl font-serif font-bold mb-4">Chapter {chapter.chapter}</h2>
          <div className="border-t border-b border-gray-300 py-2">
            <article className="font-serif text-lg leading-relaxed">
              <Markdown>{chapter.content}</Markdown>
            </article>
          </div>
        </div>
      ))}

      <div className="btn-group justify-center flex mt-4">
        <div className="tooltip tooltip-bottom" data-tip="Use h/j/k/l or ←/→ to navigate">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`btn btn-sm ml-1 first:ml-0 ${page === currentPage ? "btn-active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
      {showContributeSection && <ContributeToStory />}
    </div>
  );
}
