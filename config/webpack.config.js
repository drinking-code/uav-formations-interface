import path from 'path'

import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'

import makeModule from './webpack.modules.config.js'

const isProduction = process.env.NODE_ENV === 'production'

export default {
    target: 'web',
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    entry: path.resolve('./src/index.js'),
    output: {
        filename: 'index.js',
        path: path.resolve('build'),
    },
    module: makeModule(),
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    optimization: {
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        arguments: true,
                        booleans_as_integers: true,
                        drop_console: true,
                        ecma: '2015',
                        passes: 2,
                        toplevel: true,
                    },
                    mangle: {
                        toplevel: true,
                    },
                    format: {
                        comments: false,
                        ecma: '2015',
                    },
                    toplevel: true,
                },
            }),
            new CssMinimizerPlugin({
                minimizerOptions: [{
                    level: {
                        1: {
                            roundingPrecision: 'all=3',
                        },
                    },
                }, {
                    preset: [
                        'advanced', {
                            discardUnused: true,
                            mergeIdents: true,
                            reduceIdents: true,
                            zindex: false
                        }]
                }, {},],
                minify: [
                    CssMinimizerPlugin.cleanCssMinify,
                    CssMinimizerPlugin.cssnanoMinify,
                    CssMinimizerPlugin.cssoMinify,
                ],
            }),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new CopyPlugin({
            patterns: [
                {from: 'src/index.html', to: '.'},
            ],
        }),
    ],
}
