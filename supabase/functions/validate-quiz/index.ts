import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit: 10 requests per minute
  const rl = checkRateLimit(req, 10, 60);
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, ...rl.headers, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Check subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("license_expires_at")
      .eq("user_id", userId)
      .single();

    if (!profile?.license_expires_at || new Date(profile.license_expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "Subscription expired" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { module_id, section_index, answers } = await req.json();
    if (!module_id || section_index === undefined || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: "module_id, section_index, and answers[] required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch module content using service role
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: moduleData, error: moduleError } = await adminClient
      .from("module_content")
      .select("sections")
      .eq("module_id", module_id)
      .single();

    if (moduleError || !moduleData) {
      return new Response(JSON.stringify({ error: "Module not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sections = moduleData.sections as any[];
    if (section_index < 0 || section_index >= sections.length) {
      return new Response(JSON.stringify({ error: "Invalid section_index" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const quiz = sections[section_index].quiz;
    if (!quiz || !Array.isArray(quiz)) {
      return new Response(JSON.stringify({ error: "No quiz found for this section" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate answers
    const results = quiz.map((q: any, i: number) => ({
      correct: answers[i] === q.correctIndex,
    }));

    const allCorrect = results.every((r: any) => r.correct);

    return new Response(
      JSON.stringify({ correct: allCorrect, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
