import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import type { Reporter, Vitest } from "vitest";

class MainThreadMemoryReporter implements Reporter {
  onInit(ctx: Vitest) {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      const heap = Math.floor(process.memoryUsage().heapUsed / 1024 / 1024);

      ctx.logger.log(` ⚠️  Memory usage: ${heap} MB heap used`);

      if (existsSync(resolve("./coverage/coverage-final.json"))) {
        clearInterval(interval);
        ctx.logger.log("Stopping memory logger");
      }
    }, 500);
  }
}

export default defineConfig({
  test: {
    watch: false,
    logHeapUsage: true,
    reporters: ["verbose", new MainThreadMemoryReporter()],
    coverage: {
      enabled: true,
      provider: "istanbul",
      reporter: ["text-summary", "json"],
      include: ["src/**"],

      // Enabled by default in v1
      all: true,
    },
  },
});
