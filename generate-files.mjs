import * as fs from "node:fs";
import { resolve } from "node:path";

// 600, 600, 200 is enough to crash Vitest versions before https://github.com/vitest-dev/vitest/pull/4603
const COVERED_FILE_COUNT = parseInt(process.env.COVERED_FILE_COUNT || 600);
const UNCOVERED_FILE_COUNT = parseInt(process.env.UNCOVERED_FILE_COUNT || 600);
const FUNCTION_COUNT = parseInt(process.env.FUNCTION_COUNT || 200);

console.log("Generating files");
console.log({ COVERED_FILE_COUNT, UNCOVERED_FILE_COUNT, FUNCTION_COUNT });

const sourceFileContents = toList(FUNCTION_COUNT)
  .map((index) =>
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
  )
  .join("\n\n");

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

  for (const i of toList(count)) {
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

for (const i of toList(COVERED_FILE_COUNT)) {
  const index = 1 + i;

  const filename = resolve(testDir, `test-file-${index}.test.ts`);
  fs.writeFileSync(filename, testFileContents(index), "utf-8");
}

function toList(count) {
  return Array.from(Array(count).fill(0).keys());
}
