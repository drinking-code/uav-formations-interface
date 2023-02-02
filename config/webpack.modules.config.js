import autoprefixer from 'autoprefixer'
import easingGradients from 'postcss-easing-gradients'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const isProduction = process.env.NODE_ENV === 'production'

const postcssAndSass = [{
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
        postcssOptions: {
            plugins: [
                autoprefixer,
                easingGradients
            ],
        },
    }
}, {
    loader: 'resolve-url-loader',
    options: {
        sourceMap: true,
    }
}, {
    loader: 'sass-loader',
    options: {
        sourceMap: true,
    }
},]

export default function makeModule() {
    return {
        rules: [{
            test: /\.[jt]sx?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-typescript',
                        ['@babel/env', {
                            targets: {
                                node: process.versions.node
                            }
                        }],
                        ['@babel/react', {
                            runtime: 'automatic',
                            development: !isProduction,
                        }],
                    ],
                }
            }
        }, {
            test: /\.s?[ac]ss$/i,
            exclude: /\.module\.s?[ac]ss$/i,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                }
            }, ...postcssAndSass]
        }, {
            test: /\.module\.s?[ac]ss$/i,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    modules: {
                        mode: 'local',
                        localIdentName: '[local]_[hash:base64:5]',
                    },
                }
            }, ...postcssAndSass]
        }, {
            test: /\.ya?ml$/,
            type: 'javascript/auto',
            use: 'yaml-loader',
        }, {
            test: /\.svg$/i,
            type: 'asset/inline',
        }, {
            test: /\.png$/i,
            type: 'asset/resource',
        }, {
            test: /\.(ttf|woff2?)$/i,
            type: 'asset/resource',
        }],
    }
}
