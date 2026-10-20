/* Marathon Majors widget · built from github.com/ms-runs/marathon-majors · do not edit, run scripts/build.py */
(function(){
var CSS="/* Layout: a single working column \u2014 \"next up\" cards, filter chips, one scrollable timeline grid (race rows \u00d7 months), then a detail panel for the selected race. Quiet monochrome portfolio frame; colour belongs only to the races. Everything is scoped to .mm so it can sit inside a Squarespace code block. */\n.mm{\n  --mm-bg:#fbfbfa; --mm-surface:#ffffff; --mm-fg:#161616; --mm-muted:#6b6b68; --mm-line:#e4e3df; --mm-line-strong:#c9c8c3; --mm-open:#1f8a4c;\n  --mm-f-display:\"Familjen Grotesk\",\"Helvetica Neue\",Arial,sans-serif;\n  --mm-f-body:\"Familjen Grotesk\",\"Helvetica Neue\",Arial,sans-serif;\n  --mm-f-mono:\"IBM Plex Mono\",ui-monospace,Menlo,monospace;\n  --mm-tyo:#d64550; --mm-bos:#2e6fb7; --mm-lon:#5b4fb0; --mm-cpt:#1f9a8a; --mm-syd:#e07a1f;\n  --mm-ber:#c79a12; --mm-chi:#3a9bd4; --mm-nyc:#8a3fa0; --mm-sha:#c93f86;\n  background:var(--mm-bg); color:var(--mm-fg); font-family:var(--mm-f-body); font-size:15px; line-height:1.5; letter-spacing:normal; text-transform:none;\n}\n.mm[data-majors]{background:transparent}\n.mm *,.mm *::before,.mm *::after{box-sizing:border-box}\n.mm [hidden]{display:none!important}\n.mm h1,.mm h2,.mm p,.mm dl,.mm dd{margin:0}\n.mm button{font:inherit;color:inherit;letter-spacing:normal;text-transform:none;margin:0;box-shadow:none;min-height:0;line-height:inherit}\n.mm-wrap{max-width:1120px;margin:0 auto;padding-inline:20px;padding-block:32px 56px;display:flex;flex-direction:column;gap:32px}\n@media (max-width:520px){.mm-wrap{padding-inline:16px;padding-block:20px 40px;gap:26px}}\n\n.mm-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 24px}\n.mm h1{font-family:var(--mm-f-display);font-weight:600;font-size:clamp(28px,5vw,40px);letter-spacing:-.02em;line-height:1.05;text-wrap:balance;color:var(--mm-fg)}\n.mm-lede{color:var(--mm-muted);margin-top:6px!important;max-width:56ch}\n.mm-stamp{font-family:var(--mm-f-mono);font-size:12px;color:var(--mm-muted);letter-spacing:.02em}\n.mm-head-side{display:flex;flex-direction:column;align-items:flex-end;gap:8px}\n@media (max-width:520px){.mm-head-side{align-items:flex-start}}\n.mm .mm-sub-btn{display:inline-flex;align-items:center;gap:8px;background:var(--mm-fg);color:var(--mm-surface);border:0;border-radius:99px;padding:9px 16px;font-size:14px;font-weight:600;line-height:1.2;cursor:pointer;white-space:nowrap}\n.mm .mm-sub-btn svg{flex:none;stroke:currentColor}\n.mm .mm-sub-btn:hover{opacity:.88}\n.mm .mm-sub-btn[aria-expanded=\"true\"]{background:var(--mm-surface);color:var(--mm-fg);box-shadow:inset 0 0 0 1.5px var(--mm-fg)}\n.mm-sub{background:var(--mm-surface);border:1px solid var(--mm-line-strong);border-radius:10px;padding:18px 20px;display:flex;flex-direction:column;gap:16px;margin-top:-12px}\n.mm-sub-top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}\n.mm-sub-title{font-weight:600;font-size:16px;margin-bottom:2px!important}\n.mm-x{background:none;border:0;font-size:22px;line-height:1;color:var(--mm-muted);cursor:pointer;padding:2px 6px;border-radius:4px}\n.mm-sub-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}\n.mm-sub-link{display:flex;flex-direction:column;gap:2px;padding:12px 14px;border:1px solid var(--mm-line);border-radius:8px;color:var(--mm-fg);text-decoration:none!important;min-width:0}\n.mm-sub-link:hover{border-color:var(--mm-fg)}\n.mm-sub-link b{font-weight:600;font-size:14px}\n.mm-sub-link span{font-size:12px;color:var(--mm-muted)}\n.mm-copy{display:flex;flex-direction:column;gap:6px}\n.mm-copy .lbl{font-size:12px;color:var(--mm-muted)}\n.mm-copy-row{display:flex;gap:8px;min-width:0}\n.mm-copy-row input{flex:1;min-width:0;font-family:var(--mm-f-mono);font-size:12.5px;color:var(--mm-fg);background:var(--mm-bg);border:1px solid var(--mm-line-strong);border-radius:6px;padding:7px 10px;margin:0;height:auto}\n.mm-copy-row .mm-chip{border-radius:6px}\n.mm-eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--mm-muted);font-weight:600;margin-bottom:10px!important}\n\n/* Badge \u2014 placeholder circle template, swapped for a drawing when one exists */\n.mm-badge{--c:var(--mm-fg);width:var(--s,44px);height:var(--s,44px);flex:none;border-radius:50%;position:relative;display:grid;place-items:center;\n  border:1.5px dashed var(--c);color:var(--c);background:color-mix(in srgb,var(--c) 7%,transparent)}\n.mm-badge::before,.mm-badge::after{content:\"\";position:absolute;background:color-mix(in srgb,var(--c) 35%,transparent)}\n.mm-badge::before{width:1px;height:calc(100% + 10px);left:50%;top:-5px}\n.mm-badge::after{height:1px;width:calc(100% + 10px);top:50%;left:-5px}\n.mm-badge span{position:relative;z-index:1;font-family:var(--mm-f-mono);font-weight:500;font-size:calc(var(--s,44px) * .24);letter-spacing:.04em;background:var(--mm-surface);padding:0 2px;line-height:1.2;border-radius:2px}\n.mm-badge.img{border:0;background:none}\n.mm-badge.img::before,.mm-badge.img::after{display:none}\n.mm-badge.img img{width:100%;height:100%;object-fit:contain;display:block}\n\n/* Next up */\n.mm-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}\n.mm-card{background:var(--mm-surface);border:1px solid var(--mm-line);border-radius:10px;padding:14px 16px;display:flex;gap:14px;align-items:center;cursor:pointer;text-align:left;min-width:0}\n.mm-card:hover{border-color:var(--mm-line-strong)}\n.mm :focus-visible{outline:2px solid var(--mm-fg);outline-offset:2px}\n.mm-card .t{font-weight:600;line-height:1.25;margin-top:6px}\n.mm-card .big{font-family:var(--mm-f-mono);font-size:13px;margin-top:4px}\n.mm-pill{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:2px 8px;border-radius:99px;border:1px solid currentColor;line-height:1.5}\n.mm-pill.open{color:var(--mm-open)}.mm-pill.upcoming{color:var(--mm-fg)}.mm-pill.closed{color:var(--mm-muted)}.mm-pill.est{color:var(--mm-muted);border-style:dashed}\n\n/* Filters */\n.mm-filters{display:flex;flex-direction:column;gap:12px}\n.mm-chips{display:flex;flex-wrap:wrap;gap:8px}\n.mm-chip{font-size:13px;font-weight:500;color:var(--mm-fg);background:var(--mm-surface);border:1px solid var(--mm-line-strong);border-radius:99px;padding:5px 12px 5px 8px;display:inline-flex;align-items:center;gap:7px;cursor:pointer}\n.mm-chip .dot{width:10px;height:10px;border-radius:50%;background:var(--c,var(--mm-fg))}\n.mm-chip[aria-pressed=\"false\"]{color:var(--mm-muted);border-color:var(--mm-line);background:transparent}\n.mm-chip[aria-pressed=\"false\"] .dot{background:transparent;box-shadow:inset 0 0 0 1.5px var(--c,var(--mm-muted))}\n.mm-chip.plain{padding-left:12px}\n.mm-frow{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px}\n.mm-frow .lbl{font-size:12px;color:var(--mm-muted);min-width:48px}\n\n/* Timeline */\n.mm-shell{border:1px solid var(--mm-line);border-radius:10px;background:var(--mm-surface);overflow:hidden}\n.mm-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}\n.mm-tl{--label:150px;--mw:62px;position:relative;width:calc(var(--label) + var(--mw) * var(--months));font-variant-numeric:tabular-nums}\n@media (max-width:520px){.mm-tl{--label:96px;--mw:54px}}\n.mm-thead,.mm-row{display:flex;position:relative}\n.mm-thead{border-bottom:1px solid var(--mm-line);height:44px}\n.mm-corner,.mm-rlabel{width:var(--label);flex:none;position:sticky;left:0;z-index:3;background:var(--mm-surface);border:0;border-right:1px solid var(--mm-line)}\n.mm-corner{display:flex;align-items:flex-end;padding:0 12px 8px;font-size:11px;color:var(--mm-muted);letter-spacing:.08em;text-transform:uppercase}\n.mm-months{display:flex}\n.mm-month{width:var(--mw);flex:none;border-left:1px solid var(--mm-line);padding:6px 0 0 6px;font-family:var(--mm-f-mono);font-size:11px;color:var(--mm-muted);line-height:1.2}\n.mm-month.jan{border-left-color:var(--mm-line-strong)}\n.mm-month b{display:block;font-weight:500;color:var(--mm-fg)}\n.mm-row{height:52px;border-bottom:1px solid var(--mm-line)}\n.mm-row:last-child{border-bottom:0}\n.mm-rlabel{display:flex;align-items:center;gap:10px;padding:0 10px;cursor:pointer;text-align:left;border-radius:0}\n.mm-rlabel .nm{font-size:13px;font-weight:600;line-height:1.15;min-width:0}\n.mm-rlabel .nm small{display:block;font-weight:400;color:var(--mm-muted);font-size:11px;font-family:var(--mm-f-mono)}\n@media (max-width:520px){.mm-rlabel .nm small{display:none}.mm-rlabel .nm{font-size:12px}}\n.mm-row.sel .mm-rlabel{background:color-mix(in srgb,var(--c) 10%,var(--mm-surface))}\n.mm-lane{position:relative;flex:none;width:calc(var(--mw) * var(--months))}\n.mm-lane .grid{position:absolute;inset:0;background-image:linear-gradient(to right,var(--mm-line) 1px,transparent 1px);background-size:var(--mw) 100%;opacity:.6}\n.mm-bar{position:absolute;top:15px;height:22px;border-radius:5px;background:var(--c);min-width:6px;cursor:pointer;border:0;padding:0}\n.mm-bar.closed{opacity:.35}\n.mm-bar.est{background:repeating-linear-gradient(135deg,color-mix(in srgb,var(--c) 45%,transparent) 0 4px,transparent 4px 8px);box-shadow:inset 0 0 0 1.5px var(--c)}\n.mm-bar.open{box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 25%,transparent)}\n.mm-mk{position:absolute;top:26px;transform:translate(-50%,-50%);border:0;padding:0;cursor:pointer;background:transparent}\n.mm-mk.result{width:10px;height:10px;border-radius:50%;background:var(--mm-surface);box-shadow:inset 0 0 0 2px var(--c)}\n.mm-mk.pay{width:9px;height:9px;transform:translate(-50%,-50%) rotate(45deg);background:var(--c)}\n.mm-mk.race{width:22px;height:22px;display:grid;place-items:center}\n.mm-mk.race svg{width:18px;height:18px}\n.mm-mk.closed{opacity:.4}\n.mm-today{position:absolute;top:0;bottom:0;width:0;border-left:1.5px solid var(--mm-fg);z-index:2;pointer-events:none}\n.mm-today span{position:absolute;top:2px;left:4px;font-family:var(--mm-f-mono);font-size:10px;background:var(--mm-fg);color:var(--mm-surface);padding:1px 5px;border-radius:3px;white-space:nowrap}\n.mm-legend{display:flex;flex-wrap:wrap;gap:8px 18px;padding:10px 14px;border-top:1px solid var(--mm-line);font-size:12px;color:var(--mm-muted)}\n.mm-legend i{display:inline-block;vertical-align:-2px;margin-right:6px}\n.mm-legend .b{width:22px;height:10px;border-radius:3px;background:var(--mm-fg)}\n.mm-legend .e{width:22px;height:10px;border-radius:3px;background:repeating-linear-gradient(135deg,var(--mm-line-strong) 0 3px,transparent 3px 6px);box-shadow:inset 0 0 0 1.5px var(--mm-muted)}\n.mm-legend .r{width:10px;height:10px;border-radius:50%;box-shadow:inset 0 0 0 2px var(--mm-fg)}\n.mm-legend .p{width:8px;height:8px;background:var(--mm-fg);transform:rotate(45deg)}\n.mm-empty{padding:28px;text-align:center;color:var(--mm-muted);flex:1}\n\n.mm-tip{position:fixed;z-index:9999;max-width:260px;background:var(--mm-fg);color:var(--mm-bg);font-family:var(--mm-f-body);font-size:12.5px;line-height:1.4;padding:8px 10px;border-radius:6px;pointer-events:none}\n.mm-tip b{display:block}\n\n/* Detail */\n.mm-detail{background:var(--mm-surface);border:1px solid var(--mm-line);border-radius:10px;padding:20px;display:grid;grid-template-columns:auto 1fr;gap:20px 24px}\n@media (max-width:620px){.mm-detail{grid-template-columns:1fr}}\n.mm h2{font-family:var(--mm-f-display);font-size:26px;font-weight:600;letter-spacing:-.015em;line-height:1.1;color:var(--mm-fg)}\n.mm-detail .meta{color:var(--mm-muted);margin-top:4px!important;font-size:14px}\n.mm-detail .body{min-width:0;display:flex;flex-direction:column;gap:14px}\n.mm-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px 20px}\n.mm-facts dt{font-size:11px;color:var(--mm-muted);text-transform:uppercase;letter-spacing:.08em}\n.mm-facts dd{margin-top:2px;font-weight:500}\n.mm-tw{overflow-x:auto}\n.mm table{width:100%;border-collapse:collapse;font-size:14px;margin:0}\n.mm th{font-size:11px;color:var(--mm-muted);text-transform:uppercase;letter-spacing:.08em;text-align:left;font-weight:600;padding:0 10px 6px 0;border:0;border-bottom:1px solid var(--mm-line);background:none}\n.mm td{padding:8px 10px 8px 0;border:0;border-bottom:1px solid var(--mm-line);vertical-align:top;background:none}\n.mm td.dt{font-family:var(--mm-f-mono);font-size:12.5px;white-space:nowrap}\n.mm-note{font-size:13px;color:var(--mm-muted);max-width:70ch}\n.mm a.mm-link{color:var(--mm-fg);text-decoration:underline;text-underline-offset:3px;font-weight:500}\n.mm-draw{font-size:12px;color:var(--mm-muted);text-align:center;margin-top:8px!important;max-width:120px}\n@media (prefers-reduced-motion:no-preference){.mm-bar,.mm-card,.mm-chip{transition:opacity .15s,border-color .15s,background .15s}}\n.mm-chip:disabled{opacity:.45;cursor:default}\n";
var MARKUP="<div class=\"mm\" data-majors>\n<div class=\"mm-wrap\">\n  <div class=\"mm-head\">\n    <div>\n      <h1>The Marathon Majors</h1>\n      <p class=\"mm-lede\">When to apply for each World Marathon Major. Ballots, qualifier windows and results days, plus expected dates for the next cycle.</p>\n    </div>\n    <div class=\"mm-head-side\">\n      <button class=\"mm-sub-btn\" id=\"mm-sub-btn\" aria-expanded=\"false\" aria-controls=\"mm-sub\">\n        <svg viewBox=\"0 0 20 20\" width=\"16\" height=\"16\" aria-hidden=\"true\"><rect x=\"2.5\" y=\"4\" width=\"15\" height=\"13\" rx=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/><path d=\"M2.5 8h15M6.5 2.5v3M13.5 2.5v3\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"/><path d=\"M10 10.5v4M8 12.5h4\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg>\n        Subscribe to calendar\n      </button>\n      <div class=\"mm-stamp\" id=\"mm-stamp\">Loading dates\u2026</div>\n    </div>\n  </div>\n  <section class=\"mm-sub\" id=\"mm-sub\" hidden aria-label=\"Subscribe to calendar\">\n    <div class=\"mm-sub-top\">\n      <div>\n        <p class=\"mm-sub-title\">Add these dates to your calendar</p>\n        <p class=\"mm-note\">Your calendar keeps itself up to date. When a race announces or changes a date, it appears in your calendar within a day.</p>\n      </div>\n      <button class=\"mm-x\" id=\"mm-sub-close\" aria-label=\"Close\">\u00d7</button>\n    </div>\n    <div class=\"mm-frow\" id=\"mm-scope-row\">\n      <span class=\"lbl\">Include</span>\n      <div class=\"mm-chips\">\n        <button class=\"mm-chip plain\" data-scope=\"all\" aria-pressed=\"true\">All races</button>\n        <button class=\"mm-chip plain\" data-scope=\"sel\" aria-pressed=\"false\" id=\"mm-scope-sel\">Races I've selected</button>\n      </div>\n    </div>\n    <div class=\"mm-sub-links\" id=\"mm-sub-links\"></div>\n    <div class=\"mm-copy\">\n      <label for=\"mm-feed-url\" class=\"lbl\">Calendar link</label>\n      <div class=\"mm-copy-row\">\n        <input id=\"mm-feed-url\" type=\"text\" readonly>\n        <button class=\"mm-chip plain\" id=\"mm-copy\">Copy</button>\n      </div>\n      <p class=\"mm-note\">For other apps, use \"Add calendar from URL\" or \"Subscribe\" and paste this link.</p>\n    </div>\n  </section>\n  <section>\n    <p class=\"mm-eyebrow\">Next up</p>\n    <div class=\"mm-cards\" id=\"mm-cards\"></div>\n  </section>\n  <section class=\"mm-filters\" aria-label=\"Filters\">\n    <div class=\"mm-chips\" id=\"mm-race-chips\"></div>\n    <div class=\"mm-frow\"><span class=\"lbl\">Show</span><div class=\"mm-chips\" id=\"mm-status-chips\"></div></div>\n  </section>\n  <section>\n    <div class=\"mm-shell\">\n      <div class=\"mm-scroll\" id=\"mm-scroll\"><div class=\"mm-tl\" id=\"mm-tl\"></div></div>\n      <div class=\"mm-legend\">\n        <span><i class=\"b\"></i>Application window</span>\n        <span><i class=\"e\"></i>Expected (not announced)</span>\n        <span><i class=\"r\"></i>Results</span>\n        <span><i class=\"p\"></i>Payment deadline</span>\n        <span><svg width=\"12\" height=\"12\" viewBox=\"0 0 18 18\" style=\"vertical-align:-1px;margin-right:6px\"><path d=\"M4 2v15\" stroke=\"currentColor\" stroke-width=\"2\"/><path d=\"M5 2h10l-3 4 3 4H5z\" fill=\"currentColor\"/></svg>Race day</span>\n      </div>\n    </div>\n  </section>\n  <section class=\"mm-detail\" id=\"mm-detail\" aria-live=\"polite\"></section>\n</div>\n</div>\n";
function run(){
(function(){
// Squarespace can run a code block's script more than once; only set up each block once.
const root=document.querySelector('.mm[data-majors]:not([data-mm-ready])'); if(!root) return;
root.setAttribute('data-mm-ready','1');
const $=s=>root.querySelector(s);
const SB_URL="https://axmzxphxcgwrsbkixmbg.supabase.co";
const SB_KEY="sb_publishable_bcqkFGvCkSS5-sY8f6xLyQ_Am-8ngTZ";

// Saved copy of the data, used if the live database can't be reached.
const SNAPSHOT={"races":[{"id":"tyo","code":"TYO","name":"Tokyo","full_name":"Tokyo Marathon","city":"Tokyo, Japan","race_date":"2027-03-07","race_end":null,"race_tbc":false,"fee":"$230 intl · ¥19,800 Japan","entry_routes":"Lottery, charity, member entry","official_url":"https://www.marathon.tokyo/en/participants/","note":"About 1 in 10 general-lottery applicants get a place. Runners claiming a sub-3:00 estimate must upload proof.","sort":1,"badge_url":null},{"id":"bos","code":"BOS","name":"Boston","full_name":"Boston Marathon","city":"Boston, USA","race_date":"2027-04-19","race_end":null,"race_tbc":false,"fee":"$260","entry_routes":"Qualifying time, charity","official_url":"https://www.baa.org/races/boston-marathon/qualify/","note":"Fastest qualifiers under their standard are accepted first. New for 2027: about 1,000 places drawn at random from qualifiers who missed the cut-off.","sort":2,"badge_url":null},{"id":"lon","code":"LON","name":"London","full_name":"London Marathon","city":"London, UK","race_date":"2027-04-24","race_end":"2027-04-25","race_tbc":false,"fee":"£275 intl · £79.99 UK","entry_routes":"Ballot, Good for Age, charity","official_url":"https://www.londonmarathonevents.co.uk/ballot","note":"2027 is a one-off Double: 45,000 runners on Saturday and 55,000 on Sunday. A record 1.34 million people entered the ballot.","sort":3,"badge_url":null},{"id":"cpt","code":"CPT","name":"Cape Town","full_name":"Cape Town Marathon","city":"Cape Town, South Africa","race_date":"2027-05-23","race_end":null,"race_tbc":false,"fee":"TBC","entry_routes":"Ballot, charity, tour operators","official_url":"https://capetownmarathon.com/","note":"Joins the Majors in 2027. No qualifying-time entry announced.","sort":4,"badge_url":null},{"id":"syd","code":"SYD","name":"Sydney","full_name":"Sydney Marathon","city":"Sydney, Australia","race_date":"2027-08-29","race_end":null,"race_tbc":false,"fee":"A$330 intl · A$280 local","entry_routes":"Ballot, charity, travel partners","official_url":"https://www.tcssydneymarathon.com/sign-up","note":"Free to enter. Cards are charged automatically on results day if you are drawn.","sort":5,"badge_url":null},{"id":"ber","code":"BER","name":"Berlin","full_name":"Berlin Marathon","city":"Berlin, Germany","race_date":"2027-09-26","race_end":null,"race_tbc":false,"fee":"€215","entry_routes":"Lottery, charity, tour operators","official_url":"https://www.generali-berlin-marathon.com/en/registration/run","note":"Lottery dates and results day confirmed on the official site. The entry fee is charged only if you are drawn, from 4 December.","sort":6,"badge_url":null},{"id":"chi","code":"CHI","name":"Chicago","full_name":"Chicago Marathon","city":"Chicago, USA","race_date":"2027-10-10","race_end":null,"race_tbc":false,"fee":"$260 intl · $250 US","entry_routes":"Lottery, time qualifier, legacy, charity","official_url":"https://www.chicagomarathon.com/apply/","note":"One window for both guaranteed and lottery entries. Closes 2:00 p.m. Central on 29 October.","sort":7,"badge_url":null},{"id":"nyc","code":"NYC","name":"New York","full_name":"New York City Marathon","city":"New York, USA","race_date":"2027-11-07","race_end":null,"race_tbc":false,"fee":"About $330 (2026)","entry_routes":"Drawing, 9+1, time qualifier, charity","official_url":"https://www.nyrr.org/tcsnycmarathon","note":"Drawing usually opens in February with results soon after it closes. Under 3% odds.","sort":8,"badge_url":null},{"id":"sha","code":"SHA","name":"Shanghai","full_name":"Shanghai Marathon","city":"Shanghai, China","race_date":"2027-12-05","race_end":null,"race_tbc":true,"fee":"$160 intl (2026)","entry_routes":"Ballot","official_url":"https://static.shang-ma.com/web/index.html","note":"Expected to join the Majors in 2027 if it passes assessment. Race date and entry process not yet confirmed.","sort":9,"badge_url":null}],"events":[{"race_id":"ber","kind":"window","label":"Lottery","starts_on":"2026-10-01","ends_on":"2026-11-12","estimated":false},{"race_id":"ber","kind":"result","label":"Lottery results","starts_on":"2026-12-03","ends_on":null,"estimated":false},{"race_id":"bos","kind":"window","label":"Qualifier registration","starts_on":"2026-09-14","ends_on":"2026-09-18","estimated":false},{"race_id":"bos","kind":"window","label":"2028 qualifier registration","starts_on":"2027-09-13","ends_on":"2027-09-17","estimated":true},{"race_id":"chi","kind":"window","label":"Application","starts_on":"2026-10-08","ends_on":"2026-10-29","estimated":false},{"race_id":"chi","kind":"result","label":"Lottery results","starts_on":"2026-12-08","ends_on":null,"estimated":false},{"race_id":"chi","kind":"pay","label":"Pay entry fee","starts_on":"2026-12-15","ends_on":null,"estimated":false},{"race_id":"cpt","kind":"window","label":"Ballot","starts_on":"2026-06-10","ends_on":"2026-06-24","estimated":false},{"race_id":"cpt","kind":"pay","label":"Card charged","starts_on":"2026-06-26","ends_on":null,"estimated":false},{"race_id":"cpt","kind":"window","label":"2028 ballot","starts_on":"2027-06-09","ends_on":"2027-06-23","estimated":true},{"race_id":"lon","kind":"window","label":"Ballot","starts_on":"2026-04-24","ends_on":"2026-05-01","estimated":false},{"race_id":"lon","kind":"result","label":"Ballot results","starts_on":"2026-07-09","ends_on":null,"estimated":false},{"race_id":"lon","kind":"pay","label":"Confirm place","starts_on":"2026-07-31","ends_on":null,"estimated":false},{"race_id":"lon","kind":"window","label":"Good for Age","starts_on":"2026-10-01","ends_on":"2026-10-29","estimated":false},{"race_id":"lon","kind":"window","label":"2028 ballot","starts_on":"2027-04-26","ends_on":"2027-05-03","estimated":true},{"race_id":"nyc","kind":"window","label":"Drawing","starts_on":"2027-02-03","ends_on":"2027-02-24","estimated":true},{"race_id":"nyc","kind":"result","label":"Drawing results","starts_on":"2027-03-03","ends_on":null,"estimated":true},{"race_id":"sha","kind":"window","label":"Ballot","starts_on":"2027-05-04","ends_on":"2027-05-18","estimated":true},{"race_id":"syd","kind":"window","label":"Ballot","starts_on":"2026-09-29","ends_on":"2026-10-19","estimated":false},{"race_id":"syd","kind":"result","label":"Results & card charged","starts_on":"2026-11-03","ends_on":null,"estimated":false},{"race_id":"tyo","kind":"window","label":"Charity","starts_on":"2026-06-24","ends_on":"2026-07-09","estimated":false},{"race_id":"tyo","kind":"window","label":"ONE TOKYO GLOBAL members","starts_on":"2026-07-31","ends_on":"2026-08-13","estimated":false},{"race_id":"tyo","kind":"window","label":"General lottery","starts_on":"2026-08-14","ends_on":"2026-08-28","estimated":false},{"race_id":"tyo","kind":"result","label":"General lottery results","starts_on":"2026-09-18","ends_on":null,"estimated":false},{"race_id":"tyo","kind":"pay","label":"Entry fee due","starts_on":"2026-09-30","ends_on":null,"estimated":false},{"race_id":"tyo","kind":"window","label":"2028 general lottery","starts_on":"2027-08-13","ends_on":"2027-08-27","estimated":true}],"meta":[{"key":"checked_on","value":"2026-10-19"}]};

// ---- Helpers ----
const DAY=864e5, D=s=>new Date(s+"T00:00:00Z");
const n=new Date(), TODAY_S=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`, TODAY=D(TODAY_S);
const MONTHS=19, startD=new Date(Date.UTC(n.getFullYear(),n.getMonth()-4,1)), endD=new Date(Date.UTC(startD.getUTCFullYear(),startD.getUTCMonth()+MONTHS,1));
const fmt=(s,o={day:"numeric",month:"short"})=>D(s).toLocaleDateString("en-GB",{...o,timeZone:"UTC"});
const fmtY=s=>fmt(s,{day:"numeric",month:"short",year:"numeric"});
const days=(a,b)=>Math.round((D(b)-D(a))/DAY);
const pct=s=>(D(s)-startD)/(endD-startD);
const clamp=x=>Math.max(0,Math.min(1,x));
const status=ev=>{const end=ev.e||ev.s; if(D(end)<TODAY) return "closed"; if(D(ev.s)>TODAY) return "upcoming"; return "open";};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// ---- Input validation: every value from the database passes through here before it can reach the page ----
const ID_RE=/^[a-z]{3}$/, CODE_RE=/^[A-Z]{3}$/, DATE_RE=/^\d{4}-\d{2}-\d{2}$/, KINDS=new Set(["window","result","pay"]);
const safeUrl=u=>{ if(typeof u!=="string"||/[\s"'<>`\\]/.test(u)) return null;
  try{ const x=new URL(u); return x.protocol==="https:"&&x.hostname ? x.href : null; }catch(e){ return null; } };
const safeDate=d=>typeof d==="string"&&DATE_RE.test(d)&&!isNaN(D(d)) ? d : null;
const txt=(s,max)=>s==null?"":String(s).slice(0,max);
const badge=(r,size=44)=>r.badge?`<span class="mm-badge img" style="--s:${size}px"><img src="${esc(r.badge)}" alt=""></span>`
  :`<span class="mm-badge" style="--c:var(--mm-${r.id});--s:${size}px" aria-hidden="true"><span>${esc(r.code)}</span></span>`;

function shape(races,events,meta){
  races=Array.isArray(races)?races:[]; events=Array.isArray(events)?events:[]; meta=Array.isArray(meta)?meta:[];
  const evs=events.filter(e=>e&&ID_RE.test(e.race_id)&&KINDS.has(e.kind)&&safeDate(e.starts_on)&&(e.ends_on==null||safeDate(e.ends_on)));
  return {checked:safeDate((meta.find(m=>m&&m.key==="checked_on")||{}).value),
    races:races.filter(r=>r&&ID_RE.test(r.id)&&safeDate(r.race_date)).sort((a,b)=>(+a.sort||0)-(+b.sort||0)).map(r=>({
      id:r.id, code:CODE_RE.test(r.code)?r.code:r.id.toUpperCase(), name:txt(r.name,40), full:txt(r.full_name,80), city:txt(r.city,80),
      race:r.race_date, raceEnd:safeDate(r.race_end), raceEst:r.race_tbc===true,
      fee:txt(r.fee,80), entry:txt(r.entry_routes,120), url:safeUrl(r.official_url), note:txt(r.note,400), badge:safeUrl(r.badge_url),
      events:evs.filter(e=>e.race_id===r.id).sort((a,b)=>a.starts_on<b.starts_on?-1:1)
        .map(e=>({t:e.kind,k:txt(e.label,60),s:e.starts_on,e:safeDate(e.ends_on),est:e.estimated===true}))}))};
}
async function load(){
  const h={apikey:SB_KEY,Authorization:"Bearer "+SB_KEY};
  const get=p=>fetch(`${SB_URL}/rest/v1/${p}`,{headers:h}).then(r=>{if(!r.ok) throw new Error(r.status); return r.json();});
  const [r,e,m]=await Promise.all([get("majors_races?select=*"),get("majors_events?select=*"),get("majors_meta?select=*")]);
  if(!r.length) throw new Error("empty"); return shape(r,e,m);
}

let RACES=[], CHECKED="", LIVE=false;
let store={}; try{store=JSON.parse(localStorage.getItem("mmFilters")||"{}")}catch(e){}
const state={races:null,statuses:new Set(store.statuses||["open","upcoming","closed","est"]),sel:store.sel||null};
const save=()=>{try{localStorage.setItem("mmFilters",JSON.stringify({races:[...state.races],statuses:[...state.statuses],sel:state.sel}))}catch(e){}};
const visible=ev=>state.statuses.has(status(ev))&&(!ev.est||state.statuses.has("est"));

function renderStamp(){$("#mm-stamp").textContent=(LIVE?"Dates checked ":"Saved dates from ")+(CHECKED?fmtY(CHECKED):"—");}

function renderCards(){
  const items=[];
  RACES.forEach(r=>r.events.forEach(ev=>{ if(ev.t!=="window") return; const st=status(ev); if(st==="closed") return;
    items.push({r,ev,st,sort:st==="open"?D(ev.e):D(ev.s)}); }));
  items.sort((a,b)=>(a.st==="open"?0:1)-(b.st==="open"?0:1)||a.sort-b.sort);
  $("#mm-cards").innerHTML=items.slice(0,4).map(({r,ev,st})=>{
    const k=st==="open"?days(TODAY_S,ev.e):days(TODAY_S,ev.s);
    const line=st==="open"?(k===0?`Closes today · ${fmt(ev.e)}`:`Closes in ${k} day${k===1?"":"s"} · ${fmt(ev.e)}`):`${ev.est?"Expected ":"Opens "}${fmtY(ev.s)}`;
    return `<button class="mm-card" data-race="${r.id}">${badge(r,46)}<span style="min-width:0">
      <span class="mm-pill ${ev.est?"est":st}">${ev.est?"Expected":st==="open"?"Open now":"Upcoming"}</span>
      <span class="t" style="display:block">${esc(r.name)} · ${esc(ev.k)}</span>
      <span class="big" style="display:block">${line}</span></span></button>`;}).join("")||`<p class="mm-note">No upcoming windows.</p>`;
}

function renderChips(){
  $("#mm-race-chips").innerHTML=`<button class="mm-chip plain" data-all="1" aria-pressed="${state.races.size===RACES.length}">All races</button>`+
    RACES.map(r=>`<button class="mm-chip" data-chip="${r.id}" style="--c:var(--mm-${r.id})" aria-pressed="${state.races.has(r.id)}"><span class="dot"></span>${esc(r.name)}</button>`).join("");
  $("#mm-status-chips").innerHTML=[["open","Open now"],["upcoming","Upcoming"],["closed","Closed"],["est","Expected dates"]]
    .map(([k,l])=>`<button class="mm-chip plain" data-status="${k}" aria-pressed="${state.statuses.has(k)}">${l}</button>`).join("");
}

function renderTimeline(){
  const tl=$("#mm-tl"); tl.style.setProperty("--months",MONTHS);
  let months="";
  for(let i=0;i<MONTHS;i++){const d=new Date(Date.UTC(startD.getUTCFullYear(),startD.getUTCMonth()+i,1)), jan=d.getUTCMonth()===0;
    months+=`<div class="mm-month${jan?" jan":""}"><b>${d.toLocaleDateString("en-GB",{month:"short",timeZone:"UTC"})}</b>${jan||i===0?d.getUTCFullYear():"&nbsp;"}</div>`;}
  const slot=100/(MONTHS*30.4);
  const rows=RACES.filter(r=>state.races.has(r.id)).map(r=>{
    let marks="";
    r.events.forEach((ev,i)=>{ if(!visible(ev)) return; const cls=`${status(ev)}${ev.est?" est":""}`;
      if(ev.t==="window"){ const a=pct(ev.s), b=pct(ev.e); if(b<0||a>1) return;
        const l=clamp(a)*100, w=(clamp(b)-clamp(a))*100+slot;
        marks+=`<button class="mm-bar ${cls}" style="left:${l}%;width:${w}%" data-r="${r.id}" data-i="${i}" aria-label="${esc(r.name)} ${esc(ev.k)}, ${fmt(ev.s)} to ${fmt(ev.e)}"></button>`;}
      else { const p=pct(ev.s); if(p<0||p>1) return;
        marks+=`<button class="mm-mk ${ev.t} ${cls}" style="left:${p*100}%" data-r="${r.id}" data-i="${i}" aria-label="${esc(r.name)} ${esc(ev.k)}, ${fmt(ev.s)}"></button>`;}
    });
    const rp=pct(r.race);
    if(rp>=0&&rp<=1) marks+=`<button class="mm-mk race" style="left:${rp*100}%;color:var(--mm-${r.id})" data-r="${r.id}" data-i="race" aria-label="${esc(r.name)} race day, ${fmt(r.race)}"><svg viewBox="0 0 18 18"><path d="M4 2v15" stroke="currentColor" stroke-width="2"/><path d="M5 2h10l-3 4 3 4H5z" fill="currentColor" ${r.raceEst?'fill-opacity=".35" stroke="currentColor" stroke-dasharray="2 1.5"':''}/></svg></button>`;
    return `<div class="mm-row${state.sel===r.id?" sel":""}" style="--c:var(--mm-${r.id})">
      <button class="mm-rlabel" data-race="${r.id}">${badge(r,34)}<span class="nm">${esc(r.name)}<small>${fmt(r.race,{month:"short",year:"2-digit"})}</small></span></button>
      <div class="mm-lane"><div class="grid"></div>${marks}</div></div>`;}).join("");
  tl.innerHTML=`<div class="mm-thead"><div class="mm-corner">Race</div><div class="mm-months">${months}</div></div>
    <div style="position:relative">${rows||'<div class="mm-row"><div class="mm-empty">No races selected.</div></div>'}
    ${rows?`<div style="position:absolute;top:0;bottom:0;left:var(--label);right:0;pointer-events:none"><div class="mm-today" style="left:${pct(TODAY_S)*100}%"><span>Today</span></div></div>`:""}</div>`;
}

function renderDetail(){
  const r=RACES.find(x=>x.id===state.sel)||RACES.find(x=>x.events.some(ev=>ev.t==="window"&&status(ev)==="open"))||RACES[0]; if(!r) return;
  const rows=r.events.map(ev=>{const st=status(ev);
    return `<tr><td>${esc(ev.k)}</td><td class="dt">${ev.e?`${fmt(ev.s)} – ${fmtY(ev.e)}`:fmtY(ev.s)}</td><td><span class="mm-pill ${ev.est?"est":st}">${ev.est?"Expected":st==="open"?"Open":st}</span></td></tr>`;}).join("");
  $("#mm-detail").innerHTML=`
    <div style="display:flex;flex-direction:column;align-items:center">${badge(r,112)}${r.badge?"":'<p class="mm-draw">Placeholder · hand-drawn badge goes here</p>'}</div>
    <div class="body">
      <div><h2>${esc(r.full)}</h2><p class="meta">${esc(r.city)}</p></div>
      <dl class="mm-facts">
        <div><dt>Race day</dt><dd>${r.raceEnd?`${fmt(r.race)} – ${fmtY(r.raceEnd)}`:fmtY(r.race)}${r.raceEst?" (TBC)":""}</dd></div>
        <div><dt>Ways in</dt><dd>${esc(r.entry)}</dd></div>
        <div><dt>Entry fee</dt><dd>${esc(r.fee)}</dd></div>
      </dl>
      <div class="mm-tw"><table><thead><tr><th>Window</th><th>Dates</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>
      ${r.note?`<p class="mm-note">${esc(r.note)}</p>`:""}
      ${r.url?`<p><a class="mm-link" href="${esc(r.url)}" target="_blank" rel="noopener">Official entry page ↗</a></p>`:""}
    </div>`;
}

// ---- Calendar subscription ----
const FEED_HOST="axmzxphxcgwrsbkixmbg.supabase.co/functions/v1/majors-calendar";
let scope="all";
function feedPath(){
  const sel=[...state.races];
  return (scope==="sel"&&sel.length&&sel.length<RACES.length) ? `${FEED_HOST}?races=${sel.join(",")}` : FEED_HOST;
}
function renderSub(){
  const p=feedPath(), https="https://"+p, webcal="webcal://"+p;
  const partial=state.races.size<RACES.length;
  $("#mm-scope-sel").textContent=partial?`Races I've selected (${state.races.size})`:"Races I've selected";
  $("#mm-scope-sel").disabled=!partial; if(!partial&&scope==="sel") scope="all";
  root.querySelectorAll("[data-scope]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.scope===scope));
  const names=scope==="sel"?RACES.filter(r=>state.races.has(r.id)).map(r=>r.name).join(", "):"All nine Majors";
  $("#mm-sub-links").innerHTML=[
    ["Apple Calendar","iPhone, iPad and Mac",webcal],
    ["Google Calendar","Opens Google Calendar to add it",`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`],
    ["Outlook","Outlook.com and Microsoft 365",`https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(https)}&name=${encodeURIComponent("Marathon Majors")}`],
  ].map(([t,s,h])=>`<a class="mm-sub-link" href="${esc(h)}" target="_blank" rel="noopener"><b>${t} ↗</b><span>${s}</span></a>`).join("")+
  `<p class="mm-note" style="grid-column:1/-1">Includes: ${esc(names)}. Opening and closing days of each window, results days, payment deadlines and race days.</p>`;
  $("#mm-feed-url").value=https;
}
const subBtn=$("#mm-sub-btn"), subPanel=$("#mm-sub");
function toggleSub(open){ subPanel.hidden=!open; subBtn.setAttribute("aria-expanded",open); if(open) renderSub(); }
subBtn.addEventListener("click",()=>toggleSub(subPanel.hidden));
$("#mm-sub-close").addEventListener("click",()=>{toggleSub(false); subBtn.focus();});
subPanel.addEventListener("click",e=>{const b=e.target.closest("[data-scope]"); if(b&&!b.disabled){scope=b.dataset.scope; renderSub();}});
$("#mm-copy").addEventListener("click",()=>{
  const inp=$("#mm-feed-url"), btn=$("#mm-copy"), done=()=>{btn.textContent="Copied"; setTimeout(()=>btn.textContent="Copy",1800);};
  const fallback=()=>{inp.focus(); inp.select(); btn.textContent="Press ⌘C / Ctrl+C";};
  try{ navigator.clipboard.writeText(inp.value).then(done,fallback); }catch(e){ fallback(); }
});
$("#mm-feed-url").addEventListener("focus",e=>e.target.select());

function renderAll(){renderStamp();renderCards();renderChips();renderTimeline();renderDetail(); if(!subPanel.hidden) renderSub();}

// ---- Events ----
root.addEventListener("click",e=>{
  const all=e.target.closest("[data-all]"), chip=e.target.closest("[data-chip]"), st=e.target.closest("[data-status]");
  if(all){ state.races=state.races.size===RACES.length?new Set():new Set(RACES.map(r=>r.id)); save(); return renderAll(); }
  if(chip){ const id=chip.dataset.chip;
    if(state.races.size===RACES.length) state.races=new Set([id]); else state.races.has(id)?state.races.delete(id):state.races.add(id);
    if(!state.races.size) state.races=new Set(RACES.map(r=>r.id)); save(); return renderAll(); }
  if(st){ const k=st.dataset.status; state.statuses.has(k)?state.statuses.delete(k):state.statuses.add(k); save(); return renderAll(); }
  const pick=e.target.closest("[data-race],[data-r]");
  if(pick){ state.sel=pick.dataset.race||pick.dataset.r; save(); renderTimeline(); renderDetail();
    if(pick.closest("#mm-cards")) $("#mm-detail").scrollIntoView({behavior:"smooth",block:"nearest"}); }
});
const tip=document.createElement("div"); tip.className="mm mm-tip"; tip.hidden=true; document.body.appendChild(tip);
function info(r,i){ if(i==="race") return [`${r.full}: race day`, r.raceEnd?`${fmtY(r.race)} – ${fmt(r.raceEnd)}`:fmtY(r.race)+(r.raceEst?" (TBC)":"")];
  const ev=r.events[i]; return [`${r.name} · ${ev.k}`,(ev.e?`${fmtY(ev.s)} – ${fmtY(ev.e)}`:fmtY(ev.s))+` · ${ev.est?"expected":status(ev)}`];}
root.addEventListener("pointerover",e=>{const b=e.target.closest("[data-r]"); if(!b){tip.hidden=true;return}
  const r=RACES.find(x=>x.id===b.dataset.r), [t,d]=info(r,b.dataset.i==="race"?"race":+b.dataset.i);
  tip.innerHTML=`<b>${esc(t)}</b>${esc(d)}`; tip.hidden=false;
  const rc=b.getBoundingClientRect(); tip.style.left=Math.min(window.innerWidth-270,Math.max(8,rc.left))+"px"; tip.style.top=(rc.bottom+8)+"px";});
root.addEventListener("pointerout",e=>{const t=e.relatedTarget; if(!t||!t.closest||!t.closest("[data-r]")) tip.hidden=true;});
$("#mm-scroll").addEventListener("scroll",()=>tip.hidden=true,{passive:true});
window.addEventListener("scroll",()=>tip.hidden=true,{passive:true});

function scrollToToday(){const sc=$("#mm-scroll"), tl=$("#mm-tl"), lab=parseFloat(getComputedStyle(tl).getPropertyValue("--label"))||150;
  sc.scrollLeft=Math.max(0,(tl.scrollWidth-lab)*pct(TODAY_S)-sc.clientWidth*0.3);}

function use(data,live){ RACES=data.races; CHECKED=data.checked; LIVE=live;
  const ids=RACES.map(r=>r.id), saved=(store.races||[]).filter(id=>ids.includes(id));
  state.races=new Set(saved.length?saved:ids); renderAll(); requestAnimationFrame(scrollToToday); }

if(SNAPSHOT) use(shape(SNAPSHOT.races,SNAPSHOT.events,SNAPSHOT.meta),false);
load().then(d=>use(d,true)).catch(()=>{ if(!SNAPSHOT) $("#mm-cards").innerHTML='<p class="mm-note">Race dates could not be loaded. Refresh the page to try again.</p>'; });
})();

}
function boot(){
  if(!document.getElementById("mm-style")){
    var f=document.createElement("link"); f.rel="stylesheet"; f.href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"; document.head.appendChild(f);
    var s=document.createElement("style"); s.id="mm-style"; s.textContent=CSS; document.head.appendChild(s);
  }
  var hosts=document.querySelectorAll("#marathon-majors:not([data-mm-loaded]),[data-marathon-majors]:not([data-mm-loaded])");
  for(var i=0;i<hosts.length;i++){ hosts[i].setAttribute("data-mm-loaded","1"); hosts[i].innerHTML=MARKUP; run(); }
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();
})();
