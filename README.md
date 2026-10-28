# Graham Farmer — Executive Portfolio

A static site with no build step. Upload this folder as-is to GitHub Pages, Netlify (drag and drop) or Cloudflare Pages.

## Structure
- `index.html` — the full site
- `css/styles.css`, `js/main.js`
- `images/` — headshot, education and feature photos, plus document thumbnails
- `images/gallery/` — full-size gallery photos (opened in the viewer); `images/gallery/thumbs/` — small versions shown in the grid

All photos are converted to JPG, sized for the web, and stripped of location and camera metadata.
- `documents/` — resume, technical paper and diploma PDFs (linked for viewing and download)

## Domain: grahamjfarmer.com
Already set up in this package: the `CNAME` file (GitHub Pages reads it), `sitemap.xml`, `robots.txt`, the canonical link and the link-preview image (`images/social-card.jpg`).

DNS records to add at your registrar:
- A records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- CNAME for `www`: `<your-github-username>.github.io`

Then in GitHub, go to Settings → Pages, confirm the custom domain shows grahamjfarmer.com, and tick **Enforce HTTPS** once it's available.

## Updating documents
Replace a PDF in `documents/` but keep the same filename, and every link keeps working.

## Adding a gallery photo
Copy any `<figure data-group="...">` block in the Portfolio section and change the file names and caption. Use `data-group="utility"` or `data-group="drilling"` so the filter buttons pick it up.
