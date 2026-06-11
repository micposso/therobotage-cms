---
name: slides-to-pdf
description: Convert a ready-made HTML slide template into a print-ready PDF for sharing on LinkedIn (document / carousel posts). Use when the user has an HTML slide deck at social/slides/<name>/HTML and wants it turned into a PDF — e.g. "convert the warehouse-robots slides to PDF", "make a LinkedIn PDF from this slide HTML", "export the slides in social/slides/foo to PDF". The user provides the finished HTML with all content; this skill only renders it to PDF.
---

# Slides to PDF

Render a finished HTML slide deck into a multi-page PDF suitable for a LinkedIn
document (carousel) post. Each printed page becomes one slide.

The user supplies the complete HTML — do **not** write or rewrite slide content.
This skill's only job is the conversion. Run all commands from `frontend/`.

## Input / output layout

```
social/slides/<name>/
  HTML/        # input — the user's slide HTML (+ any local images/fonts)
  pdf/         # output — created by this skill
```

## Steps

1. **Identify the slide.** Use the `<name>` the user gave. If they did not name
   one, list `social/slides/*/` and use the most recently modified, or ask.

2. **Find the HTML file.** Look in `social/slides/<name>/HTML/`. Prefer
   `index.html`; otherwise use the single `*.html` file present. If there are
   several and it is ambiguous, ask which one.

3. **Sanity-check the template for LinkedIn.** Open the HTML and confirm it is
   built for slide output (see "Template requirements" below). If the `@page`
   size or `page-break-after` rules are missing, the PDF will render as default
   Letter pages — tell the user and offer to add the print CSS, but only edit if
   they agree (the content itself stays untouched).

4. **Convert.** Create the `pdf/` folder and run the converter:

   ```bash
   node .claude/skills/slides-to-pdf/html-to-pdf.mjs \
     social/slides/<name>/HTML/index.html \
     social/slides/<name>/pdf/<name>.pdf
   ```

   The script auto-detects Chrome or Edge (Windows) and uses headless
   `--print-to-pdf` — no npm install, no Chromium download. Override the browser
   with the `CHROME_PATH` env var if needed.

5. **Verify and report.** Confirm the output file exists and is non-empty, then
   report the path. Mention the slide/page count so the user can sanity-check it
   matches their deck.

## Template requirements (for the user's HTML)

For clean LinkedIn slides, the HTML should:

- Set the page box and kill margins:
  `@page { size: 1080px 1080px; margin: 0; }`
  Use `1080px 1080px` for square (1:1) or `1080px 1350px` for portrait (4:5) —
  both are LinkedIn-recommended. Keep every slide the same size.
- Make each slide exactly one page and break after it:
  `.slide { width: 1080px; height: 1080px; page-break-after: always; }`
  (no break after the last slide).
- Reference images and fonts with **relative paths** inside the `HTML/` folder so
  they load over `file://` during rendering.
- Inline or self-host fonts; web fonts may not finish loading. The renderer
  waits up to ~10s for assets before printing.

## Notes

- One PDF page = one carousel slide. A 6-slide deck yields a 6-page PDF.
- LinkedIn document posts accept PDF directly; upload via "Add a document".
- If colors look washed out, ensure the template does not rely on print color
  adjustments; add `-webkit-print-color-adjust: exact; print-color-adjust: exact;`
  to the slide background elements.
