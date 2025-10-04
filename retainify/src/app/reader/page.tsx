"use client";

import { FileInput } from "@/components/FileInput";
import { createLoader, Reader, Book } from "@asteasolutions/epub-reader";

import "./reader.css";
import { useState } from "react";

export default function Page() {
  const [reader, setReader] = useState<Reader | null>(null);
  return (
    <>
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
              const container = document.getElementById("epub-reader");
              if (!container) return <></>;

              const loader = await createLoader(file);
              Book.open(loader).subscribe({
                next: (book) => {
                  const newReader = new Reader(container, book);
                  setReader(newReader);
                  newReader.loadContent().subscribe(() => {
                    // EPub is now rendered
                  });
                },
              });
            } catch (err) {
              console.error(err);
            }
          })();
        }}
      />
      <div id="epub-reader" className="mx-auto h-[800px] max-h-[80vh]"></div>

      <div>
        <button
          onClick={() => {
            console.log("prevPage");
            reader?.previousPage();
          }}
        >
          Prev page
        </button>
        <button
          onClick={() => {
            console.log("nextPage");
            reader?.nextPage();
          }}
        >
          Next page
        </button>
      </div>
    </>
  );
}
