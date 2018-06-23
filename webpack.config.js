const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const clearWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	entry: {
		vendor: './src/vendor.ts',
		main: ['./src/main.ts', './src/main.sass'],
	},
	output: {
		filename: './[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map',
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
				test: /\.(svg|eot|woff2?|ttf)/,
				use: 'file-loader'
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			},
			{
				test: /\.sass$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	},
	optimization: {
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
	mode: 'development',
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
			modules:false,
			warnings:false,
			children:false,
			assets:false
		}
	},
	plugins: [
		new clearWebpackPlugin(['dist'], {
			verbose: false
		}),
		new htmlWebpackPlugin({
			template: "./src/index.html"
		})
	]
}