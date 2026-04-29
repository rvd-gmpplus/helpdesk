import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

beforeAll(async () => {
  const src = fs.readFileSync(path.join(__dirname, "data.jsx"), "utf8");
  // eslint-disable-next-line no-new-func
  new Function(src)();
});

describe("data model invariants", () => {
  it("every MATRIX key is a valid SEGMENTS id", () => {
    const ids = new Set(globalThis.SEGMENTS.map(s => s.id));
    for (const key of Object.keys(globalThis.MATRIX)) {
      expect(ids.has(key)).toBe(true);
    }
  });

  it("every STAGES id has an entry in every lane's cells", () => {
    const stageIds = globalThis.STAGES.map(s => s.id);
    for (const lane of globalThis.LANES) {
      for (const id of stageIds) {
        expect(lane.cells, `lane ${lane.id} missing cells`).toBeDefined();
        expect(id in lane.cells, `lane ${lane.id} missing stage ${id}`).toBe(true);
      }
    }
  });

  it("URGENCIES are exactly critical / standard / info", () => {
    const ids = globalThis.URGENCIES.map(u => u.id).sort();
    expect(ids).toEqual(["critical", "info", "standard"]);
  });
});
