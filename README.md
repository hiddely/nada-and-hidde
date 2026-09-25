# Nada & Hidde — our wedding

A four-page wedding website built with plain HTML and CSS. Readable source files, with a Node build for the published site. No browser JavaScript, tracking, password, or RSVP form.

## Getting started

Install Node.js 24, then run:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Edit the HTML files or `styles.scss` and refresh your browser to see changes. The development server watches SCSS and recompiles it when you save.

## Commands

- `npm run dev` — compile SCSS, watch for style edits, and serve the site locally.
- `npm run styles` — compile SCSS once for local use.
- `npm run format` — add consistent indentation and line breaks with Prettier.
- `npm run format:check` — check formatting without changing files.
- `npm run build` — generate a production site in `dist/`.
- `npm run preview` — serve `dist/` locally after building.

Stop the dev server before starting preview; both use port 3000.

## Edit

- `index.html`: introduction, wedding date, and venue.
- `travel.html`: airports, transport, and accommodation.
- `discover.html`: sightseeing, restaurants, and itinerary information.
- `faqs.html`: frequently asked questions, using native HTML disclosure controls.
- `styles.scss`: shared layout and colours, organized into labelled sections with nested selectors. Colours, fonts, and responsive breakpoints are near the top. `styles.css` is generated and should not be edited.
- `assets/dahab-island-palace.png`: supplied venue illustration, shown without altering the original.

The wedding date is intentionally marked “Date to be announced” until confirmed. The three-day itinerary has not been supplied, so guests are invited to contact the couple for it. “Hilton Airport Hotel” is listed as Hilton Cairo Heliopolis, the Hilton near Cairo International Airport; confirm this is the intended hotel.

## Build and publish

Edit the files in the project root, **not `dist/`**. The generated directory is ignored by Git and recreated on every build.

The Node build in `scripts/build.mjs`:

- Minifies each root HTML page and compiles SCSS into compressed CSS.
- Converts the venue PNG into a lossless WebP and updates the published HTML to use it.
- Copies the remaining assets into `dist/`.
- Reports the reduction in file size.

The original illustration and readable source files stay unchanged. The local generated `styles.css` and production `dist/` directory are ignored by Git. The build uses [HTML Minifier Terser](https://github.com/terser/html-minifier-terser), [Dart Sass](https://sass-lang.com/documentation/js-api/functions/compile/), and [Sharp](https://sharp.pixelplumbing.com/api-output/).

Run `npm run format` before committing. Pushing to `main` triggers `.github/workflows/pages.yml`, which installs locked dependencies, checks formatting, builds, and deploys only `dist/` to GitHub Pages. The repository's Pages source must be **GitHub Actions**.

All site links are relative so the site works under a GitHub Pages repository URL. New root-level `.html` files are automatically included in the build; add their navigation links to the other pages too.

## Content references

- Venue: https://www.arabiaweddings.com/cairo/vendors/venues/dahab-island-palace
- Apartments: https://lemonspaces.com/
- Hilton: https://www.hilton.com/en/hotels/caihehi-hilton-cairo-heliopolis/
- Marriott: https://www.marriott.com/en-us/hotels/caieg-cairo-marriott-hotel/overview/
- Ritz-Carlton: https://www.ritzcarlton.com/en/hotels/cairz-the-nile-ritz-carlton-cairo/overview/

Other recommendations were supplied by the couple. Hotel links lead directly to the providers; no booking arrangements or rates are implied.
