import { describe, expect, it } from "vitest";
import { CYLINDERS } from "@/lib/site";

describe("sizes from the supplied Liquigás photo", () => {
  it("includes precisely the four pictured cylinder sizes and weights", () => {
    expect(CYLINDERS).toEqual([
      { model: "P-8", kg: 8 },
      { model: "P-13", kg: 13 },
      { model: "P-20", kg: 20 },
      { model: "P-45", kg: 45 },
    ]);
  });
});