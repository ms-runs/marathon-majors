// Feeds deliberately bad rows to the calendar feed builder and checks none of it gets through.
// Run: node scripts/test-security.mjs
import { buildIcs } from "../supabase/functions/majors-calendar/ics.js";

const races = [
  { id: "ber", code: "BER", name: "Berlin", full_name: "Berlin Marathon", city: "Berlin", race_date: "2027-09-26", sort: 1,
    official_url: "javascript:alert(1)", note: "ok" },
  { id: "chi", code: "CHI", name: "Chicago", full_name: "Chicago Marathon", city: "Chicago", race_date: "2027-10-10", sort: 2,
    official_url: "https://www.chicagomarathon.com/apply/\r\nATTACH:https://evil.example/x" },
  { id: 'x"><img', code: "XXX", name: "Bad", full_name: "Bad", city: "Bad", race_date: "2027-01-01", sort: 3 },
  { id: "nyc", code: "NYC", name: "New York", full_name: "New York City Marathon", city: "NYC", race_date: "not-a-date", sort: 4 },
];
const events = [
  { id: 1, race_id: "ber", kind: "window", label: "Lottery", starts_on: "2026-10-01", ends_on: "2026-11-12", source_url: "data:text/html,hi" },
  { id: 2, race_id: "ber", kind: "evil", label: "x", starts_on: "2026-10-01" },
  { id: "3\r\nX", race_id: "chi", kind: "result", label: "Results", starts_on: "2026-12-08" },
  { id: 4, race_id: "chi", kind: "window", label: "Application", starts_on: "2026-10-08", ends_on: "2026-10-29", source_url: "https://www.chicagomarathon.com/apply/" },
];

const ics = buildIcs(races, events, {});
const checks = {
  "no javascript: links": !/javascript:/i.test(ics),
  "no data: links": !/data:text/i.test(ics),
  "no injected ATTACH line": !/^ATTACH/m.test(ics),
  "bad race id dropped": !/img/.test(ics),
  "bad date race dropped": !/New York/.test(ics),
  "unknown event kind dropped": !/: x\b/.test(ics),
  "good https link kept": ics.includes("URL:https://www.chicagomarathon.com/apply/"),
  // Berlin lottery (opens + closes), Chicago application (opens + closes), 2 race days
  "good events kept": (ics.match(/BEGIN:VEVENT/g) || []).length === 6,
};
let ok = true;
for (const [k, v] of Object.entries(checks)) { console.log(`${v ? "PASS" : "FAIL"}  ${k}`); ok &&= v; }
process.exit(ok ? 0 : 1);
