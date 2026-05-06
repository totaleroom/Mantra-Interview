const allowedOrigins = [
  "https://mantraskill.web.id",
  "https://mantraskill.lovable.app",
  "https://id-preview--09dc0c8f-9c76-4ad5-b9bd-086702293b16.lovable.app",
  "https://09dc0c8f-9c76-4ad5-b9bd-086702293b16.lovableproject.com",
];

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}
