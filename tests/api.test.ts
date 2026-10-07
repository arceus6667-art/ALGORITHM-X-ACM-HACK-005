import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn, ChildProcess } from "node:child_process";
let server: ChildProcess;
const base = "http://127.0.0.1:3100";
before(async () => {
  server = spawn(process.execPath, ["--import", "tsx", "server/index.ts"], {
    env: { ...process.env, PORT: "3100", MAX_UPLOAD_MB: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("server startup timeout")),
      15000,
    );
    server.stdout!.on("data", (d) => {
      if (d.toString().includes("AgentTrap running")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.once("exit", () => {
      clearTimeout(timer);
      reject(Error("server stopped"));
    });
  });
});
after(() => server?.kill());
async function send(
  bytes: Buffer,
  name: string,
  mime: string,
  platformId = "chatgpt",
) {
  const body = new FormData();
  body.append(
    "file",
    new Blob([bytes as unknown as BlobPart], { type: mime }),
    name,
  );
  body.append("platformId", platformId);
  return fetch(base + "/api/analyze", { method: "POST", body });
}
test("API registry and real multipart upload roundtrip", async () => {
  const p = await fetch(base + "/api/platforms");
  assert.equal(p.status, 200);
  assert((await p.json()).length >= 17);
  const r = await send(
    Buffer.from("Email: alex@example.com\nAPI_KEY=demo-only"),
    "blank.txt",
    "text/plain",
  );
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("cache-control"), "no-store");
  const data = await r.json();
  assert(data.detectedSignals.some((s: any) => s.id === "email"));
  assert(data.sources.length > 0);
  assert.equal(
    data.riskScore,
    data.factors.reduce((n: number, f: any) => n + f.points, 0),
  );
  assert(!JSON.stringify(data).includes("alex@example.com"));
});
test("API rejects video, oversized upload, corrupt PDF, MIME mismatch, unknown platform", async () => {
  assert.equal(
    (await send(Buffer.from("video"), "a.mp4", "video/mp4")).status,
    422,
  );
  assert.equal(
    (await send(Buffer.alloc(1025 * 1024, 65), "a.txt", "text/plain")).status,
    400,
  );
  assert.equal(
    (await send(Buffer.from("%PDF-corrupt"), "a.pdf", "application/pdf"))
      .status,
    422,
  );
  assert.equal(
    (await send(Buffer.from("abc"), "a.txt", "application/pdf")).status,
    422,
  );
  assert.equal(
    (await send(Buffer.from("abc"), "a.txt", "text/plain", "invalid")).status,
    400,
  );
});
test("missing policy evidence returns usable file-only report", async () => {
  const r = await send(Buffer.from("hello"), "a.txt", "text/plain", "other");
  assert.equal(r.status, 200);
  const data = await r.json();
  assert.equal(data.sources.length, 0);
  assert.equal(data.confidence, "Low");
  assert(data.unknown.length > 0);
});
