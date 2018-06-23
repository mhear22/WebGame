const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const clearWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
	entry: {
		vendor: './src/vendor.ts',
		main: ['./src/main.ts', './src/main.sass' ],
	},
	output: {
		filename: './[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.ts', '.js', '.sass']
	},
	stats: {
		children: false,
		chunks: false,
		modules: false,
		warnings: false,
		hash:false
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
				test:/\.sass$/,
				use:['style-loader','css-loader','sass-loader']
			}
		]
	},
	optimization:{
		splitChunks:{
			cacheGroups:{
				commons:{
					test:/[\\/]node_modules[\\/]/,
					name:'vendor',
					chunks:'all'
				}
			}
		}
	},
	mode:'development',
	serve: {
		port:8080,
		logLevel:'info',
		inline:true
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