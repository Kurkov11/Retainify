"use client";

import { FileInput } from "@/components/FileInput";

import "./reader.css";
import { useEffect, useState } from "react";
import { extractPagesFromFile, extractPagesFromText } from "@/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizDialog from "@/components/QuizDialog";

export default function Page() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pages, setPages] = useState<string[]>([]);
  const [selection, setSelection] = useState("");
  const [liveSelectionLength, setLiveSelectionLength] = useState(0);
  const [quizRunning, setQuizRunning] = useState<boolean>(false);
  const [bookContext, setBookContext] = useState<string>("");

  const pageCount = pages.length;

  useEffect(() => {
    function handleSelectionChange() {
      console.log("selectionchange ", quizRunning);
      if (quizRunning) return;

      const newSelection = getSelection()?.toString() || "";
      setLiveSelectionLength(newSelection.length);
    }
    function handleMouseUp() {
      if (quizRunning) return;

      console.log("mouseup");
      const newSelection = window.getSelection()?.toString() || "";
      setSelection(newSelection);
      setLiveSelectionLength(newSelection.length);

      const newBookContext =
        currentPage > 0 ? pages[currentPage - 1] : pages[currentPage];

      setBookContext(newBookContext);
    }
    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [quizRunning]);

  useEffect(() => {
    const savedBook = localStorage.getItem("uploadedBook");
    const savedPage = localStorage.getItem("currentPage");

    if (savedBook) {
      console.log("Book text retrieved:", savedBook);
      const newPages = extractPagesFromText(savedBook, 2_400);
      setPages(newPages);
    } else {
      console.log("No book found in localStorage.");
    }
    if (savedPage) {
      console.log("Page retrieved:", savedPage);
      setCurrentPage(parseInt(savedPage));
    } else {
      console.log("No book found in localStorage.");
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);
  return (
    <main className="mx-20 pt-10">
      <div className="flex justify-between">
        <div>
          <h1 className="font-medium text-xl mb-5">Retainify</h1>
          <FileInput
            onChange={(e) => {
              const file = e.target?.files?.[0];
              console.log(file);
              if (!file) {
                return;
              }
              (async () => {
                try {
                  const newPages = await extractPagesFromFile(file, 2_400); // max 1000 chars per page
                  setPages(newPages);
                } catch (err) {
                  console.error(err);
                }
              })();
            }}
          />
        </div>
        {pages.length > 0 && (
          <h2 className="font-medium text-xl">
            Page {currentPage + 1} / {pages.length}
          </h2>
        )}
      </div>
      <div className="grid grid-cols-2 gap-5 justify-center mt-5">
        <p>{pages[currentPage]}</p>
        {currentPage + 1 < pageCount && <p>{pages[currentPage + 1]}</p>}
      </div>
      <Button
        onClick={() => {
          setSelection("");
          setCurrentPage((page) => page - 1);
        }}
        disabled={currentPage - 1 < 0}
        className="fixed left-5 top-1/2 -translate-y-1/2 h-[100px]"
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={() => {
          setSelection("");
          setCurrentPage((page) => page + 1);
        }}
        className="fixed right-5 top-1/2 -translate-y-1/2 h-[100px]"
        disabled={currentPage + 1 >= pageCount}
      >
        <ArrowRight />
      </Button>
      {liveSelectionLength <= 500 && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2">
          <p className="text-gray-500">Selected characters</p>
          <p className="text-xl w-fit mx-auto">{liveSelectionLength} / 500</p>
        </div>
      )}
      {liveSelectionLength > 500 && (
        <QuizDialog
          onOpenChange={(open) => {
            console.log("onOpenChange callback: ", open);
            setQuizRunning(open);
          }}
          selection={selection}
          bookContext={bookContext}
        />
      )}
    </main>
  );
}
