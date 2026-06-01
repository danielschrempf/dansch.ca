# fonts/

Web font files live here. Reference them from `styles.css` with `@font-face`.

## woff2 or woff?

Use **`.woff2`**. It's better-compressed and supported by every browser since
~2017 (Chrome, Edge, Firefox, Safari 10+). The older `.woff` only matters for
genuinely ancient browsers (IE 11) — you almost certainly don't need it. If you
want a belt-and-suspenders fallback, list both `src` formats and the browser
picks `woff2` on its own.

## Add a font

1. Drop the file here, e.g. `fonts/diatype.woff2`.
2. Declare it in `styles.css`:

   ```css
   @font-face {
     font-family: "Diatype";
     src: url("fonts/diatype.woff2") format("woff2");
     font-weight: 400;
     font-display: swap;   /* show fallback text immediately, swap in when loaded */
   }
   ```

3. Use it — prepend to the stack in `body`:

   ```css
   body { font-family: "Diatype", ui-monospace, monospace; }
   ```

With **static** fonts that's one `@font-face` block per weight/style (regular,
bold, italic…), each pointing at its own file.

## Variable fonts (recommended)

A variable font packs the whole weight — and often width / slant / optical-size
— range into a **single** `.woff2`. Same static hosting (just one more file),
but one download instead of several, continuous weights (not only 400/700), and
you can even animate weight with CSS. Wire it up with one block that declares
the supported *range*:

```css
@font-face {
  font-family: "Diatype";
  src: url("fonts/diatype-variable.woff2") format("woff2");
  font-weight: 100 900;     /* the range the file covers, not one value */
  font-stretch: 75% 125%;   /* only if it has a width axis */
  font-display: swap;
}
```

Then pick any value in range — `font-weight: 430;` — or reach custom/extra axes
with `font-variation-settings: "wght" 430, "opsz" 14;`. Prefer variable unless
you'd only ever use a single weight (then one static file is smaller). Heads-up:
some families ship italics as a separate variable file rather than an `ital`
axis.

Commercial fonts need a **webfont licence** — check before committing the file
to a public repo.
