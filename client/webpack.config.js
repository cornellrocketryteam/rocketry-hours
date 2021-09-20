const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
require('dotenv').config()

const config = {
	entry: [
		'react-hot-loader/patch',
		'./src/index.tsx'
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	devServer: {
		liveReload: true,
		port: 3001,
		historyApiFallback: true
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: 'src/index.html' }],
		}),
		new MiniCssExtractPlugin(),
		new webpack.DefinePlugin({
			'CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
			'BASE_URL': JSON.stringify(process.env.BASE_URL)
		})
	],
	module: {
		rules: [
			{
				test: /\.ts(x)?$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	resolve: {
		extensions: [
			'.tsx',
			'.ts',
			'.js'
		],
		alias: {
			'react-dom': '@hot-loader/react-dom'
		}
	}
};

module.exports = config;