# notes/ — the notebook entries

Each entry is one Markdown file **named by its date**: `YYYY-MM-DD.md`
(`2026-07-10.md`). Drop an Obsidian daily note in here **unedited** and commit —
no h1 to add, no front matter to add, no renaming.

**Discovery:** static hosting can't list a directory, so `notebook.html` lists this
folder through GitHub's public contents API, then fetches each file from the site's
own domain. That means entries appear **once pushed** (the API sees the committed
repo) — a brand-new local note won't show until it's committed and pushed (Pages is
live in ~30 s).

What the page does with a file:

- **Date = filename.** `2026-07-10.md` → shown as `2026-07-10`, and used to sort
  entries newest-first. Only files matching `YYYY-MM-DD.md` are picked up, so this
  README (and anything else) is ignored.
- **Body = the rest.** Blank lines split paragraphs; soft line-wraps inside a
  paragraph collapse to spaces. A leading `# heading` line is dropped (the date is
  the filename, so a title would just be noise), as is a leading YAML front-matter
  block. Other Markdown syntax is ignored — this is prose, not docs.

**Local preview** needs a server (the page `fetch`es), and shows whatever's currently
pushed: `python3 -m http.server`, then `http://localhost:8000/notebook.html`. The
other static pages still preview with `open`; this one doesn't.
