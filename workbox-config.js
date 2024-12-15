module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{js,svg,png,ico,html,json,ttf}"],
  swDest: "dist/sw.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
};
