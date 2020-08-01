const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const clearWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");

module.exports = (env, argv) => {
	var isDev = argv.mode == "development";
	var output = "dist";
	
	
	var currentTime = new Date().toISOString();
	var data = `export function getVersion() {return "${currentTime}"}`;
	fs.writeFile("./src/version.ts", data, () => {});
	
	var config = {
		entry: {
			vendor: './src/vendor.ts',
			main: ['./src/main.ts', './src/main.scss'],
		},
		output: {
			filename: './[name].[hash].js',
			path: path.resolve(__dirname, output)
		},
		resolve: {
			extensions: ['.ts', '.js', '.sass']
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: [{
						loader: 'awesome-typescript-loader',
						options: {
							silent: true,
							useCache: true
						}
					}]
				},
				{
					test: /\.(svg|eot|woff2?|ttf|jpg|obj|mtl|png)/,
					use: 'file-loader'
				},
				{
					test: /\.html$/,
					use: 'html-loader'
				},
				{
					test: /\.(frag|vert)/,
					use: 'html-loader'
				},
				{
					test: /\.s?css$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				}
			]
		},
		optimization: {
			minimize: !isDev,
			splitChunks: {
				cacheGroups: {
					commons: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendor',
						chunks: 'all'
					}
				}
			}
		},
		mode: argv.mode,
		stats: {
			children: false,
			chunks: false,
			modules: false,
			warnings: false,
			hash: false,
			assets: false,
			colors: true,
			version: false,
			timings: false,
			chunkModules: false
		},
		devServer: {
			stats: {
				modules: false,
				warnings: false,
				children: false,
				assets: false
			}
		},
		plugins: [
			new webpack.LoaderOptionsPlugin({
				options: {
					context: process.cwd()
				}
			}),
			new clearWebpackPlugin([output], {
				verbose: false
			}),
			new htmlWebpackPlugin({
				template: "./src/index.html"
			})
		]
	};
	
	if(isDev) {
		config.devtool = "source-map";
	}
	
	return config;
}