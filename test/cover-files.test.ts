import * as fs from "node:fs";
import { test } from "vitest";

type Source = typeof import("../src/covered-files/source-file-1");
const directory = new URL("../src/covered-files", import.meta.url).pathname;
const files = fs.readdirSync(directory);

test.each(files)("cover file %s", async (file) => {
  const mod = (await import(`../src/covered-files/${file}`)) as Source;

  mod.method1(1);
  mod.method2(2);
  mod.method3(3);
  mod.method4(4);
  mod.method5(5);
});
