import { buildIcs } from "./ics.js";

// Public, read-only calendar feed for the Marathon Majors timeline.
// Calendar apps can't send auth headers, so JWT checking is off; the function
// only reads the public majors_* tables with the publishable key.
const URL_BASE = Deno.env.get("SUPABASE_URL") ?? "https://axmzxphxcgwrsbkixmbg.supabase.co";
const KEY = "sb_publishable_bcqkFGvCkSS5-sY8f6xLyQ_Am-8ngTZ";
const PAGE_URL = "https://www.migsousa.com";
const VALID = new Set(["tyo","bos","lon","cpt","syd","ber","chi","nyc","sha"]);

async function get(path: string) {
  const r = await fetch(`${URL_BASE}/rest/v1/${path}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

Deno.serve(async (req: Request) => {
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
  const u = new URL(req.url);
  const races = (u.searchParams.get("races") ?? "").toLowerCase().split(",").map(s => s.trim()).filter(s => VALID.has(s));
  try {
    const [r, e] = await Promise.all([
      get("majors_races?select=*"),
      get("majors_events?select=*&order=starts_on.asc"),
    ]);
    const body = buildIcs(r, e, { races, pageUrl: PAGE_URL });
    return new Response(req.method === "HEAD" ? null : body, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="marathon-majors.ics"',
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(`Calendar temporarily unavailable: ${(err as Error).message}`, { status: 503, headers: { "Retry-After": "3600" } });
  }
});
