// Builds the Marathon Majors iCalendar feed from the majors_* rows.
// Plain JS so it runs in both Deno (edge function) and Node (local test).
const COLORS = { tyo:"crimson", bos:"royalblue", lon:"slateblue", cpt:"lightseagreen", syd:"darkorange", ber:"goldenrod", chi:"deepskyblue", nyc:"darkorchid", sha:"mediumvioletred" };
const enc = new TextEncoder();

// Input validation: only well-formed rows and https links reach the feed.
const ID_RE = /^[a-z]{3}$/, DATE_RE = /^\d{4}-\d{2}-\d{2}$/, KINDS = new Set(["window","result","pay"]);
function safeUrl(u){
  if (typeof u !== "string" || /[\s"'<>`\\]/.test(u)) return null;
  try { const x = new URL(u); return x.protocol === "https:" && x.hostname ? x.href : null; } catch { return null; }
}
const safeDate = d => typeof d === "string" && DATE_RE.test(d) && !isNaN(new Date(d + "T00:00:00Z")) ? d : null;

function esc(s){ return String(s ?? "").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"); }
function fold(line){
  // RFC 5545: lines over 75 octets are folded with CRLF + space, never splitting a UTF-8 character
  if (enc.encode(line).length <= 75) return line;
  const out = []; let cur = "", bytes = 0, limit = 75;
  for (const ch of line){
    const b = enc.encode(ch).length;
    if (bytes + b > limit){ out.push(cur); cur = " "; bytes = 1; limit = 75; }
    cur += ch; bytes += b;
  }
  out.push(cur); return out.join("\r\n");
}
const ymd = d => d.replace(/-/g,"");
function nextDay(d){ const t = new Date(d+"T00:00:00Z"); t.setUTCDate(t.getUTCDate()+1); return t.toISOString().slice(0,10); }
function stamp(ts){ const d = ts ? new Date(ts) : new Date(); return d.toISOString().replace(/[-:]/g,"").replace(/\.\d+Z$/,"Z"); }
function fmtDate(d){ return new Date(d+"T00:00:00Z").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}); }

function vevent({uid, start, end, summary, desc, url, color, updated, alarmDays}){
  const L = ["BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${stamp(updated)}`, `LAST-MODIFIED:${stamp(updated)}`,
    `DTSTART;VALUE=DATE:${ymd(start)}`, `DTEND;VALUE=DATE:${ymd(nextDay(end || start))}`,
    `SUMMARY:${esc(summary)}`, `DESCRIPTION:${esc(desc)}`, "TRANSP:TRANSPARENT"];
  if (url) L.push(`URL:${url}`);
  if (color) L.push(`COLOR:${color}`);
  if (alarmDays != null) L.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${esc(summary)}`,`TRIGGER:-P${alarmDays}D`,"END:VALARM");
  L.push("END:VEVENT"); return L;
}

export function buildIcs(races, events, opts = {}){
  races = (Array.isArray(races) ? races : []).filter(r => r && ID_RE.test(r.id) && safeDate(r.race_date))
    .map(r => ({ ...r, race_end: safeDate(r.race_end), official_url: safeUrl(r.official_url) }));
  events = (Array.isArray(events) ? events : []).filter(e => e && ID_RE.test(e.race_id) && KINDS.has(e.kind)
      && safeDate(e.starts_on) && (e.ends_on == null || safeDate(e.ends_on)) && /^\d+$/.test(String(e.id)))
    .map(e => ({ ...e, source_url: safeUrl(e.source_url) }));
  const pick = opts.races && opts.races.length ? new Set(opts.races) : null;
  const pageUrl = opts.pageUrl || "";
  const sel = races.filter(r => !pick || pick.has(r.id)).sort((a,b)=>a.sort-b.sort);
  const byId = Object.fromEntries(sel.map(r=>[r.id,r]));
  const name = pick && sel.length === 1 ? `${sel[0].name} Marathon dates` : (pick ? "Marathon Majors (selected)" : "Marathon Majors");
  const out = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//migsousa.com//Marathon Majors//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(name)}`, `NAME:${esc(name)}`,
    "X-WR-CALDESC:Application windows\\, results days and race days for the World Marathon Majors. Updated weekly.",
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H","X-PUBLISHED-TTL:PT12H"];

  for (const e of events){
    const r = byId[e.race_id]; if (!r) continue;
    const exp = e.estimated ? " (expected)" : "";
    const expNote = e.estimated ? "Expected dates based on past years. Not announced yet.\n" : "";
    const link = e.source_url || r.official_url;
    const base = { url: link, color: COLORS[r.id], updated: e.updated_at };
    const more = `\nOfficial page: ${r.official_url || ""}${pageUrl ? `\nAll dates: ${pageUrl}` : ""}`;
    if (e.kind === "window"){
      const range = `${fmtDate(e.starts_on)} – ${fmtDate(e.ends_on || e.starts_on)}`;
      out.push(...vevent({ ...base, uid:`majors-${e.id}-open@migsousa.com`, start:e.starts_on,
        summary:`${r.name}: ${e.label} opens${exp}`, desc:`${expNote}${r.full_name} · ${e.label}\nWindow: ${range}${more}`, alarmDays: e.estimated ? null : 0 }));
      if (e.ends_on && e.ends_on !== e.starts_on)
        out.push(...vevent({ ...base, uid:`majors-${e.id}-close@migsousa.com`, start:e.ends_on,
          summary:`${r.name}: ${e.label} closes${exp}`, desc:`${expNote}Last day to apply. ${r.full_name} · ${e.label}\nWindow: ${range}${more}`, alarmDays: e.estimated ? null : 2 }));
    } else {
      const what = e.kind === "pay" ? "deadline" : "";
      out.push(...vevent({ ...base, uid:`majors-${e.id}@migsousa.com`, start:e.starts_on,
        summary:`${r.name}: ${e.label}${what && !/due|deadline|confirm/i.test(e.label) ? " deadline" : ""}${exp}`,
        desc:`${expNote}${r.full_name} · ${e.label}${more}`, alarmDays: e.kind === "pay" && !e.estimated ? 1 : null }));
    }
  }
  for (const r of sel){
    out.push(...vevent({ uid:`majors-race-${r.id}-${r.race_date.slice(0,4)}@migsousa.com`, start:r.race_date, end:r.race_end || r.race_date,
      summary:`${r.full_name}${r.race_end ? " (Double)" : ""}${r.race_tbc ? " (date TBC)" : ""}`,
      desc:`Race day. ${r.city}${r.note ? `\n${r.note}` : ""}\nOfficial page: ${r.official_url || ""}${pageUrl ? `\nAll dates: ${pageUrl}` : ""}`,
      url:r.official_url, color:COLORS[r.id], updated:r.updated_at }));
  }
  out.push("END:VCALENDAR");
  return out.map(fold).join("\r\n") + "\r\n";
}
