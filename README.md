# Marathon Majors

When to apply for each World Marathon Major: an interactive timeline of ballot, lottery and qualifier windows, results days and race days, with a calendar people can subscribe to. It runs on [migsousa.com](https://www.migsousa.com).

- **Live page:** https://ms-runs.github.io/marathon-majors/
- **Calendar feed:** https://axmzxphxcgwrsbkixmbg.supabase.co/functions/v1/majors-calendar
  (add `?races=ber,chi` for a subset)

## How it fits together

```
Supabase (project "zine-maker")
  majors_races / majors_events / majors_meta   ← updated every Monday by a scheduled Claude task
        │                         │
        ▼                         ▼
  docs/majors.js            supabase/functions/majors-calendar
  (GitHub Pages)            (.ics feed for Apple / Google / Outlook)
        │
        ▼
  Squarespace Code block (two-line snippet below)
```

The widget reads the race tables live on every page view. If Supabase can't be reached, it falls back to the copy saved in `src/snapshot.json`.

## Embedding on Squarespace

Paste this into a Code block. It never needs to change. Pushing to `main` updates the site within a few minutes.

```html
<div id="marathon-majors"></div>
<script src="https://ms-runs.github.io/marathon-majors/majors.js"></script>
```

`docs/squarespace-code-block.html` is a full self-contained version to paste instead if GitHub Pages is ever unavailable.

## Making changes

| To change | Edit | Then |
|---|---|---|
| Layout, styles, behaviour | `src/app.css`, `src/app.js`, `src/markup.html` | `python3 scripts/build.py`, commit `src/` and `docs/` |
| Race dates, fees, notes | The Supabase tables (the weekly task does this) | Nothing, the page reads them live |
| Fallback dates | `src/snapshot.json` | Rebuild |
| Calendar feed | `supabase/functions/majors-calendar/` | Redeploy the `majors-calendar` function (JWT verification off) |
| Race badges | Set `badge_url` on a row in `majors_races` | Nothing |

Test the feed builder with `node scripts/test-calendar.mjs`.

## Data

| Table | What it holds |
|---|---|
| `majors_races` | One row per race: dates, fee, entry routes, official link, note, badge image |
| `majors_events` | Application windows (`window`), results days (`result`) and payment deadlines (`pay`). `estimated = true` means expected from past years, not announced |
| `majors_meta` | `checked_on`: date of the last weekly check |

The public (publishable) key can only read these tables. Writes from visitors are refused.
