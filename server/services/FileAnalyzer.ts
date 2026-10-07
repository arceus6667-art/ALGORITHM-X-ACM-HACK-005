import sharp from "sharp";
import { createRequire } from "node:module";
import path from "node:path";
import exifr from "exifr";
import mammoth from "mammoth";
import yauzl from "yauzl";
import { execFile } from "node:child_process";
import type { FileSignals, Signal } from "../../shared/types";
export const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
  txt: "text/plain",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
export function validateFile(
  bytes: Buffer,
  name: string,
  mime: string,
  maxMB = 10,
) {
  if (/\.(mp4|mov|avi|webm|mkv)$/i.test(name) || mime.startsWith("video/"))
    throw new Error("Video analysis is not supported in this prototype.");
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (!MIME[ext] || (mime !== MIME[ext] && mime !== "application/octet-stream"))
    throw new Error("Unsupported file format or MIME type mismatch.");
  if (!bytes.length || bytes.length > maxMB * 1024 * 1024)
    throw new Error(`File must be nonempty and no larger than ${maxMB} MB.`);
  const signature =
    ext === "png"
      ? bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : ["jpg", "jpeg"].includes(ext)
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : ext === "webp"
          ? bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
          : ext === "pdf"
            ? bytes.toString("ascii", 0, 5) === "%PDF-"
            : ext === "docx"
              ? bytes.toString("ascii", 0, 2) === "PK"
              : !bytes.includes(0);
  if (!signature)
    throw new Error("File contents do not match the selected format.");
  if (ext === "txt") {
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new Error("TXT files must contain valid UTF-8 text.");
    }
  }
  return { ext, mime: MIME[ext] };
}
async function checkDocx(bytes: Buffer) {
  await new Promise<void>((resolve, reject) =>
    yauzl.fromBuffer(bytes, { lazyEntries: true }, (error, zip) => {
      if (error || !zip) return reject(new Error("Corrupt DOCX archive."));
      let total = 0,
        count = 0,
        document = false;
      zip.on("error", reject);
      zip.on("end", () =>
        document
          ? resolve()
          : reject(new Error("Archive is not a DOCX document.")),
      );
      zip.on("entry", (entry) => {
        total += entry.uncompressedSize;
        count++;
        document ||= entry.fileName === "word/document.xml";
        if (
          total > 32 * 1024 * 1024 ||
          count > 1000 ||
          entry.generalPurposeBitFlag & 1
        ) {
          zip.close();
          reject(
            new Error(
              "DOCX archive exceeds safe parsing limits or is encrypted.",
            ),
          );
        } else zip.readEntry();
      });
      zip.readEntry();
    }),
  );
}
async function localOCR(bytes: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = execFile(
      "tesseract",
      ["stdin", "stdout", "-l", "eng", "--psm", "11"],
      { timeout: 8000, maxBuffer: 2 * 1024 * 1024 },
      (error, stdout) =>
        error
          ? reject(new Error("Local OCR unavailable or timed out."))
          : resolve(stdout),
    );
    child.stdin?.on("error", () => {});
    child.stdin?.end(bytes);
  });
}
export function textSignals(text: string, method: string): Signal[] {
  const patterns: Array<[string, string, RegExp, number]> = [
    [
      "email",
      "Email-like pattern",
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      0.95,
    ],
    [
      "phone",
      "Phone-like pattern",
      /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{3}\)?[\s-])?\d{3}[\s-]\d{4}\b|\b[6-9]\d{9}\b/g,
      0.7,
    ],
    [
      "name",
      "Labelled person name",
      /\b(?:name|employee|patient|student)\s*:\s*[A-Z][a-z]+\s+[A-Z][a-z]+/g,
      0.7,
    ],
    ["address", "Labelled address", /\baddress\s*:\s*\S[^\n]{5,}/gi, 0.7],
    [
      "identity",
      "Identity-number indicator",
      /\b(?:passport|aadhaar|pan|identity|employee\s*id|student\s*id)\s*(?:number|no\.?)?\s*[:#-]\s*[A-Z0-9 -]{4,}/gi,
      0.75,
    ],
    [
      "financial",
      "Financial indicator",
      /\b(?:bank account|credit card|revenue|salary|invoice|financial|IBAN)\b/gi,
      0.65,
    ],
    [
      "secret",
      "Credential / secret indicator",
      /\b(?:api[_ -]?key|password|secret|access[_ -]?token)\s*[:=]\s*\S+|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gi,
      0.85,
    ],
    [
      "confidential",
      "Confidential-business indicator",
      /\b(?:confidential|internal only|trade secret|proprietary|not for distribution)\b/gi,
      0.75,
    ],
    [
      "health",
      "Health-record indicator",
      /\b(?:diagnosis|medical record|patient|prescription)\b/gi,
      0.65,
    ],
    [
      "organization",
      "Labelled organization",
      /\b(?:company|organization|institution|university)\s*:\s*\S[^\n]{2,}/gi,
      0.7,
    ],
  ];
  return patterns.flatMap(([id, label, re, confidence]) => {
    const count = Array.from(text.matchAll(re)).length;
    return count
      ? [
          {
            id,
            label,
            count,
            confidence: method.includes("OCR")
              ? Math.min(confidence, 0.65)
              : confidence,
            method,
            evidenceType: "FILE-DERIVED" as const,
          },
        ]
      : [];
  });
}
export async function analyzeFile(
  bytes: Buffer,
  name: string,
  mime: string,
): Promise<FileSignals> {
  const { ext, mime: actualMime } = validateFile(bytes, name, mime);
  const out: FileSignals = {
    fileType: ext,
    mimeType: actualMime,
    fileSize: bytes.length,
    metadata: [],
    extractedSignals: [],
    semanticRichnessScore: 0,
    coverage: ["Format, size and signature validation"],
    limitations: [],
    blank: false,
  };
  const add = (id: string, label: string, method: string) =>
    out.extractedSignals.push({
      id,
      label,
      count: 1,
      confidence: 1,
      method,
      evidenceType: "FILE-DERIVED",
    });
  let text = "",
    method = "UTF-8 parser";
  if (actualMime.startsWith("image/")) {
    const image = sharp(bytes, {
      limitInputPixels: 20_000_000,
      animated: false,
    });
    const metadata = await image.metadata();
    out.metadata.push(`Dimensions: ${metadata.width} × ${metadata.height}`);
    out.coverage.push("Decoded pixels, EXIF metadata, English local OCR");
    const { data, info } = await image
      .clone()
      .resize(128, 128, { fit: "inside" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    // Variation is measured independently per channel: solid red is also blank.
    let variation = 0;
    for (let c = 0; c < info.channels; c++) {
      let min = 255,
        max = 0;
      for (let i = c; i < data.length; i += info.channels) {
        min = Math.min(min, data[i]);
        max = Math.max(max, data[i]);
      }
      variation = Math.max(variation, max - min);
    }
    out.blank = variation <= 2;
    out.semanticRichnessScore = out.blank
      ? 0
      : Math.round((variation / 255) * 25);
    try {
      const tags = await exifr.parse(bytes, { gps: true });
      if (tags) {
        if (tags.latitude !== undefined || tags.GPSLatitude !== undefined)
          add("gps", "GPS metadata present", "EXIF parser");
        if (tags.Make || tags.Model || tags.SerialNumber)
          add("device", "Device metadata present", "EXIF parser");
        if (tags.DateTimeOriginal || tags.CreateDate || tags.ModifyDate)
          add("timestamp", "Timestamp metadata present", "EXIF parser");
      }
    } catch {
      out.limitations.push(
        "EXIF parsing failed; absence of metadata cannot be established.",
      );
    }
    if (!out.blank) {
      try {
        text = await localOCR(
          await image
            .clone()
            .rotate()
            .resize({
              width: 1600,
              height: 1600,
              fit: "inside",
              withoutEnlargement: true,
            })
            .png()
            .toBuffer(),
        );
        method = "Local Tesseract English OCR + regex";
      } catch {
        out.limitations.push(
          "Local OCR unavailable or timed out; visible text was not assessed.",
        );
      }
    }
    out.limitations.push(
      "Faces, logos, objects, badges and scene locations are not classified in this prototype. Pixel uniformity is not proof of the absence of identifiers.",
    );
  } else if (ext === "txt")
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  else if (ext === "docx") {
    await checkDocx(bytes);
    text = (await mammoth.extractRawText({ buffer: bytes })).value;
    method = "DOCX text parser + regex";
    out.coverage.push("DOCX paragraph text");
    out.limitations.push(
      "Embedded DOCX images, headers and metadata are not assessed.",
    );
  } else {
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const task = getDocument({
      data: new Uint8Array(bytes),
      disableFontFace: true,
      useSystemFonts: false,
      standardFontDataUrl:
        path.join(
          path.dirname(
            createRequire(import.meta.url).resolve("pdfjs-dist/package.json"),
          ),
          "standard_fonts",
        ) + path.sep,
    });
    try {
      const pdf = await task.promise;
      const meta = await pdf.getMetadata();
      if ((meta.info as any)?.Author)
        add("author", "PDF author metadata present", "PDF metadata parser");
      if ((meta.info as any)?.CreationDate || (meta.info as any)?.ModDate)
        add(
          "timestamp",
          "PDF timestamp metadata present",
          "PDF metadata parser",
        );
      for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text +=
          content.items.map((item: any) => item.str || "").join(" ") + "\n";
        if (text.length > 2_000_000)
          throw new Error("Document exceeds extracted-text limit.");
      }
      if (pdf.numPages > 30)
        out.limitations.push("Only the first 30 PDF pages were analyzed.");
    } finally {
      await task.destroy();
    }
    method = "PDF text parser + regex";
    out.coverage.push("PDF text layer and author/timestamp presence");
    out.limitations.push(
      "Scanned PDF pages and embedded images are not OCR processed.",
    );
  }
  if (text.length > 2_000_000)
    throw new Error("Document exceeds extracted-text limit.");
  out.extractedSignals.push(...textSignals(text, method));
  out.semanticRichnessScore = Math.min(
    100,
    out.semanticRichnessScore +
      Math.min(35, Math.round(text.trim().length / 40)) +
      out.extractedSignals.length * 7,
  );
  if (!text.trim() && !actualMime.startsWith("image/"))
    out.limitations.push(
      "No readable text was extracted; this is not proof that the file contains no sensitive data.",
    );
  out.coverage.push(
    "Heuristic text patterns; matched values are excluded from the report",
  );
  out.limitations.push(
    "Pattern detection can miss identifiers and produce false positives; no full named-entity recognition is implemented.",
  );
  return out;
}
