import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limit: 5 requests per minute
  const rl = checkRateLimit(req, 5, 60);
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, ...rl.headers, "Content-Type": "application/json" },
    });
  }

  try {
    // --- Auth check: extract and verify JWT ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ valid: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Use anon key client to verify the user's token
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ valid: false, error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { license_key, user_id } = await req.json();

    if (!license_key || !user_id) {
      return new Response(
        JSON.stringify({ valid: false, error: "Missing license key or user ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Anti-impersonation: ensure the user_id in request matches the authenticated user
    if (user.id !== user_id) {
      return new Response(
        JSON.stringify({ valid: false, error: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for DB operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if key exists and is active
    const { data: keyData, error: keyError } = await supabase
      .from("license_keys")
      .select("*")
      .eq("key", license_key.toUpperCase().trim())
      .eq("status", "active")
      .maybeSingle();

    if (keyError || !keyData) {
      return new Response(
        JSON.stringify({ valid: false, error: "License key tidak valid atau sudah digunakan" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark key as used
    await supabase
      .from("license_keys")
      .update({ status: "used", used_by: user_id })
      .eq("id", keyData.id);

    // Update profile with license info
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + keyData.validity_days);

    await supabase
      .from("profiles")
      .update({
        license_key: keyData.key,
        license_expires_at: expiresAt.toISOString(),
      })
      .eq("user_id", user_id);

    return new Response(
      JSON.stringify({ valid: true, expires_at: expiresAt.toISOString() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("validate-license error:", e);
    return new Response(
      JSON.stringify({ valid: false, error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
