import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// The home page photo strip, made from every image in assets/photos/. Placed
// wherever a page says <!-- include: gallery -->.
const folder = fileURLToPath(new URL("../assets/photos/", import.meta.url));

export const photoNames = () =>
  readdirSync(folder)
    .filter((name) => /\.(jpe?g|png|webp)$/i.test(name))
    .sort();

const icons = {
  prev: '<path d="M15 5l-7 7 7 7" />',
  next: '<path d="M9 5l7 7-7 7" />',
  pause: '<path d="M9 5v14M15 5v14" />',
};

const button = (action, label) =>
  `    <button type="button" data-gallery="${action}" aria-label="${label}">\n` +
  `      <svg viewBox="0 0 24 24" aria-hidden="true">${icons[action]}</svg>\n` +
  `    </button>\n`;

// The build passes the resized photos with their sizes. During development
// the originals are shown as they are.
export function galleryHtml(
  photos = photoNames().map((name) => ({ src: `assets/photos/${name}` })),
) {
  const images = photos
    .map(({ src, width, height }) =>
      width
        ? `    <img src="${src}" width="${width}" height="${height}" alt="" loading="lazy" decoding="async" />\n`
        : `    <img src="${src}" alt="" />\n`,
    )
    .join("");
  return (
    `<section class="gallery" aria-label="Photos of Nada and Hidde">\n` +
    `  <div class="gallery-track" tabindex="0">\n${images}  </div>\n` +
    `  <div class="gallery-controls" hidden>\n` +
    button("prev", "Previous photos") +
    button("pause", "Pause slideshow") +
    button("next", "Next photos") +
    `  </div>\n` +
    `</section>\n`
  );
}
