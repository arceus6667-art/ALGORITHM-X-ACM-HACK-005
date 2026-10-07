import { spawn } from "node:child_process";
import assert from "node:assert/strict";
const server = spawn(
  process.execPath,
  ["--import", "tsx", "scripts/start.mjs"],
  { env: { ...process.env, PORT: "3300" }, stdio: ["ignore", "pipe", "pipe"] },
);
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Startup timeout")), 15000);
    server.stdout.on("data", (d) => {
      if (d.toString().includes("AgentTrap running")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.once("exit", () => {
      clearTimeout(timer);
      reject(Error("Server stopped"));
    });
  });
  const html = await fetch("http://127.0.0.1:3300/demo").then((r) => r.text());
  assert(html.includes("/assets/"));
  assert(!html.includes("/src/main.tsx"));
  const body = new FormData();
  body.append(
    "file",
    new Blob(["Email: alex@example.com"], { type: "text/plain" }),
    "example.txt",
  );
  body.append("platformId", "chatgpt");
  const response = await fetch("http://127.0.0.1:3300/api/analyze", {
    method: "POST",
    body,
  });
  assert.equal(response.status, 200);
  const report = await response.json();
  assert(report.detectedSignals.some((s) => s.id === "email"));
  assert(report.sources.length > 0);
  console.log(
    "Production SPA routing, static assets and actual analysis API: passed.",
  );
} finally {
  server.kill();
}
