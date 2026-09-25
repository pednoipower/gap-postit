#!/usr/bin/env python3
"""
docs/manual.md  ->  docs/manual.pdf

    python3 tools/manual-pdf.py

The manual is the one thing at the session that may have to work with no
laptop at all, so it has to print. There is no pandoc and no markdown library
on this machine, and nothing in this project is ever fetched from the
internet — so this walks the small amount of markdown the manual actually
uses, wraps it in the workshop's own typefaces, and hands it to Chrome, which
is already here for everything else.

Everything is measured in one page's worth of ink: the point sizes are set so
the whole manual lands in three pages, which is what it was written to be.
"""
import html, os, re, shutil, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "docs", "manual.md")
OUT  = os.path.join(ROOT, "docs", "manual.pdf")
CHROME = ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          "/Applications/Chromium.app/Contents/MacOS/Chromium",
          "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge")

# ---- inline -----------------------------------------------------------------
# Code spans are pulled out first so nothing inside them is read as markup —
# the SQL line in step 1 contains <a long phrase>, which is not a link.
def inline(s):
    spans = []
    def keep(m):
        spans.append(html.escape(m.group(1)))
        return "\x00%d\x00" % (len(spans) - 1)
    s = re.sub(r"`([^`]+)`", keep, s)
    s = html.escape(s)
    s = s.replace("&lt;kbd&gt;", "<kbd>").replace("&lt;/kbd&gt;", "</kbd>")
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    def em(m):
        t = m.group(1)
        thai = re.search(r"[\u0E00-\u0E7F]", t)
        return '<i class="say">%s</i>' % t if thai else "<i>%s</i>" % t
    s = re.sub(r"(?<![*\w])\*([^*]+)\*(?!\*)", em, s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    return re.sub(r"\x00(\d+)\x00", lambda m: "<code>%s</code>" % spans[int(m.group(1))], s)

def cells(row):
    return [c.strip() for c in row.strip().strip("|").split("|")]

# ---- blocks -----------------------------------------------------------------
def convert(md):
    lines, out, i = md.split("\n"), [], 0
    while i < len(lines):
        ln = lines[i]

        if ln.startswith("```"):                                   # fenced code
            i += 1; buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(html.escape(lines[i])); i += 1
            i += 1
            out.append("<pre>%s</pre>" % "\n".join(buf)); continue

        if re.match(r"^---+$", ln):                                # rule
            out.append("<hr>"); i += 1; continue

        m = re.match(r"^(#{1,6}) (.*)$", ln)                       # heading
        if m:
            n = len(m.group(1))
            out.append("<h%d>%s</h%d>" % (n, inline(m.group(2)), n)); i += 1; continue

        if ln.startswith("|"):                                     # table
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(lines[i]); i += 1
            body = [r for r in rows if not re.match(r"^\|[\s:|]*-[\s:\-|]*\|$", r)]
            head, rest = cells(body[0]), body[1:]
            # A table whose first column is only numbers is the run of show;
            # nothing else should have its first column greyed back.
            firsts = [cells(r)[0] for r in (body[1:] if any(head) else body[1:])]
            nums = firsts and all(re.fullmatch(r"[\d\u2013\u2014\-\s]+", c or "x") for c in firsts)
            t = ['<table class="nums">' if nums else "<table>"]
            if any(head):                  # the links table has no headings
                t.append("<thead><tr>%s</tr></thead>" %
                         "".join("<th>%s</th>" % inline(c) for c in head))
            else:
                rest = body[1:]
            t.append("<tbody>")
            for r in rest:
                t.append("<tr>%s</tr>" % "".join("<td>%s</td>" % inline(c) for c in cells(r)))
            t.append("</tbody></table>")
            out.append("".join(t)); continue

        m = re.match(r"^(\d+)\. (.*)$", ln)                        # numbered list
        if m:
            items, start = [], int(m.group(1))
            while i < len(lines):
                m = re.match(r"^(\d+)\. (.*)$", lines[i])
                if not m: break
                buf, i = [m.group(2)], i + 1
                while i < len(lines) and re.match(r"^\s{2,}\S", lines[i]):
                    buf.append(lines[i].strip()); i += 1
                items.append(" ".join(buf))
            out.append('<ol start="%d">%s</ol>' % (start,
                       "".join("<li>%s</li>" % inline(x) for x in items))); continue

        if ln.startswith("- "):                                    # bullet list
            items = []
            while i < len(lines) and lines[i].startswith("- "):
                buf, i = [lines[i][2:]], i + 1
                while i < len(lines) and re.match(r"^\s{2,}\S", lines[i]):
                    buf.append(lines[i].strip()); i += 1
                items.append(" ".join(buf))
            out.append("<ul>%s</ul>" % "".join("<li>%s</li>" % inline(x) for x in items))
            continue

        if not ln.strip():                                         # blank
            i += 1; continue

        buf = []                                                   # paragraph
        while i < len(lines) and lines[i].strip() and not re.match(
                r"^(#|\||-\s|\d+\.\s|```|---+$)", lines[i]):
            buf.append(lines[i].strip()); i += 1
        out.append("<p>%s</p>" % inline(" ".join(buf)))
    return "\n".join(out)

# ---- the page ---------------------------------------------------------------
# The workshop's own typefaces, carried into the file rather than linked.
# `font-display: swap` means a linked face can lose the race with the print
# and the whole manual comes out in a substitute; a data URI cannot.
def fonts_css():
    import base64
    d = os.path.join(ROOT, "assets")
    css = open(os.path.join(d, "fonts.css"), encoding="utf-8").read()
    def inline(m):
        f = os.path.join(d, m.group(1))
        if not os.path.exists(f):
            return m.group(0)
        b = base64.b64encode(open(f, "rb").read()).decode()
        return "url(data:font/woff2;base64,%s)" % b
    return re.sub(r"url\((fonts/[^)]+\.woff2)\)", inline, css)

CSS = """
@page { size: A4; margin: 13mm 14mm 12mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body {
  font-family: "Anuphan", "Sarabun", system-ui, sans-serif;
  font-size: 9.1pt; line-height: 1.42; color: #141a18; margin: 0;
  font-variant-numeric: tabular-nums;
}
h1 {
  font-family: "Bai Jamjuree", "Anuphan", sans-serif;
  font-size: 19pt; line-height: 1.12; margin: 0 0 3mm; color: #173f35;
  letter-spacing: -.01em;
}
h2 {
  font-family: "Bai Jamjuree", "Anuphan", sans-serif;
  font-size: 11.6pt; margin: 5.5mm 0 1.6mm; color: #173f35;
  border-bottom: .6pt solid #cfdcd5; padding-bottom: 1mm;
  break-after: avoid;
}
p { margin: 0 0 2mm; }
b, strong { font-weight: 600; color: #0f2a23; }
i, em { font-style: italic; }
/* the lines to say out loud, which are Thai: Anuphan has no italic, so an
   italic here is a slant the machine drew. Upright, in the canopy green, with
   the weight to carry it. */
i.say { font-style: normal; font-weight: 600; color: #14603f; }
a { color: #173f35; text-decoration: none; border-bottom: .4pt solid #b9cec4; }
hr { border: 0; border-top: .6pt solid #e2e9e5; margin: 4mm 0; }
ul, ol { margin: 0 0 2mm; padding-left: 5.2mm; }
li { margin: 0 0 1mm; }
li::marker { color: #6f8c80; }
code {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: .88em; background: #eef3f0; border-radius: 2pt;
  padding: .4pt 1.2pt; color: #14342b;
}
pre {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 8.4pt; background: #0f2a23; color: #dfeae4;
  padding: 2.2mm 3mm; border-radius: 0 3mm 0 3mm; margin: 0 0 2.5mm;
  white-space: pre-wrap; break-inside: avoid;
}
kbd {
  font-family: inherit; font-size: .86em; font-weight: 600;
  border: .5pt solid #b9cec4; border-bottom-width: 1.2pt;
  border-radius: 2.4pt; padding: .2pt 1.4pt; background: #f5f7f5;
  white-space: nowrap;
}
table {
  width: 100%; border-collapse: collapse; margin: 0 0 3mm;
  font-size: 8.5pt; break-inside: auto;
}
th {
  text-align: left; font-weight: 600; color: #173f35; background: #eef3f0;
  border-bottom: .8pt solid #cfdcd5; padding: 1.3mm 2mm;
}
td { padding: 1.3mm 2mm; border-bottom: .5pt solid #e2e9e5; vertical-align: top; }
tr { break-inside: avoid; }
/* the run of show only: its first column is slide numbers, which should sit
   back. In the other tables the first column is the sentence that matters. */
table.nums tbody td:first-child { color: #6f8c80; white-space: nowrap; }
"""

def build_html(md):
    return ("<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
            "<title>The Missing Piece — how to run it</title>"
            "<style>%s</style><style>%s</style></head><body>%s</body></html>"
            % (fonts_css(), CSS, convert(md)))

def main():
    md = open(SRC, encoding="utf-8").read()
    page = build_html(md)
    # `--html` leaves the page behind instead of printing it: for checking the
    # typography in a browser, or for printing by hand from one.
    if "--html" in sys.argv:
        where = os.path.join(ROOT, "docs", "manual-print.html")
        open(where, "w", encoding="utf-8").write(page)
        print("wrote " + os.path.relpath(where, ROOT))
        return
    # written beside the fonts it asks for, removed once Chrome has read it
    tmp = os.path.join(ROOT, "docs", ".manual-print.html")
    open(tmp, "w", encoding="utf-8").write(page)
    chrome = next((c for c in CHROME if os.path.exists(c)), None) or shutil.which("chromium")
    if not chrome:
        os.remove(tmp)
        sys.exit("No Chrome, Chromium or Edge found — open docs/.manual-print.html and print to PDF by hand.")
    prof = tempfile.mkdtemp(prefix="manualpdf")
    if os.path.exists(OUT):
        os.remove(OUT)
    # Headless Chrome writes the PDF and then, on this machine, sits there
    # rather than exiting. So: start it, wait for the file to appear and stop
    # growing, and close it ourselves.
    proc = subprocess.Popen(
        [chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         "--allow-file-access-from-files", "--user-data-dir=" + prof,
         "--virtual-time-budget=4000", "--print-to-pdf=" + OUT, "file://" + tmp],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        size, still = -1, 0
        for _ in range(120):                       # up to a minute
            time.sleep(.5)
            if proc.poll() is not None:
                break
            now = os.path.getsize(OUT) if os.path.exists(OUT) else -1
            if now > 0 and now == size:
                still += 1
                if still >= 3:                     # written and finished
                    break
            else:
                still = 0
            size = now
    finally:
        if proc.poll() is None:
            proc.terminate()
            try: proc.wait(timeout=10)
            except subprocess.TimeoutExpired: proc.kill()
        shutil.rmtree(prof, ignore_errors=True)
        os.remove(tmp)
    if not os.path.exists(OUT):
        sys.exit("Chrome did not write the PDF.")
    raw = open(OUT, "rb").read()
    pages = len(re.findall(rb"/Type\s*/Page[^s]", raw))
    print("docs/manual.pdf — %d pages, %.0f KB" % (pages, os.path.getsize(OUT) / 1024))

if __name__ == "__main__":
    main()
