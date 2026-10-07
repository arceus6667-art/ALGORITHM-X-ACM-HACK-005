import { analyzeFile } from "./services/FileAnalyzer";
process.once(
  "message",
  async (input: { bytes: Buffer; name: string; mime: string }) => {
    try {
      const result = await analyzeFile(input.bytes, input.name, input.mime);
      process.send?.({ result }, () => process.exit(0));
    } catch {
      process.send?.(
        {
          error:
            "File could not be parsed safely. It may be corrupt, encrypted, too complex or exceed parser limits.",
        },
        () => process.exit(0),
      );
    }
  },
);
