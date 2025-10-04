import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, createLoader, Reader } from "@asteasolutions/epub-reader";

export function FileInput() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="picture">Picture</Label>
      <Input
        id="picture"
        type="file"
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
                  const reader = new Reader(container, book);

                  reader.loadContent().subscribe(() => {
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
    </div>
  );
}
