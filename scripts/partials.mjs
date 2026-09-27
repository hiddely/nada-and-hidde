import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Shared page pieces, written once in partials/ and placed into every page
// wherever it says <!-- include: name -->. Used by the build and dev server.
const partials = fileURLToPath(new URL("../partials/", import.meta.url));

export function includePartials(html, page) {
  return html.replace(
    /^([ \t]*)<!-- include: ([\w-]+) -->\n?/gm,
    (_, indent, name) =>
      // Read on every request so partial edits show up without a restart.
      readFileSync(`${partials}${name}.html`, "utf8")
        // Mark the current page in the navigation.
        .replace(`href="${page}"`, `href="${page}" aria-current="page"`)
        // Indent to match the placeholder.
        .replace(/^(?=.)/gm, indent),
  );
}
