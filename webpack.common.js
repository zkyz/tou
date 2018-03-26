const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry:   {
		tou: './src/index.js'
	},
	output:  {
		filename: '[name].js',
		path:     path.resolve(__dirname, 'dist')
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'tou.css',
			disable: false,
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: '!html-webpack-plugin/lib/loader!index.html',
			filename: 'index.html'
		})
	],
	module:  {
		rules: [
			{
				enforce: 'pre',
				test:    /\.js$/,
				exclude: /node_modules/,
				loader:  'eslint-loader'
			},
			{
				test:    /\.js$/,
				exclude: /node_modules/,
				loader:  'babel-loader',
				options: {
					plugins: ['transform-object-rest-spread'],
					presets: [[
						'env', {
							targets: {
								browsers: ['last 3 versions']
							}
						}
					]]
				}
			},
			{
				test:    /\.css$/,
				exclude: /node_modules/,
				use:     ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use:      'css-loader'
				})
			},
			{
				test:    /\.scss$/,
				exclude: /node_modules/,
				use:     ExtractTextPlugin.extract({
					use: ['css-loader', 'sass-loader']
				})
			},
			{
				test: /\.html$/i,
				use:  'html-loader'
			}
		]
	}
}