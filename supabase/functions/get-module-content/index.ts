import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit: 20 requests per minute
  const rl = checkRateLimit(req, 20, 60);
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

    // Get module_id from query params
    const url = new URL(req.url);
    const moduleId = url.searchParams.get("module_id");
    if (!moduleId) {
      return new Response(JSON.stringify({ error: "module_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch module content using service role to bypass RLS
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: moduleData, error: moduleError } = await adminClient
      .from("module_content")
      .select("*")
      .eq("module_id", moduleId)
      .single();

    if (moduleError || !moduleData) {
      return new Response(JSON.stringify({ error: "Module not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Strip correctIndex from quiz questions before sending to client
    const sanitizedSections = (moduleData.sections as any[]).map((section: any) => ({
      ...section,
      quiz: section.quiz.map((q: any) => ({
        question: q.question,
        options: q.options,
        // correctIndex is NOT included
      })),
    }));

    return new Response(
      JSON.stringify({
        id: moduleData.module_id,
        title: moduleData.title,
        thesis: moduleData.thesis,
        sections: sanitizedSections,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
