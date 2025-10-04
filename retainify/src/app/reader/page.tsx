"use client";

import { FileInput } from "@/components/FileInput";
import "./reader.css";

export default function Page() {
  return (
    <>
      <h1>Book reader</h1>
      <FileInput />
      <div id="epub-reader" className="w-[800px] h-[800px]"></div>
    </>
  );
}
