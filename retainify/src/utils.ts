export function extractPagesFromFile(
  file: File,
  maxPageLength: number
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const text = reader.result as string;

      // Split into pages
      const pages: string[] = [];
      let currentPageLength = 0;
      for (let i = 0; i < text.length; i += currentPageLength) {
        const baseText = text.slice(i, i + maxPageLength);
        const lastDotIndex = baseText.lastIndexOf(".");
        if (lastDotIndex === -1) {
          pages.push(baseText);
          currentPageLength = maxPageLength;
        } else {
          pages.push(baseText.slice(0, lastDotIndex + 1));
          currentPageLength = lastDotIndex + 1;
        }
      }

      resolve(pages);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}
