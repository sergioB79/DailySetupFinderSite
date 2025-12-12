import { Section, Snapshot } from "./parser";

export interface SectionDiff {
  id: Section["id"];
  title: string;
  added: string[];
  removed: string[];
  unchanged: string[];
}

export interface SnapshotDiff {
  asOf: string;
  comparedTo?: string;
  sections: SectionDiff[];
}

function toSet(items: string[]): Set<string> {
  return new Set(items.map((i) => i.trim()));
}

export function diffSnapshots(prev: Snapshot | null, next: Snapshot): SnapshotDiff | null {
  if (!prev) return null;

  const prevMap = new Map(prev.sections.map((s) => [s.id, s]));
  const nextMap = new Map(next.sections.map((s) => [s.id, s]));

  const allIds = new Set([...prevMap.keys(), ...nextMap.keys()]);

  const sections: SectionDiff[] = [];

  for (const id of allIds) {
    const prevSection = prevMap.get(id);
    const nextSection = nextMap.get(id);

    if (!nextSection) {
      sections.push({
        id: id as Section["id"],
        title: prevSection?.title ?? id,
        added: [],
        removed: prevSection?.items ?? [],
        unchanged: [],
      });
      continue;
    }

    if (!prevSection) {
      sections.push({
        id: id as Section["id"],
        title: nextSection.title,
        added: nextSection.items,
        removed: [],
        unchanged: [],
      });
      continue;
    }

    const prevSet = toSet(prevSection.items);
    const nextSet = toSet(nextSection.items);

    const added: string[] = [];
    const removed: string[] = [];
    const unchanged: string[] = [];

    nextSection.items.forEach((item) => {
      if (prevSet.has(item.trim())) {
        unchanged.push(item);
      } else {
        added.push(item);
      }
    });

    prevSection.items.forEach((item) => {
      if (!nextSet.has(item.trim())) {
        removed.push(item);
      }
    });

    sections.push({
      id: id as Section["id"],
      title: nextSection.title,
      added,
      removed,
      unchanged,
    });
  }

  return {
    asOf: next.asOf,
    comparedTo: prev.asOf,
    sections,
  };
}
