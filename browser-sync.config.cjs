const { includePartials } = require("./scripts/partials.mjs");

// Watch compiled CSS so the browser refreshes only after Sass finishes.
module.exports = {
  server: ".",
  files: ["*.html", "partials/*.html", "styles.css", "assets/**/*"],
  // Fill in the shared header and footer, exactly as the production build does.
  rewriteRules: [
    {
      match: /^[ \t]*<!-- include: [\w-]+ -->\n?/gm,
      fn: (req, res, placeholder) => {
        const url = req.url.split("?")[0];
        return includePartials(
          placeholder,
          url === "/" ? "index.html" : url.slice(1),
        );
      },
    },
  ],
  port: Number(process.env.PORT) || 3000,
  listen: "127.0.0.1",
  open: false,
  ui: false,
  notify: false,
  ghostMode: false,
  online: false,
  injectChanges: false,
  reloadDebounce: 150,
};
