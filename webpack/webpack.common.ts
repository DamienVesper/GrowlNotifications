import path from 'path';
import * as Webpack from 'webpack';

import HTMLWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import { WebpackConfiguration } from 'webpack-dev-server';

const config: Webpack.Configuration = {
    entry: `./src/ts/GrowlNotification.ts`,
    output: {
        filename: `growl-notification.js`,
        path: path.resolve(__dirname, `dist`),
        libraryTarget: `umd`,
        umdNamedDefine: true,
        library: `GrowlNotification`
    },
    resolve: {
        extensions: [`.ts`, `.js`],
        alias: {
            deepmerge$: path.resolve(__dirname, `node_modules/deepmerge/dist/umd.js`)
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: `ts-loader`,
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    `style-loader`,
                    `css-loader`,
                    `sass-loader`
                ]
            }
        ]
    },
    devtool: `inline-source-map`,
    devServer: {
        static: {
            directory: path.resolve(__dirname, `src`),
            watch: true
        },
        port: 9000,
        hot: true,
        open: true
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: `./src/index.html`,
            inject: `head`
        }),
        new Webpack.HotModuleReplacementPlugin()
    ]
};

export default config;
