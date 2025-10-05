import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, createLoader, Reader } from "@asteasolutions/epub-reader";
import { ChangeEventHandler } from "react";

export function FileInput({
  onChange,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Input type="file" onChange={onChange} accept=".txt" />
    </div>
  );
}
