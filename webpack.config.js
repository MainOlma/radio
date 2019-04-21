var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var libraryName = 'library';
var outputFile = libraryName + '.js';
module.exports = () =>{
    return {
        entry: {
            index:"./src/index.js",
            radioemoji:"./src/radioemoji.js"
    },
        output: {
            path: __dirname + '/lib',
            filename: "[name].js",
            library: "[name]",
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: {presets: ["es2015"]}
                    }
                },
                {
                    test: /\.(sass|scss|css)$/,
                    //include: path.resolve(__dirname, 'src/'),
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                minimize: false,
                                url: false
                            }
                        },
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: true
                                }
                            }
                        ]
                    })
                },
                /* {
                     test: /\.scss$/,
                     use: [
                         {
                             loader: "style-loader" // creates style nodes from JS strings
                         },
                         {
                             loader: "css-loader" // translates CSS into CommonJS
                         },
                         {
                             loader: "sass-loader" // compiles Sass to CSS
                         }
                     ]
                 }*/
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html"
            }),
            new ExtractTextPlugin({
                filename: 'style.bundle.css',
                allChunks: true,
            }),
        ],
        devtool: "cheap-module-source-map"
    }
};