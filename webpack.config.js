const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	// Development mode for Webpack
	mode: "development",

	// Entry point for the compilation
	entry: "./src/index.js",

	// Extract css to separate file
	plugins: [new MiniCssExtractPlugin()],

	// Module config for specific loading
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/inline",
			},
		],
	},

	// Output config
	output: {
		path: path.resolve(__dirname, "dist"),
		publicPath: "",
	},

	// Use source map for debugging
	devtool: "inline-source-map",

	// Dev server config
	devServer: {
		// Enable webpack hot module replacement without reloading, when possible
		hot: false,
		// Open browser on server start
		open: false,
		// Statit directory for non-compilable items
		static: {
			directory: path.join(__dirname, "public"),
		},
	},
};
