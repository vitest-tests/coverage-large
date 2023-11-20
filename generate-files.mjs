import * as fs from "node:fs";
import { resolve } from "node:path";

const COVERED_FILE_COUNT = Array(100).fill(0);
const UNCOVERED_FILE_COUNT = Array(500).fill(0);
const FUNCTION_COUNT = Array(100).fill(0);

const sourceFileContents = FUNCTION_COUNT.map((_, index) =>
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

const testFileContents = (index) =>
  `
import { test } from "vitest";

import * as source from "../src/covered-files/source-file-${index}";

test("cover file ${index}", async (file) => {
  source.method1(1);
  source.method2(2);
  source.method3(3);
  source.method4(4);
  source.method5(5);
});
`.trim();

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
    fs.writeFileSync(filename, sourceFileContents, "utf-8");
  }
}

const testDir = new URL("test", import.meta.url).pathname;

if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true });
}

fs.mkdirSync(testDir);

for (const i of COVERED_FILE_COUNT.keys()) {
  const index = 1 + i;

  const filename = resolve(testDir, `test-file-${index}.test.ts`);
  fs.writeFileSync(filename, testFileContents(index), "utf-8");
}
