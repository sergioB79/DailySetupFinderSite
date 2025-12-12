import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseMarkdownToSnapshot } from "../lib/parser";

describe("parseMarkdownToSnapshot", () => {
  it("parses the fixture into normalized JSON", async () => {
    const fixturePath = path.join(__dirname, "..", "fixtures", "latest.md");
    const markdown = await readFile(fixturePath, "utf-8");
    const parsed = await parseMarkdownToSnapshot(markdown, "daily_macro_briefs_2025-12-12.md");

    expect(parsed.asOf).toBe("2025-12-12");
    expect(parsed.title.toLowerCase()).toContain("macro regime snapshot");
    expect(parsed.sections.length).toBeGreaterThanOrEqual(5);

    const snapshotSection = parsed.sections.find((s) => s.id === "snapshot");
    expect(snapshotSection?.items.length).toBeGreaterThanOrEqual(1);
  });
});
