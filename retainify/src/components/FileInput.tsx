import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, createLoader, Reader } from "@asteasolutions/epub-reader";

export function FileInput({ onChange }: { onChange }) {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" onChange={onChange} />
    </div>
  );
}
