import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import type { Reporter, Vitest } from "vitest";

class MainThreadMemoryReporter implements Reporter {
  ctx!: Vitest;

  onInit(ctx: Vitest) {
    this.ctx = ctx;
  }

  onFinished() {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      const heap = Math.floor(process.memoryUsage().heapUsed / 1024 / 1024);

      this.ctx.logger.log(`Memory usage: ${heap} MB heap used`);

      if (existsSync(resolve("./coverage"))) {
        clearInterval(interval);
        this.ctx.logger.log("Stopping memory logger");
      }
    }, 500);
  }
}

export default defineConfig({
  test: {
    logHeapUsage: true,
    reporters: ["verbose", new MainThreadMemoryReporter()],
    coverage: {
      enabled: true,
      provider: "istanbul",

      // Enabled by default in v1
      all: true,
    },
  },
});
