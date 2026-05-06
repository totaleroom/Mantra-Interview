import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { checkRateLimit } from "../_shared/rate-limit.ts";

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  // Rate limit: 3 requests per minute
  const rl = checkRateLimit(req, 3, 60);
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...cors, ...rl.headers, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify caller identity
    const { data: { user: caller }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Verify caller is admin
    const { data: adminRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!adminRole) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Get one available license key
    const { data: keyData, error: keyError } = await supabaseAdmin
      .from("license_keys")
      .select("*")
      .eq("status", "active")
      .is("used_by", null)
      .limit(1)
      .single();

    if (keyError || !keyData) {
      return new Response(JSON.stringify({ error: "Tidak ada license key tersedia. Generate lebih banyak key terlebih dahulu." }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + keyData.validity_days);

    // Update key to used
    const { error: updateKeyError } = await supabaseAdmin
      .from("license_keys")
      .update({ status: "used", used_by: user_id })
      .eq("id", keyData.id)
      .eq("status", "active"); // Optimistic lock

    if (updateKeyError) {
      return new Response(JSON.stringify({ error: "Gagal mengupdate license key" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Update user profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        license_key: keyData.key,
        license_expires_at: expiresAt.toISOString(),
      })
      .eq("user_id", user_id);

    if (profileError) {
      // Rollback the key
      await supabaseAdmin
        .from("license_keys")
        .update({ status: "active", used_by: null })
        .eq("id", keyData.id);

      return new Response(JSON.stringify({ error: "Gagal mengupdate profil user" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        key: keyData.key,
        expires_at: expiresAt.toISOString(),
        validity_days: keyData.validity_days,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
