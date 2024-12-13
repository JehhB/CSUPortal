module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,svg,png,ico,html,json}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};