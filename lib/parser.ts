import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import { z } from "zod";

export type SectionId =
  | "snapshot"
  | "key-forces"
  | "fx-implications"
  | "risk-radar"
  | "what-to-watch";

export interface Section {
  id: SectionId;
  title: string;
  items: string[];
}

export interface Snapshot {
  asOf: string; // YYYY-MM-DD
  location?: string;
  title: string;
  sections: Section[];
  rawMarkdown: string;
  sourceFileName: string;
}

export const snapshotSchema = z.object({
  asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().optional(),
  title: z.string().min(1),
  sections: z.array(
    z.object({
      id: z.enum(["snapshot", "key-forces", "fx-implications", "risk-radar", "what-to-watch"]),
      title: z.string(),
      items: z.array(z.string().min(1)),
    }),
  ),
  rawMarkdown: z.string(),
  sourceFileName: z.string(),
});

type Heading = {
  depth: number;
  value: string;
};

const sectionTitleToId: Record<string, SectionId> = {
  snapshot: "snapshot",
  "macro regime snapshot": "snapshot",
  "executive snapshot": "snapshot",
  "key forces": "key-forces",
  "fx implications": "fx-implications",
  "risk radar": "risk-radar",
  "what to watch next": "what-to-watch",
  "what to watch": "what-to-watch",
};

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

function extractMetaFromHeading(text: string): { title: string; asOf?: string; location?: string } {
  const title = text.trim();
  const dateMatch = title.match(/(\d{4}-\d{2}-\d{2})/);
  const locationMatch = title.match(/\(([^)]+)\)\s*$/);
  return {
    title,
    asOf: dateMatch?.[1],
    location: locationMatch?.[1],
  };
}

function extractDateFromFilename(name: string): string | undefined {
  const match = name.match(/(\d{4}-\d{2}-\d{2})/);
  return match?.[1];
}

function extractFirstNonEmptyLine(markdown: string): string | undefined {
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return undefined;
}

function extractDateFromText(markdown: string): string | undefined {
  // Look for YYYY-MM-DD first
  const isoMatch = markdown.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  // Look for "December 12, 2025" style dates
  const longDateMatch = markdown.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})/i,
  );
  if (longDateMatch) {
    const month = longDateMatch[1];
    const day = longDateMatch[2].padStart(2, "0");
    const year = longDateMatch[3];
    const monthIndex = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ].indexOf(month.toLowerCase());
    if (monthIndex >= 0) {
      const monthNum = String(monthIndex + 1).padStart(2, "0");
      return `${year}-${monthNum}-${day}`;
    }
  }
  return undefined;
}

export async function parseMarkdownToSnapshot(markdown: string, sourceFileName: string): Promise<Snapshot> {
  const tree = unified().use(remarkParse).parse(markdown);

  const headings: Heading[] = [];
  visit(tree, "heading", (node: any) => {
    const text = node.children
      ?.filter((c: any) => c.type === "text" || c.type === "inlineCode")
      ?.map((c: any) => c.value)
      ?.join(" ")
      ?.trim();
    if (text) headings.push({ depth: node.depth, value: text });
  });

  const topHeading = headings.find((h) => h.depth === 1) ?? null;
  const firstLine = extractFirstNonEmptyLine(markdown);
  const meta = topHeading
    ? extractMetaFromHeading(topHeading.value)
    : firstLine
      ? extractMetaFromHeading(firstLine)
      : { title: "Daily Macro Brief" };

  const sections: Section[] = [];
  const sectionBuffer: { heading: Heading; items: string[] }[] = [];

  // Collect headings depth 2/3 and their following lists
  visit(tree, (node: any) => {
    if (node.type === "heading" && node.depth >= 2 && node.depth <= 3) {
      const text = node.children
        ?.filter((c: any) => c.type === "text" || c.type === "inlineCode")
        ?.map((c: any) => c.value)
        ?.join(" ")
        ?.trim();
      if (text) {
        sectionBuffer.push({ heading: { depth: node.depth, value: text }, items: [] });
      }
    }
    if (node.type === "list" && sectionBuffer.length > 0) {
      const current = sectionBuffer[sectionBuffer.length - 1];
      const items: string[] = [];
      node.children?.forEach((item: any) => {
        const text = item.children
          ?.filter((c: any) => c.type === "paragraph" || c.type === "text")
          ?.map((c: any) => {
            if (c.type === "paragraph" && c.children) {
              return c.children
                .filter((cc: any) => cc.type === "text" || cc.type === "inlineCode")
                .map((cc: any) => cc.value)
                .join(" ");
            }
            return c.value;
          })
          ?.join(" ")
          ?.trim();
        if (text) items.push(text);
      });
      if (items.length) current.items.push(...items);
    }
  });

  for (const section of sectionBuffer) {
    const key = normalizeHeading(section.heading.value);
    const matchedId = sectionTitleToId[key];
    if (!matchedId) continue;
    sections.push({
      id: matchedId,
      title: section.heading.value.trim(),
      items: section.items,
    });
  }

  const asOf =
    meta.asOf ??
    extractDateFromText(markdown) ??
    extractDateFromFilename(sourceFileName) ??
    new Date().toISOString().slice(0, 10);

  const parsed: Snapshot = {
    asOf,
    location: meta.location,
    title: meta.title,
    sections,
    rawMarkdown: markdown,
    sourceFileName,
  };

  return snapshotSchema.parse(parsed);
}
