const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const lightTheme = new ExtractTextWebpackPlugin('light-theme.css');
const darkTheme = new ExtractTextWebpackPlugin('dark-theme.css');
const coloredTheme = new ExtractTextWebpackPlugin('colored-theme.css');

module.exports = (env, argv) => {
    return {
        mode: argv.mode,
        entry: './src/ts/GrowlNotification.ts',
        output: {
            filename: 'growl-notification.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'umd',
            umdNamedDefine: true,
            library: 'GrowlNotification'
        },
        resolve: {
            extensions: ['.ts', '.js'],
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
                    test: /light-theme\.scss$/,
                    include: [path.resolve(__dirname, './src/scss')],
                    use: lightTheme.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                },
                {
                    test: /dark-theme\.scss$/,
                    include: [path.resolve(__dirname, './src/scss')],
                    use: darkTheme.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                },
                {
                    test: /colored-theme\.scss$/,
                    include: [path.resolve(__dirname, './src/scss')],
                    use: coloredTheme.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
                }
            ]
        },
        devtool: 'none',
        optimization: {
            minimize: false
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'head'
            }),
            new CopyWebpackPlugin([{
                from: `src/img`,
                to: `img` // dist/img
            }
            ]),
            lightTheme,
            darkTheme,
            coloredTheme
        ]
    };
}
