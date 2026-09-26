// Watch compiled CSS so the browser refreshes only after Sass finishes.
module.exports = {
  server: ".",
  files: ["*.html", "styles.css", "assets/**/*"],
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
