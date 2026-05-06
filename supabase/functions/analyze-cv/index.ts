import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

function aiRequest(apiKey: string, messages: any[], tools?: any[], toolChoice?: any, model = "google/gemini-2.5-flash") {
  const body: any = {
    model,
    messages,
  };
  if (tools) { body.tools = tools; body.tool_choice = toolChoice; }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  return fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
}

function handleErrorResponse(response: Response, corsH: Record<string, string>) {
  if (response.status === 429) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded, coba lagi nanti." }), {
      status: 429, headers: { ...corsH, "Content-Type": "application/json" },
    });
  }
  if (response.status === 402) {
    return new Response(JSON.stringify({ error: "Credits habis, silakan top up." }), {
      status: 402, headers: { ...corsH, "Content-Type": "application/json" },
    });
  }
  return null;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // === AUTH + SUBSCRIPTION CHECK ===
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const sbUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await sbUser.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = { id: claimsData.claims.sub as string };

    const { data: profile } = await sbUser.from('profiles')
      .select('license_expires_at')
      .eq('user_id', user.id)
      .maybeSingle();

    const isActive = profile?.license_expires_at
      ? new Date(profile.license_expires_at) > new Date()
      : false;

    if (!isActive) {
      return new Response(JSON.stringify({ error: 'Subscription expired' }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { mode } = body;
    console.log("analyze-cv called with mode:", mode);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // === ENHANCE BULLET MODE ===
    if (mode === "enhance-bullet") {
      const { text, target_position } = body;
      // 💡 Fitur ringan → pakai Flash Lite (hemat ~80% biaya output)
      const response = await aiRequest(LOVABLE_API_KEY, [
        { role: "system", content: `Kamu adalah HR Expert. Tulis ulang bullet point CV ini menjadi lebih kuat, ATS-friendly, dan berorientasi achievement dengan angka/metrik. Target posisi: ${target_position || "umum"}. Kamu HARUS memanggil function "enhance_bullet".` },
        { role: "user", content: text },
      ], [{
        type: "function",
        function: {
          name: "enhance_bullet",
          description: "Return enhanced bullet point",
          parameters: {
            type: "object",
            properties: { enhanced: { type: "string", description: "Enhanced bullet point text" } },
            required: ["enhanced"],
          },
        },
      }], { type: "function", function: { name: "enhance_bullet" } }, "google/gemini-2.5-flash-lite");

      const errResp = handleErrorResponse(response, corsHeaders);
      if (errResp) return errResp;
      if (!response.ok) throw new Error("AI gateway error");

      const aiResult = await response.json();
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in AI response");
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === GENERATE SUMMARY MODE ===
    if (mode === "generate-summary") {
      const { cv_data } = body;
      // 💡 Fitur ringan → pakai Flash Lite (hemat ~80% biaya output)
      const response = await aiRequest(LOVABLE_API_KEY, [
        { role: "system", content: `Kamu adalah HR Expert. Buat professional summary 2-3 kalimat yang kuat dan targeted berdasarkan data CV berikut. Sebutkan role, tahun pengalaman, tech stack/skill utama, dan 1 achievement. Bahasa Indonesia. Kamu HARUS memanggil function "generate_summary".` },
        { role: "user", content: `Target Posisi: ${cv_data.target_position}\nPengalaman: ${cv_data.years_experience} tahun\nSkills: ${JSON.stringify(cv_data.skills)}\nPengalaman Kerja: ${JSON.stringify(cv_data.experiences)}` },
      ], [{
        type: "function",
        function: {
          name: "generate_summary",
          description: "Return generated professional summary",
          parameters: {
            type: "object",
            properties: { summary: { type: "string" } },
            required: ["summary"],
          },
        },
      }], { type: "function", function: { name: "generate_summary" } }, "google/gemini-2.5-flash-lite");

      const errResp = handleErrorResponse(response, corsHeaders);
      if (errResp) return errResp;
      if (!response.ok) throw new Error("AI gateway error");

      const aiResult = await response.json();
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in AI response");
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === REWRITE MODE ===
    if (mode === "rewrite") {
      const { cv_data } = body;
      const response = await aiRequest(LOVABLE_API_KEY, [
        { role: "system", content: `Kamu adalah HR Expert dan CV Writer profesional. Tulis ulang CV ini agar lebih kuat, ATS-friendly, dan berorientasi achievement.\n\nKamu HARUS memanggil function "rewrite_cv" dengan hasil rewrite-mu.\n\nRules:\n- Summary: tulis ulang jadi 2-3 kalimat yang kuat, spesifik, dan memorable\n- Experience descriptions: tulis ulang setiap deskripsi pengalaman dengan bullet points yang berorientasi achievement (gunakan angka/metrik)\n- Gunakan action verbs yang kuat\n- Bahasa: ikuti bahasa asli CV (jika Indonesia, tulis dalam Indonesia)` },
        { role: "user", content: `Target Posisi: ${cv_data.target_position}\nSummary saat ini: ${cv_data.summary}\nPengalaman:\n${JSON.stringify(cv_data.experiences)}` },
      ], [{
        type: "function",
        function: {
          name: "rewrite_cv",
          description: "Return rewritten CV summary and experience descriptions",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "Rewritten professional summary" },
              experiences: {
                type: "array",
                items: {
                  type: "object",
                  properties: { id: { type: "string" }, description: { type: "string" } },
                  required: ["id", "description"],
                },
              },
            },
            required: ["summary", "experiences"],
          },
        },
      }], { type: "function", function: { name: "rewrite_cv" } });

      const errResp = handleErrorResponse(response, corsHeaders);
      if (errResp) return errResp;
      if (!response.ok) throw new Error("AI gateway error");

      const aiResult = await response.json();
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in AI response");
      const rewrite = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ rewrite }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === JD SCAN MODE ===
    if (mode === "jd-scan") {
      const { cv_data, job_description } = body;
      const cvText = `
Target Position: ${cv_data.target_position}
Summary: ${cv_data.summary}
Experiences: ${cv_data.experiences.map((e: any) => `[EXP_ID:${e.id}] ${e.position} at ${e.company}: ${e.description}`).join('\n')}
Skills: ${cv_data.skills?.hard_skills?.join(', ')}
Education: ${cv_data.education?.map((ed: any) => `${ed.degree} ${ed.major} ${ed.institution}`).join(', ')}
Certifications: ${cv_data.certifications?.map((c: any) => c.name).join(', ')}
      `.trim();

      const response = await aiRequest(LOVABLE_API_KEY, [
        { role: "system", content: `Kamu adalah ATS specialist. Bandingkan CV dengan job description dan identifikasi keyword match.

PENTING: Selain analisis keyword, kamu HARUS memberikan "improvements" — yaitu concrete rewrite untuk bagian CV yang perlu diperbaiki agar lebih cocok dengan JD.

Untuk setiap missing keyword yang bisa ditambahkan, buat improvement berisi:
- target: "summary" atau "experience" atau "skills"
- experience_id: ID pengalaman (hanya jika target = "experience", ambil dari [EXP_ID:xxx])
- original: teks asli dari CV
- improved: teks yang sudah diperbaiki/ditambahkan keyword dari JD (jangan mengubah secara agresif, cukup sisipkan keyword yang relevan secara natural)
- reason: alasan singkat perubahan

Panggil function "jd_scan_result".` },
        { role: "user", content: `CV:\n${cvText}\n\nJOB DESCRIPTION:\n${job_description}` },
      ], [{
        type: "function",
        function: {
          name: "jd_scan_result",
          description: "Return JD scan keyword analysis with actionable improvements",
          parameters: {
            type: "object",
            properties: {
              match_score: { type: "number", description: "Match score 0-100" },
              matched_keywords: { type: "array", items: { type: "string" }, description: "Keywords found in CV" },
              missing_keywords: { type: "array", items: { type: "string" }, description: "Important keywords NOT in CV" },
              suggestions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    keyword: { type: "string" },
                    suggestion: { type: "string", description: "Where and how to add this keyword in CV" },
                  },
                  required: ["keyword", "suggestion"],
                },
              },
              improvements: {
                type: "array",
                description: "Concrete rewrites for CV sections to better match JD",
                items: {
                  type: "object",
                  properties: {
                    target: { type: "string", enum: ["summary", "experience", "skills"], description: "Which CV section to improve" },
                    experience_id: { type: "string", description: "Experience ID if target is experience" },
                    original: { type: "string", description: "Original text from CV" },
                    improved: { type: "string", description: "Improved text with JD keywords added naturally" },
                    reason: { type: "string", description: "Why this change helps" },
                  },
                  required: ["target", "original", "improved", "reason"],
                },
              },
            },
            required: ["match_score", "matched_keywords", "missing_keywords", "suggestions", "improvements"],
          },
        },
      }], { type: "function", function: { name: "jd_scan_result" } }, "google/gemini-2.5-flash");
      const errResp = handleErrorResponse(response, corsHeaders);
      if (errResp) return errResp;
      if (!response.ok) throw new Error("AI gateway error");

      const aiResult = await response.json();
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in AI response");
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === TEXT ANALYZE MODE (raw text from uploaded CV) ===
    if (mode === "text-analyze") {
      const { cv_text, job_description } = body;
      const systemPrompt = `Kamu adalah HR Expert dan ATS Specialist. Analisis CV (raw text) berikut dan berikan skor 1-10 untuk setiap kategori.

Kamu HARUS memanggil function "score_cv" dengan hasil analisismu.

Kriteria penilaian:
1. ats_compatibility
2. keyword_optimization
3. achievement_vs_responsibility
4. storytelling_quality
5. skill_relevance
6. experience_depth
7. professional_summary
8. education_fit
9. formatting_structure
10. overall_impression

PENTING: Untuk field "recommendations", kamu WAJIB mengisi rekomendasi spesifik dan actionable untuk SEMUA 10 kategori tanpa terkecuali. Setiap rekomendasi harus menjelaskan MENGAPA skor tidak sempurna dan APA yang harus diperbaiki. Jangan pernah mengembalikan recommendations kosong.
Berikan juga improvement tips umum (minimal 5 tips).
${job_description ? `\nBandingkan juga dengan Job Description yang diberikan dan berikan analisis keyword match.` : ''}`;

      const userContent = `Analisis CV ini:\n\n${cv_text}${job_description ? `\n\nJOB DESCRIPTION:\n${job_description}` : ''}`;

      const toolParams: any = {
        type: "object",
        properties: {
          scores: {
            type: "object",
            properties: {
              ats_compatibility: { type: "number" },
              keyword_optimization: { type: "number" },
              achievement_vs_responsibility: { type: "number" },
              storytelling_quality: { type: "number" },
              skill_relevance: { type: "number" },
              experience_depth: { type: "number" },
              professional_summary: { type: "number" },
              education_fit: { type: "number" },
              formatting_structure: { type: "number" },
              overall_impression: { type: "number" },
            },
            required: ["ats_compatibility", "keyword_optimization", "achievement_vs_responsibility", "storytelling_quality", "skill_relevance", "experience_depth", "professional_summary", "education_fit", "formatting_structure", "overall_impression"],
          },
          recommendations: {
            type: "object",
            description: "Rekomendasi spesifik per kategori. WAJIB isi semua 10 kategori.",
            properties: {
              ats_compatibility: { type: "string" },
              keyword_optimization: { type: "string" },
              achievement_vs_responsibility: { type: "string" },
              storytelling_quality: { type: "string" },
              skill_relevance: { type: "string" },
              experience_depth: { type: "string" },
              professional_summary: { type: "string" },
              education_fit: { type: "string" },
              formatting_structure: { type: "string" },
              overall_impression: { type: "string" },
            },
            required: ["ats_compatibility", "keyword_optimization", "achievement_vs_responsibility", "storytelling_quality", "skill_relevance", "experience_depth", "professional_summary", "education_fit", "formatting_structure", "overall_impression"],
          },
          improvement_tips: { type: "array", items: { type: "string" } },
        },
        required: ["scores", "recommendations", "improvement_tips"],
      };

      if (job_description) {
        toolParams.properties.jd_analysis = {
          type: "object",
          properties: {
            match_score: { type: "number", description: "Match score 0-100" },
            matched_keywords: { type: "array", items: { type: "string" } },
            missing_keywords: { type: "array", items: { type: "string" } },
            suggestions: { type: "array", items: { type: "object", properties: { keyword: { type: "string" }, suggestion: { type: "string" } }, required: ["keyword", "suggestion"] } },
          },
          required: ["match_score", "matched_keywords", "missing_keywords", "suggestions"],
        };
      }

      const response = await aiRequest(LOVABLE_API_KEY, [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ], [{
        type: "function",
        function: {
          name: "score_cv",
          description: "Return CV analysis scores and recommendations",
          parameters: toolParams,
        },
      }], { type: "function", function: { name: "score_cv" } });

      const errResp = handleErrorResponse(response, corsHeaders);
      if (errResp) return errResp;
      if (!response.ok) throw new Error("AI gateway error");

      const aiResult = await response.json();
      const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in AI response");

      const analysis = JSON.parse(toolCall.function.arguments);
      const scores = analysis.scores;
      const total = Object.values(scores).reduce((a: number, b: any) => a + b, 0) / Object.keys(scores).length;
      analysis.total_score = Math.round(total * 10) / 10;

      return new Response(JSON.stringify({ analysis }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === ANALYZE MODE (default) ===
    const { cv_data, cv_id } = body;
    const response = await aiRequest(LOVABLE_API_KEY, [
      { role: "system", content: `Kamu adalah HR Expert dan ATS Specialist. Analisis CV berikut dan berikan skor 1-10 untuk setiap kategori.\n\nKamu HARUS memanggil function "score_cv" dengan hasil analisismu.\n\nKriteria penilaian:\n1. ats_compatibility\n2. keyword_optimization\n3. achievement_vs_responsibility\n4. storytelling_quality\n5. skill_relevance\n6. experience_depth\n7. professional_summary\n8. education_fit\n9. formatting_structure\n10. overall_impression\n\nPENTING: Untuk field "recommendations", kamu WAJIB mengisi rekomendasi spesifik dan actionable untuk SEMUA 10 kategori tanpa terkecuali. Setiap rekomendasi harus menjelaskan MENGAPA skor tidak sempurna dan APA yang harus diperbaiki. Jangan pernah mengembalikan recommendations kosong.\nBerikan juga improvement tips umum (minimal 5 tips).` },
      { role: "user", content: `Analisis CV ini:\n\nTarget Posisi: ${cv_data.target_position}\nPengalaman: ${cv_data.years_experience} tahun\n\nData Pribadi: ${JSON.stringify(cv_data.personal_info)}\nSummary: ${cv_data.summary}\nPengalaman Kerja: ${JSON.stringify(cv_data.experiences)}\nPendidikan: ${JSON.stringify(cv_data.education)}\nSkills: ${JSON.stringify(cv_data.skills)}\nSertifikasi: ${JSON.stringify(cv_data.certifications)}` },
    ], [{
      type: "function",
      function: {
        name: "score_cv",
        description: "Return CV analysis scores and recommendations",
        parameters: {
          type: "object",
          properties: {
            scores: {
              type: "object",
              properties: {
                ats_compatibility: { type: "number" },
                keyword_optimization: { type: "number" },
                achievement_vs_responsibility: { type: "number" },
                storytelling_quality: { type: "number" },
                skill_relevance: { type: "number" },
                experience_depth: { type: "number" },
                professional_summary: { type: "number" },
                education_fit: { type: "number" },
                formatting_structure: { type: "number" },
                overall_impression: { type: "number" },
              },
              required: ["ats_compatibility", "keyword_optimization", "achievement_vs_responsibility", "storytelling_quality", "skill_relevance", "experience_depth", "professional_summary", "education_fit", "formatting_structure", "overall_impression"],
            },
            recommendations: {
              type: "object",
              description: "Rekomendasi spesifik per kategori. WAJIB isi semua 10 kategori.",
              properties: {
                ats_compatibility: { type: "string" },
                keyword_optimization: { type: "string" },
                achievement_vs_responsibility: { type: "string" },
                storytelling_quality: { type: "string" },
                skill_relevance: { type: "string" },
                experience_depth: { type: "string" },
                professional_summary: { type: "string" },
                education_fit: { type: "string" },
                formatting_structure: { type: "string" },
                overall_impression: { type: "string" },
              },
              required: ["ats_compatibility", "keyword_optimization", "achievement_vs_responsibility", "storytelling_quality", "skill_relevance", "experience_depth", "professional_summary", "education_fit", "formatting_structure", "overall_impression"],
            },
            improvement_tips: { type: "array", items: { type: "string" } },
          },
          required: ["scores", "recommendations", "improvement_tips"],
        },
      },
    }], { type: "function", function: { name: "score_cv" } });

    const errResp = handleErrorResponse(response, corsHeaders);
    if (errResp) return errResp;
    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const analysis = JSON.parse(toolCall.function.arguments);
    const scores = analysis.scores;
    const total = Object.values(scores).reduce((a: number, b: any) => a + b, 0) / Object.keys(scores).length;
    analysis.total_score = Math.round(total * 10) / 10;

    if (cv_id) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, supabaseKey);
      await sb.from("cv_data").update({ ai_analysis: analysis }).eq("id", cv_id);
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-cv error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
