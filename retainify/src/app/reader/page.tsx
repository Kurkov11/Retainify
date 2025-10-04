"use client";

import { FileInput } from "@/components/FileInput";
import { createLoader, Reader, Book } from "@asteasolutions/epub-reader";

import "./reader.css";
import { useEffect, useState } from "react";
import { extractPagesFromFile } from "@/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizDialog from "@/components/QuizDialog";

export default function Page() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pages, setPages] = useState<string[]>([]);
  const [selection, setSelection] = useState("");
  const pageCount = pages.length;

  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      const newSelection = window.getSelection()?.toString() || "";
      if (newSelection.length <= 500) {
        setSelection("");
      }
    });
    document.addEventListener("mouseup", () => {
      const newSelection = window.getSelection()?.toString() || "";
      console.log(newSelection);
      setSelection(newSelection);
    });
  }, []);
  return (
    <main className="mx-20">
      <h1>Book reader</h1>
      <FileInput
        onChange={(e) => {
          const file = e.target?.files?.[0];
          console.log(file);
          if (!file) {
            return;
          }
          (async () => {
            try {
              const newPages = await extractPagesFromFile(file, 2_300); // max 1000 chars per page
              setPages(newPages);
            } catch (err) {
              console.error(err);
            }
          })();
        }}
      />
      <div className="grid grid-cols-2 gap-5 justify-center mt-5">
        <p>{pages[currentPage]}</p>
        {currentPage + 1 < pageCount && <p>{pages[currentPage + 1]}</p>}
      </div>
      <Button
        onClick={() => {
          setCurrentPage((page) => page - 1);
        }}
        disabled={currentPage - 1 < 0}
        className="absolute left-5 top-1/2 -translate-y-1/2 h-[100px]"
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={() => {
          setCurrentPage((page) => page + 1);
        }}
        className="absolute right-5 top-1/2 -translate-y-1/2 h-[100px]"
        disabled={currentPage + 1 >= pageCount}
      >
        <ArrowRight />
      </Button>
      {selection.length > 500 && <QuizDialog />}
    </main>
  );
}
