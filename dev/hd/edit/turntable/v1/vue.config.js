const path = require("path");
const webpack = require('webpack');

module.exports = {
    publicPath: "./",
    outputDir: __dirname.replace('dev', 'trunk'),// "dist"
    productionSourceMap: false,
    filenameHashing: false,
    // 删除 HTML 相关的 webpack 插件
    chainWebpack: config => {
        // config.plugins.delete('html')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
    },
    configureWebpack: config => {
        return {
            resolve: {
                alias: {
                    "@base": path.resolve(__dirname, 'src/base')
                }
            },
            plugins: [
                new webpack.ProvidePlugin({
                    $: "jquery",
                    jQuery: "jquery"
                })
            ]
        };
    },
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            // postcss: {
            //     plugins: [
            //         require("postcss-pxtorem")({
            //             rootValue: 16, // html font-size
            //             unitPrecision: 5,
            //             propList: ["*"],
            //             selectorBlackList: [],
            //             replace: true,
            //             mediaQuery: false,
            //             minPixelValue: 3
            //         })
            //     ]
            // }
        },
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // webpack-dev-server 相关配置
    devServer: {
        open: process.platform === "darwin",
        host: process.env.HOST || "hdcrmdev.kerlala.com",
        port: process.env.PORT || 8080,
        https: false,
        hotOnly: false,
        open: false,
        before: app => { },
        disableHostCheck: true
    }
};
