import * as Webpack from 'webpack';
import * as path from 'path';

import WDS from 'webpack-dev-server';

interface Configuration extends Webpack.Configuration {
    devServer?: WDS.Configuration
}

const config: Configuration = {
    entry: path.resolve(__dirname, `../src/index.ts`),
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: `ts-loader`,
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: `asset/resource`
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: `asset/resource`
            }
        ]
    },

    resolve: {
        extensions: [`*`, `.js`, `.ts`]
    },

    plugins: [
        new Webpack.ProgressPlugin()
    ]
};

export default config;
