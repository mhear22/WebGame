const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const clearWebpackPlugin = require("clean-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
	entry: {
		main: ['./src/main.ts', './src/main.sass'],
		vendor: './src/vendor.ts'
	},
	output: {
		filename: './[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'eval',
	resolve: {
		extensions: ['.ts', '.js', '.sass']
	},
	stats: {
		children: false,
		chunks: false,
		modules: false,
		warnings: false
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
				test: /\.(svg|eot|woff2?|ttf)/,
				use: 'file-loader'
			},
			{
				test: /\.sass$/,
				use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('style.css'),
		new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "vendor.js" }),
		new clearWebpackPlugin(['dist'], {
			verbose: false
		}),
		new htmlWebpackPlugin({
			template: "./src/index.html"
		})
	]
}