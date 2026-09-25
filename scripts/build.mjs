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
import CleanCSS from "clean-css";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");

// Only generated files live in dist. Never modify the editable source files.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(root, "assets"), path.join(output, "assets"), {
  recursive: true,
});
await cp(path.join(root, ".nojekyll"), path.join(output, ".nojekyll"));

// Lossless WebP keeps the fine lines of the venue illustration intact.
const illustration = "assets/dahab-island-palace.png";
const optimizedIllustration = "assets/dahab-island-palace.webp";
await sharp(path.join(root, illustration))
  .webp({ lossless: true, effort: 6 })
  .toFile(path.join(output, optimizedIllustration));
await rm(path.join(output, illustration));

const pages = (await readdir(root)).filter((name) => name.endsWith(".html"));
for (const page of pages) {
  const source = await readFile(path.join(root, page), "utf8");
  const html = await minify(
    source.replaceAll(illustration, optimizedIllustration),
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

const css = await readFile(path.join(root, "styles.css"), "utf8");
const result = new CleanCSS({ level: 1 }).minify(css);
if (result.errors.length) throw new Error(result.errors.join("\n"));
await writeFile(path.join(output, "styles.css"), result.styles);

const files = [...pages, "styles.css", illustration];
let before = 0;
let after = 0;
for (const file of files) {
  before += (await stat(path.join(root, file))).size;
  after += (
    await stat(
      path.join(output, file === illustration ? optimizedIllustration : file),
    )
  ).size;
}
console.log(`Built ${pages.length} pages in dist/`);
console.log(
  `HTML, CSS & illustration: ${(before / 1024).toFixed(1)} kB → ${(after / 1024).toFixed(1)} kB (${Math.round((1 - after / before) * 100)}% smaller)`,
);
