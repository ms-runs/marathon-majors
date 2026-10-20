# Notes for Claude

- Source lives in `src/`; `docs/` is build output served by GitHub Pages. Never hand-edit `docs/`. Run `python3 scripts/build.py` and commit both.
- Squarespace embeds `docs/majors.js` via `<div id="marathon-majors">`. The host page has its own global CSS (buttons, inputs) and may run the script more than once, so:
  - scope every style under `.mm` and give class rules enough specificity to beat `.mm button`;
  - keep `.mm [hidden]{display:none!important}` (Squarespace has no `[hidden]` reset);
  - keep the `data-mm-loaded` / `data-mm-ready` guards so each block only initialises once.
- Supabase project: `axmzxphxcgwrsbkixmbg` ("zine-maker", free tier, shared with the zine tool). Only touch `majors_*` tables and the `majors-calendar` function. Anon/authenticated roles have SELECT only.
- The `majors-calendar` edge function must stay deployed with JWT verification off (calendar apps can't send auth headers).
- A weekly scheduled task ("Marathon Majors weekly refresh", Mondays) updates the tables from official race sites. Page and feed need no rebuild for data changes.
- Race colours are CSS tokens `--mm-<id>` in `src/app.css`; badges are placeholder circles until `badge_url` is set (Miguel is hand-drawing them on a circle template, square transparent PNGs ~600px).
- Treat every database value as untrusted (the weekly task writes data it found on the web). All rows go through `shape()` in `src/app.js` and the validation at the top of `buildIcs()` in the feed: 3-letter ids, ISO dates, known event kinds, https-only links. Database CHECK constraints enforce the same rules. Run `node scripts/test-security.mjs` after changing either.
