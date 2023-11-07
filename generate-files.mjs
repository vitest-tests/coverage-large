import * as fs from "node:fs";
import { resolve } from "node:path";

const COVERED_FILE_COUNT = Array(100).fill(0);
const UNCOVERED_FILE_COUNT = Array(500).fill(0);
const FUNCTION_COUNT = Array(100).fill(0);

const fileContents = FUNCTION_COUNT.map((_, index) =>
  `
export function method${1 + index}(condition: number) {
  if (condition !== 1) {
    if (condition !== 2) {
      if (condition !== 3) {
        if (condition !== 4) {
          if (condition !== 5) {
            return 6;
          }
        }
      }
    }
  }

  return 0;
}
`.trim()
).join("\n\n");

const entries = [
  [new URL("src/covered-files", import.meta.url).pathname, COVERED_FILE_COUNT],
  [
    new URL("src/uncovered-files", import.meta.url).pathname,
    UNCOVERED_FILE_COUNT,
  ],
];

for (const [directory, count] of entries) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true });
  }

  fs.mkdirSync(directory);

  for (const i of count.keys()) {
    const index = 1 + i;
    const filename = resolve(directory, `source-file-${index}.ts`);

    fs.writeFileSync(filename, fileContents, "utf-8");
  }
}
