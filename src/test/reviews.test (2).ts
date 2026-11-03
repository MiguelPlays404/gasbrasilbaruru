import { describe, expect, it } from "vitest";
import { reviewInputSchema, sanitizeText } from "@/lib/reviews.schema";

const base = { display_name: "Maria", rating: 5, comment: "Atendimento muito rápido!", consent_to_publish: true as const };

describe("review validation", () => {
  it("accepts a valid review", () => {
    expect(reviewInputSchema.safeParse(base).success).toBe(true);
  });
  it("rejects rating below 1", () => {
    expect(reviewInputSchema.safeParse({ ...base, rating: 0 }).success).toBe(false);
  });
  it("rejects rating above 5", () => {
    expect(reviewInputSchema.safeParse({ ...base, rating: 6 }).success).toBe(false);
  });
  it("rejects without publish consent", () => {
    expect(reviewInputSchema.safeParse({ ...base, consent_to_publish: false }).success).toBe(false);
  });
  it("strips html tags from comments", () => {
    expect(sanitizeText("<script>x</script>Ótimo")).toBe("xÓtimo");
  });
});
