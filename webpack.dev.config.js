const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    return {
        mode: argv.mode,
        entry: './src/ts/GrowlNotification.ts',
        output: {
            filename: 'growl-notification.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'umd',
            umdNamedDefine: true,
            library: "GrowlNotification"
        },
        resolve: {
            extensions:['.ts', '.js'],
            alias: {
                deepmerge$: path.resolve(__dirname, 'node_modules/deepmerge/dist/umd.js'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader',
                        "css-loader",
                        'sass-loader'
                    ]
                }
            ]
        },
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'src'),
            port: 9000,
            hot: true,
            open: true,
            watchContentBase: true
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'head'
            }),
            new CopyWebpackPlugin([{
                from:'src/img',
                to:'img' // dist/img
            }
            ]),
            new webpack.HotModuleReplacementPlugin()
        ]
    }
};