import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, areaMismatch, compatibilityWarnings } from "@/lib/config";
import { calculate } from "@/lib/estimate";

describe("estimate", () => {
  it("line cost = quantity × unit price", () => {
    const e = calculate(DEFAULT_CONFIG);
    for (const l of e.lines) if (l.price != null) expect(l.cost).toBe(Math.round(l.quantity * l.price));
  });

  it("unpriced items stay null, not zero, and are counted", () => {
    const e = calculate({ ...DEFAULT_CONFIG, foundation: "consult" });
    const f = e.lines.find((l) => l.id === "F-09");
    expect(f?.cost).toBeNull();
    expect(e.totals.unpriced).toBeGreaterThanOrEqual(1);
  });

  it("warm contour excludes finishing and engineering", () => {
    const e = calculate(DEFAULT_CONFIG, "shell");
    expect(e.lines.some((l) => l.stage === "finish" || l.stage === "engineering")).toBe(false);
    expect(e.totals.engineering).toBe(0);
  });

  it("packages grow: shell < finish < living", () => {
    const a = calculate(DEFAULT_CONFIG, "shell").totals.total;
    const b = calculate(DEFAULT_CONFIG, "finish").totals.total;
    const c = calculate(DEFAULT_CONFIG, "living").totals.total;
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });

  it("no item is counted twice", () => {
    const ids = calculate(DEFAULT_CONFIG).lines.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("warns when area disagrees with dimensions by more than 10%", () => {
    expect(areaMismatch({ area: 100, length: 8, width: 8, floors: 1 })).toBeGreaterThan(0.1);
    expect(compatibilityWarnings({ ...DEFAULT_CONFIG, area: 120 }).length).toBeGreaterThan(0);
  });

  it("living package without heating is flagged as not ready", () => {
    const w = compatibilityWarnings({ ...DEFAULT_CONFIG, heating: "none" });
    expect(w.some((s) => s.includes("готовым для проживания"))).toBe(true);
  });
});
