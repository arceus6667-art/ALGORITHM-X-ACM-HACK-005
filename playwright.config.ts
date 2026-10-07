import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 40000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3200",
    headless: true,
    launchOptions: { args: ["--no-sandbox"] },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    env: { PORT: "3200" },
    url: "http://127.0.0.1:3200/api/health",
    reuseExistingServer: false,
    timeout: 20000,
  },
});
