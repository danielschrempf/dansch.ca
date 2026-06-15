# assets/

Static media for the site.

- `svg/` — vector logos & icons (`.svg`). The canonical logo is `svg/logo.svg`.
- `img/` — raster images (`.jpg`, `.png`, `.webp`). Export at the size you'll
  actually display and compress before committing (e.g. squoosh.app). Git keeps
  every version of a binary forever, so avoid re-committing large files
  repeatedly — it permanently bloats the repo.

## Two ways to use an SVG logo

**A) Reference the file** — simplest, good with `<img>`:

```html
<img src="assets/svg/logo.svg" alt="dansch" width="180">
```

The catch: an `<img>`-loaded SVG can't inherit the page's text colour, so it
won't follow dark mode.

**B) Inline the path data** — paste the `<svg>…</svg>` straight into the HTML.
There's more markup to copy, but in return the logo can:

- inherit the text colour (`fill: currentColor`, set in `.logo`) → flips in dark mode,
- be styled or animated with CSS,
- load with zero extra network requests.

This is what `about.html` and `cv.html` do — see the commented `<svg class="logo">`
block in `about.html`. Keep the inline copies and `svg/logo.svg` in sync when you
finalise the path.
