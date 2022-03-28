import merge from 'webpack-merge';
import common from './webpack.common';

import HTMLWebpackPlugin from 'html-webpack-plugin';

import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';

import * as path from 'path';

const config = merge(common, {
    mode: `production`,

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCSSExtractPlugin.loader, `css-loader`, `sass-loader`]
            }
        ]
    },

    output: {
        path: path.resolve(__dirname, `../dist/libs`),
        filename: `growl-notification.min.js`,
        libraryTarget: `umd`,
        clean: true
    },

    optimization: {
        minimizer: [
            `...`,
            new CSSMinimizerPlugin({
                minimizerOptions: {
                    preset: [`default`, { discardComments: { removeAll: true } }]
                }
            })
        ]
    },

    plugins: [
        new HTMLWebpackPlugin({
            inject: true,
            minify: {
                // removeComments: true,
                // collapseWhitespace: true,
                // removeRedundantAttributes: true,
                // useShortDoctype: true,
                // removeEmptyAttributes: true,
                // removeStyleLinkTypeAttributes: true,
                // keepClosingSlash: true,
                // minifyJS: true,
                // minifyCSS: true,
                // minifyURLs: true
            }
        }),
        new MiniCSSExtractPlugin()
    ]
});

export default config;
