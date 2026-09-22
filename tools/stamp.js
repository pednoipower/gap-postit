#!/usr/bin/env node
/* ============================================================================
   STAMP — run before every deploy:   node tools/stamp.js

   GitHub Pages (and phones) cache files for a while. If someone has the site
   open from before a deploy, they keep running old scripts against a new
   database and new pages, and the control panel, projector and phones stop
   agreeing with each other. Stamping every asset URL with a build id forces
   every page to fetch fresh copies the moment it reloads.
   ========================================================================== */
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
const build = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");   // e.g. 202609221405

for (const f of fs.readdirSync(root).filter(f => f.endsWith(".html"))) {
  const p = path.join(root, f);
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(/(["'])assets\/([A-Za-z0-9_.-]+\.(?:js|css))(?:\?v=[^"']*)?\1/g, `$1assets/$2?v=${build}$1`);
  fs.writeFileSync(p, s);
}
fs.writeFileSync(path.join(root, "assets", "version.js"), `window.BUILD = "${build}";\n`);
console.log("stamped build " + build);
