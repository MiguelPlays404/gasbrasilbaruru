import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { reviewInputSchema, sanitizeText } from "./reviews.schema";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getPublicReviews = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [reviews, stats, settings] = await Promise.all([
    sb.from("reviews").select("id, display_name, rating, comment, created_at").eq("status", "approved").order("created_at", { ascending: false }).limit(30),
    sb.from("review_stats").select("*").maybeSingle(),
    sb.from("site_settings").select("key, value"),
  ]);
  const map = Object.fromEntries((settings.data ?? []).map((s) => [s.key, s.value]));
  return {
    reviews: reviews.data ?? [],
    stats: stats.data ?? { total: 0, average: 0, r1: 0, r2: 0, r3: 0, r4: 0, r5: 0 },
    googleReviewUrl: (map["GOOGLE_REVIEW_URL"] as string | null) || null,
    publicEnabled: map["REVIEWS_PUBLIC_ENABLED"] !== "false",
  };
});

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reviewInputSchema.extend({ website: z.string().max(200).optional() }).parse(data))
  .handler(async ({ data }) => {
    // Honeypot: bots fill the hidden field; pretend success
    if (data.website) return { ok: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ua = getRequestHeader("user-agent") || "";
    const hash = await sha256(`gasbrasil:${ip}:${ua}`);

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin.from("review_submissions").select("id", { count: "exact", head: true }).eq("submitter_hash", hash).gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return { ok: false as const, error: "Você já enviou avaliações recentemente. Tente novamente mais tarde." };
    }

    const { error } = await supabaseAdmin.from("reviews").insert({
      display_name: sanitizeText(data.display_name),
      rating: data.rating,
      comment: sanitizeText(data.comment),
      consent_to_publish: true,
      status: "pending",
    });
    if (error) {
      console.error("review insert failed", error);
      return { ok: false as const, error: "Não foi possível enviar sua avaliação agora. Tente novamente." };
    }
    await supabaseAdmin.from("review_submissions").insert({ submitter_hash: hash });
    // prune old rate-limit rows
    await supabaseAdmin.from("review_submissions").delete().lt("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString());
    return { ok: true as const };
  });
