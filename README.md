# dansch.ca

The dansch landing page — a single static `index.html`, no build step, no
framework, no JavaScript dependency — just a raw, plain-text ASCII aesthetic.

## Edit

Open `index.html` and change the text inside the `<pre>` block. The ASCII
header is the dansch logo; the `<` and `>` characters in it are escaped as
`&lt;` / `&gt;` because `<pre>` still parses HTML.

## Preview locally

Just open the file in a browser:

```sh
open index.html
```

## Deploy (GitHub Pages)

1. Push to GitHub.
2. Repo Settings → Pages → Source: `Deploy from a branch` → branch `main`, folder `/ (root)`.
3. Custom domain is set via the `CNAME` file (`dansch.ca`) — also confirm it under Settings → Pages.
4. At your domain registrar, point `dansch.ca` at GitHub Pages:
   - Apex `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (optional) `www` `CNAME` → `<username>.github.io`
5. Enable “Enforce HTTPS” once the certificate provisions.
