"""Build the Marathon Majors widget from src/ into docs/ (served by GitHub Pages).

Outputs:
  docs/majors.js                  the embeddable widget (loaded by the Squarespace snippet)
  docs/index.html                 standalone page, light/dark aware
  docs/squarespace-code-block.html  full paste-in fallback if Pages is ever unavailable

Run: python3 scripts/build.py
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "src", ROOT / "docs"
OUT.mkdir(exist_ok=True)

css = (SRC / "app.css").read_text()
app = (SRC / "app.js").read_text().replace("/*SNAPSHOT*/null", (SRC / "snapshot.json").read_text().strip())
markup = (SRC / "markup.html").read_text()
FONTS_URL = "https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
FONTS = f'<link rel="stylesheet" href="{FONTS_URL}">'

# Squarespace embed: transparent so it sits on the site's own background, light palette only.
embed_css = css.replace("/*THEME*/", ".mm[data-majors]{background:transparent}")

# Standalone page: follows the viewer's light/dark setting.
dark_vals = "--mm-bg:#121212;--mm-surface:#1a1a19;--mm-fg:#ecebe7;--mm-muted:#9a9993;--mm-line:#2b2b29;--mm-line-strong:#43423f;--mm-open:#3fb871;"
dark = (":root{--page:#fbfbfa}\n"
        "@media (prefers-color-scheme: dark){:root:not([data-theme=\"light\"]){--page:#121212;color-scheme:dark}:root:not([data-theme=\"light\"]) .mm{" + dark_vals + "}}\n"
        ":root[data-theme=\"dark\"]{--page:#121212;color-scheme:dark}:root[data-theme=\"dark\"] .mm{" + dark_vals + "}\n"
        "body{background:var(--page);margin:0}")
page_css = css.replace("/*THEME*/", dark)

# 1. majors.js — finds each <div id="marathon-majors"> (or [data-marathon-majors]) and builds the widget inside it.
loader = f"""/* Marathon Majors widget · built from github.com/ms-runs/marathon-majors · do not edit, run scripts/build.py */
(function(){{
var CSS={json.dumps(embed_css)};
var MARKUP={json.dumps(markup)};
function run(){{
{app}
}}
function boot(){{
  if(!document.getElementById("mm-style")){{
    var f=document.createElement("link"); f.rel="stylesheet"; f.href={json.dumps(FONTS_URL)}; document.head.appendChild(f);
    var s=document.createElement("style"); s.id="mm-style"; s.textContent=CSS; document.head.appendChild(s);
  }}
  var hosts=document.querySelectorAll("#marathon-majors:not([data-mm-loaded]),[data-marathon-majors]:not([data-mm-loaded])");
  for(var i=0;i<hosts.length;i++){{ hosts[i].setAttribute("data-mm-loaded","1"); hosts[i].innerHTML=MARKUP; run(); }}
}}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
}})();
"""
(OUT / "majors.js").write_text(loader)

# 2. index.html — standalone page
(OUT / "index.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Marathon Majors Entry Timeline</title>
<meta name="description" content="When to apply for each World Marathon Major: ballots, qualifier windows, results days and race days.">
{FONTS}
<style>
{page_css}
</style></head>
<body>
{markup}
<script>
{app}
</script>
</body></html>
""")

# 3. Full paste-in fallback
(OUT / "squarespace-code-block.html").write_text(
    f"<!-- Marathon Majors timeline (full version): paste into a Squarespace Code block only if the short snippet can't be used -->\n"
    f"{FONTS}\n<style>\n{embed_css}\n</style>\n{markup}\n<script>\n{app}\n</script>\n")

(OUT / ".nojekyll").write_text("")
print("built:", ", ".join(f"{p.name} ({p.stat().st_size:,} B)" for p in sorted(OUT.iterdir()) if p.name != ".nojekyll"))
