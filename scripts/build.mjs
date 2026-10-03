import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { minify } from "html-minifier-terser";
import { compile } from "sass";
import sharp from "sharp";
import { photoNames } from "./gallery.mjs";
import { includePartials } from "./partials.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");

// Only generated files live in dist. Never modify the editable source files.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// The full-size photos stay behind; smaller copies are made below.
await cp(path.join(root, "assets"), path.join(output, "assets"), {
  recursive: true,
  filter: (source) => !source.startsWith(path.join(root, "assets/photos/")),
});
await cp(path.join(root, ".nojekyll"), path.join(output, ".nojekyll"));

// Lossless WebP keeps the fine lines of the venue illustration intact.
const illustration = "assets/dahab-island-palace.png";
const optimizedIllustration = "assets/dahab-island-palace.webp";
await sharp(path.join(root, illustration))
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(output, optimizedIllustration));
await rm(path.join(output, illustration));

// Gallery photos are shown 250px high, so 500px stays sharp on high-density
// screens. rotate() applies the camera orientation before the metadata is lost.
const photoHeight = 500;
await mkdir(path.join(output, "assets/photos"), { recursive: true });
const photos = await Promise.all(
  photoNames().map(async (name) => {
    const src = `assets/photos/${path.parse(name).name}.webp`;
    const { width, height } = await sharp(
      path.join(root, "assets/photos", name),
    )
      .rotate()
      .resize({ height: photoHeight, withoutEnlargement: true })
      .webp({ quality: 75, effort: 6 })
      .toFile(path.join(output, src));
    // Sizes as shown, so the strip keeps its layout while photos load.
    return { name, src, width: Math.round(width / 2), height: height / 2 };
  }),
);

const pages = (await readdir(root)).filter((name) => name.endsWith(".html"));
for (const page of pages) {
  const source = await readFile(path.join(root, page), "utf8");
  const html = await minify(
    includePartials(source, page, { photos }).replaceAll(
      illustration,
      optimizedIllustration,
    ),
    {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      collapseBooleanAttributes: true,
      removeRedundantAttributes: true,
    },
  );
  await writeFile(path.join(output, page), html);
}

// Compile SCSS directly; production never relies on local generated CSS.
const { css } = compile(path.join(root, "styles.scss"), {
  style: "compressed",
  sourceMap: false,
  charset: false,
});
await writeFile(path.join(output, "styles.css"), css);

const files = [...pages, "styles.scss", illustration];
let before = 0;
let after = 0;
for (const file of files) {
  before += (await stat(path.join(root, file))).size;
  after += (
    await stat(
      path.join(
        output,
        file === illustration
          ? optimizedIllustration
          : file === "styles.scss"
            ? "styles.css"
            : file,
      ),
    )
  ).size;
}
console.log(`Built ${pages.length} pages in dist/`);
console.log(
  `HTML, CSS & illustration: ${(before / 1024).toFixed(1)} kB → ${(after / 1024).toFixed(1)} kB (${Math.round((1 - after / before) * 100)}% smaller)`,
);

let photosBefore = 0;
let photosAfter = 0;
for (const { name, src } of photos) {
  photosBefore += (await stat(path.join(root, "assets/photos", name))).size;
  photosAfter += (await stat(path.join(output, src))).size;
}
console.log(
  `${photos.length} gallery photos: ${(photosBefore / 1024 / 1024).toFixed(1)} MB → ${(photosAfter / 1024 / 1024).toFixed(1)} MB`,
);
