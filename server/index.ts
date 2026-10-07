import "dotenv/config";
import express from "express";
import multer from "multer";
import { rateLimit } from "express-rate-limit";
import path from "node:path";
import { platforms } from "./services/PolicyRetriever";
import { validateFile } from "./services/FileAnalyzer";
import { isolatedAnalysis, buildReport } from "./services/AnalysisService";
export const app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.path.startsWith("/api")) res.setHeader("Cache-Control", "no-store");
  next();
});
const configured = Number(process.env.MAX_UPLOAD_MB || 10);
const maxMB =
  Number.isFinite(configured) && configured > 0 ? Math.min(configured, 10) : 10;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxMB * 1024 * 1024,
    files: 1,
    fields: 1,
    fieldSize: 200,
    parts: 2,
  },
});
app.get("/api/health", (_req, res) =>
  res.json({
    status: "ok",
    storage: "memory-only",
    externalAI: false,
    maxUploadMB: maxMB,
  }),
);
app.get("/api/platforms", (_req, res) => res.json(platforms));
app.get("/api/platforms/:id", (req, res) => {
  const p = platforms.find((p) => p.id === req.params.id);
  p ? res.json(p) : res.status(404).json({ error: "Unknown platform." });
});
let active = 0;
app.post(
  "/api/analyze",
  rateLimit({
    windowMs: 60_000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many analyses. Please retry in a minute." },
  }),
  (req, res, next) => {
    if (active >= 2) {
      res
        .status(503)
        .json({ error: "Analysis is busy. Please retry shortly." });
      return;
    }
    active++;
    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        active--;
      }
    };
    res.locals.release = release;
    res.once("finish", () => {
      if (!res.locals.processing) release();
    });
    res.once("close", () => {
      if (!res.locals.processing) release();
    });
    next();
  },
  upload.single("file"),
  async (req, res) => {
    const started = Date.now();
    res.locals.processing = true;
    try {
      const platform = platforms.find((p) => p.id === req.body?.platformId);
      if (!platform || !req.file) {
        res
          .status(400)
          .json({ error: "A supported file and valid platform are required." });
        return;
      }
      const safeName = path
        .basename(req.file.originalname)
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      validateFile(req.file.buffer, safeName, req.file.mimetype, maxMB);
      const signals = await isolatedAnalysis(
        req.file.buffer,
        safeName,
        req.file.mimetype,
      );
      const report = await buildReport(signals, platform);
      console.info(
        JSON.stringify({
          event: "analysis_completed",
          durationMs: Date.now() - started,
          provider: report.decisionProvider,
        }),
      );
      res.json(report);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Analysis unavailable.";
      console.info(
        JSON.stringify({
          event: "analysis_failed",
          durationMs: Date.now() - started,
        }),
      );
      res.status(422).json({ error: message });
    } finally {
      if (req.file) req.file.buffer.fill(0);
      res.locals.processing = false;
      res.locals.release?.();
    }
  },
);
app.use("/api", (_req, res) =>
  res.status(404).json({ error: "API route not found." }),
);
app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) =>
    res.status(400).json({
      error:
        error instanceof multer.MulterError
          ? error.code === "LIMIT_FILE_SIZE"
            ? `File exceeds ${maxMB} MB upload limit.`
            : "Upload must contain one file and one platform."
          : "Unable to process request.",
    }),
);
const root = path.resolve(import.meta.dirname, "..");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(root, "dist")));
  app.get("*", (_req, res) => res.sendFile(path.join(root, "dist/index.html")));
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}
const port = Number(process.env.PORT || 3000);
app.listen(port, process.env.HOST || "127.0.0.1", () =>
  console.info(`AgentTrap running at http://localhost:${port}`),
);
