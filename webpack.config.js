const path = require("path");
const webpack = require('webpack');
const htmlWebpackPlugin = require("html-webpack-plugin");
const clearWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	entry: {
		vendor: './src/vendor.ts',
		main: './src/main.ts',
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
				test: /\.html$/,
				use: 'html-loader'
			}
		]
	},
	//optimization:{
	//	splitChunks:{
	//		cacheGroups:{
	//			commons:{
	//				test:/[\\/]node_modules[\\/]/,
	//				name:'vendor',
	//				chunks:'all'
	//			}
	//		}
	//	}
	//},
	plugins: [
		new clearWebpackPlugin(['dist'], {
			verbose: false
		}),
		new htmlWebpackPlugin({
			template: "./src/index.html"
		})
	]
}