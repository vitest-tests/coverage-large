import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { CI: "true" },
    reporters: "verbose",
    coverage: {
      enabled: true,
      provider: "istanbul",

      // Enabled by default in v1
      all: true,
    },
  },
});
