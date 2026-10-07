import { test } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import JSZip from "jszip";
import { analyzeFile, validateFile } from "../server/services/FileAnalyzer";
import { calculateRisk } from "../server/services/RiskEngine";
import {
  platforms,
  retrievePolicyEvidence,
} from "../server/services/PolicyRetriever";
import { JevDecisionProvider } from "../server/services/DecisionProvider";
import { buildReport } from "../server/services/AnalysisService";
const txtMime = "text/plain";
const other = platforms.find((p) => p.id === "other")!;
test("real text, independent of filename, changes detections and risk", async () => {
  const safe = await analyzeFile(
    Buffer.from("hello world"),
    "secret-id-card.txt",
    txtMime,
  );
  const privateFile = await analyzeFile(
    Buffer.from(
      "Name: Alex Example\nEmail: alex@example.com\nEmployee ID: ABC123\nAPI_KEY=demo-only\nConfidential\nRevenue: 1000",
    ),
    "blank.txt",
    txtMime,
  );
  assert.equal(safe.extractedSignals.length, 0);
  assert(privateFile.extractedSignals.some((s) => s.id === "email"));
  assert(
    calculateRisk(privateFile, other).riskScore >
      calculateRisk(safe, other).riskScore,
  );
  assert(!JSON.stringify(privateFile).includes("alex@example.com"));
  assert(!JSON.stringify(privateFile).includes("demo-only"));
  assert.deepEqual(
    calculateRisk(privateFile, other),
    calculateRisk(privateFile, other),
  );
});
test("uniform black and red images have low content richness, baseline policy may add risk", async () => {
  for (const background of ["black", "red"]) {
    const bytes = await sharp({
      create: { width: 50, height: 50, channels: 3, background },
    })
      .png()
      .toBuffer();
    const f = await analyzeFile(bytes, "portrait-id.png", "image/png");
    assert(f.blank);
    assert.equal(f.semanticRichnessScore, 0);
    assert.equal(calculateRisk(f, other).riskScore, 0);
    assert(
      calculateRisk(f, platforms.find((p) => p.id === "chatgpt")!).riskScore >
        0,
    );
  }
});
test("metadata-rich image detects actual EXIF and increases score", async () => {
  const blank = await sharp({
    create: { width: 40, height: 40, channels: 3, background: "black" },
  })
    .jpeg()
    .toBuffer();
  const rich = await sharp(blank)
    .withExif({
      IFD0: { Make: "Example", Model: "Demo Camera" },
      IFD3: {
        GPSLatitudeRef: "N",
        GPSLatitude: "19/1 0/1 0/1",
        GPSLongitudeRef: "E",
        GPSLongitude: "72/1 0/1 0/1",
      },
    })
    .jpeg()
    .toBuffer();
  const a = await analyzeFile(blank, "a.jpg", "image/jpeg"),
    b = await analyzeFile(rich, "b.jpg", "image/jpeg");
  assert(b.extractedSignals.some((s) => s.id === "gps"));
  assert(b.extractedSignals.some((s) => s.id === "device"));
  assert(calculateRisk(b, other).riskScore > calculateRisk(a, other).riskScore);
});
test("supported signatures, MIME mismatch, video and size validation", () => {
  assert.throws(
    () => validateFile(Buffer.from("hello"), "x.mp4", "video/mp4"),
    /Video analysis/,
  );
  assert.throws(
    () => validateFile(Buffer.from("hello"), "x.png", "image/png"),
    /contents/,
  );
  assert.throws(
    () => validateFile(Buffer.from("hello"), "x.txt", "application/pdf"),
    /MIME/,
  );
  assert.throws(
    () => validateFile(Buffer.from([255, 254]), "x.txt", "text/plain"),
    /UTF-8/,
  );
  assert.throws(
    () => validateFile(Buffer.alloc(1025 * 1024, 1), "x.txt", "text/plain", 1),
    /larger/,
  );
});
test("policy registry is unique, official, dated; missing evidence stays unknown", async () => {
  assert.equal(new Set(platforms.map((p) => p.id)).size, platforms.length);
  for (const p of platforms)
    for (const f of p.facts) {
      assert.equal(f.evidenceType, "DOCUMENTED");
      assert.equal(f.retrievedAt, "2026-10-07");
      assert(p.officialSources.includes(f.sourceUrl));
      assert(new URL(f.sourceUrl).protocol === "https:");
    }
  const file = await analyzeFile(
    Buffer.from("Email: alex@example.com"),
    "a.txt",
    txtMime,
  );
  const report = await buildReport(file, other);
  assert.equal(report.sources.length, 0);
  assert(report.unknown.some((s) => s.includes("not documented")));
  assert(
    report.factors
      .filter((f) => f.evidenceType === "UNKNOWN")
      .every((f) => f.points === 0),
  );
  assert.equal(
    report.riskScore,
    report.factors.reduce((n, f) => n + f.points, 0),
  );
  assert(
    retrievePolicyEvidence(platforms.find((p) => p.id === "chatgpt")!, file)
      .length > 0,
  );
});
test("DOCX extracts actual paragraph text and rejects plain zip", async () => {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>',
  );
  zip.file(
    "word/document.xml",
    '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Email: alex@example.com</w:t></w:r></w:p></w:body></w:document>',
  );
  const f = await analyzeFile(
    await zip.generateAsync({ type: "nodebuffer" }),
    "a.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  assert(f.extractedSignals.some((s) => s.id === "email"));
  const invalid = new JSZip();
  invalid.file("a.txt", "hello");
  await assert.rejects(
    analyzeFile(
      await invalid.generateAsync({ type: "nodebuffer" }),
      "b.docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ),
  );
});
test("Jev unavailable or failing uses deterministic fallback", async () => {
  assert.equal(
    (await new JevDecisionProvider().evaluate()).provider,
    "Deterministic fallback",
  );
  assert.equal(
    (
      await new JevDecisionProvider({
        async evaluate() {
          throw Error("offline");
        },
      }).evaluate()
    ).provider,
    "Deterministic fallback",
  );
});
test("actual OCR reads image text rather than guessing from filename", async () => {
  const svg = Buffer.from(
    '<svg width="1000" height="160" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="30" y="90" font-size="48" font-family="DejaVu Sans" fill="black">Email: alex@example.com</text></svg>',
  );
  const bytes = await sharp(svg).png().toBuffer();
  const file = await analyzeFile(bytes, "blank.png", "image/png");
  assert(file.extractedSignals.some((s) => s.id === "email"));
  assert(!file.blank);
  assert(file.semanticRichnessScore > 0);
});
test("PDF reads actual text layer and reports author presence", async () => {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  pdf.setAuthor("Private Person");
  pdf.addPage().drawText("Email: alex@example.com");
  const f = await analyzeFile(
    Buffer.from(await pdf.save()),
    "blank.pdf",
    "application/pdf",
  );
  assert(f.extractedSignals.some((s) => s.id === "email"));
  assert(f.extractedSignals.some((s) => s.id === "author"));
  assert(!JSON.stringify(f).includes("Private Person"));
});
test("documented advertising exception contributes zero without being mislabelled unknown", async () => {
  const f = await analyzeFile(Buffer.from("Hello"), "a.txt", "text/plain");
  const p = platforms.find((p) => p.id === "google-drive")!;
  const factor = calculateRisk(f, p).factors.find(
    (f) => f.key === "personalization",
  )!;
  assert.equal(factor.points, 0);
  assert.equal(factor.evidenceType, "DOCUMENTED");
  assert(factor.evidenceIds.includes("google-drive-advertisingUse"));
});
