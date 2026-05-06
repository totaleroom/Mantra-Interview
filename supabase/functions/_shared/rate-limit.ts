const requestLog = new Map<string, number[]>();

// Clean old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requestLog) {
    const filtered = timestamps.filter((t) => now - t < 120_000);
    if (filtered.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, filtered);
    }
  }
}, 300_000);

export function checkRateLimit(
  req: Request,
  maxRequests: number,
  windowSeconds: number
): { allowed: boolean; headers: Record<string, string> } {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `${ip}`;

  const timestamps = requestLog.get(key) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(maxRequests),
    "X-RateLimit-Remaining": String(Math.max(0, maxRequests - recent.length)),
  };

  if (recent.length >= maxRequests) {
    return { allowed: false, headers };
  }

  recent.push(now);
  requestLog.set(key, recent);

  headers["X-RateLimit-Remaining"] = String(maxRequests - recent.length);
  return { allowed: true, headers };
}
