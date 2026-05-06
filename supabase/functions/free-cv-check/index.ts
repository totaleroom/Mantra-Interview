import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  // Rate limit: 3 requests per day per IP
  const { allowed, headers: rlHeaders } = checkRateLimit(req, 3, 86400);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Coba lagi besok atau upgrade ke MantraSkill." }),
      { status: 429, headers: { ...cors, ...rlHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { cv_text } = await req.json();
    if (!cv_text || typeof cv_text !== "string" || cv_text.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "CV text terlalu pendek" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Trim to max 2000 words
    const trimmed = cv_text.split(/\s+/).slice(0, 2000).join(" ");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI not configured" }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `Kamu adalah AI ATS CV reviewer Indonesia. Analisis CV berikut dan berikan TEPAT 3 insight singkat dalam bahasa Indonesia. Setiap insight harus actionable dan spesifik berdasarkan isi CV.

Format output: JSON array dengan 3 string.
Contoh: ["Insight 1...", "Insight 2...", "Insight 3..."]

Aturan:
- Insight 1: Kekuatan utama CV ini
- Insight 2: Kelemahan paling kritis yang harus diperbaiki
- Insight 3: Satu saran spesifik untuk meningkatkan skor ATS
- Setiap insight max 2 kalimat
- Langsung ke poin, tidak perlu pengantar`
          },
          { role: "user", content: trimmed }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_insights",
              description: "Return 3 CV insights",
              parameters: {
                type: "object",
                properties: {
                  insights: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3
                  }
                },
                required: ["insights"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_insights" } }
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI rate limited, coba lagi nanti." }),
          { status: 429, headers: { ...cors, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service unavailable." }),
          { status: 402, headers: { ...cors, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let insights: string[] = [];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        insights = parsed.insights || [];
      } catch {
        // Fallback: try parsing content directly
        const content = data.choices?.[0]?.message?.content || "[]";
        try { insights = JSON.parse(content); } catch { insights = []; }
      }
    }

    // Ensure exactly 3 insights
    while (insights.length < 3) {
      insights.push("Upgrade ke MantraSkill untuk analisis AI lengkap.");
    }
    insights = insights.slice(0, 3);

    return new Response(
      JSON.stringify({ insights }),
      { status: 200, headers: { ...cors, ...rlHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("free-cv-check error:", e);
    const isTimeout = e instanceof DOMException && e.name === "AbortError";
    return new Response(
      JSON.stringify({ error: isTimeout ? "Analysis timeout" : "Internal error" }),
      { status: isTimeout ? 504 : 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
