import { defineConfig } from "vitest/config";

// Õpilase testid: `harjutused/`
export default defineConfig({
  test: {
    include: ["harjutused/**/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.js"],
      exclude: ["src/server.js"],
      reporter: ["text", "html"],
    },
  },
});
