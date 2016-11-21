var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    csswring = require('csswring'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (options) {

    var outputpath = options.outputpath,
        entry = {
            bundle: null
        },
        loaders = [],
        resolve = {
            alias: {},
            extensions: ['', '.css', '.scss', '.js']
        },
        plugins = [
            new webpack.HotModuleReplacementPlugin()
        ];

    switch (options.status) {
        case 'dev':

            entry.bundle = [
                'webpack-dev-server/client?http://localhost:8888',
                'webpack/hot/only-dev-server',
                './frontend/src/main.js'
            ];

            loaders.push(
                { test: /\.scss$/, loader: 'style!css!postcss!sass?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib') },
                { test: /\.css$/, loader: 'style!css' },
                { test: /\.(jpg|png|gif)$/, loader: 'url-loader' },
                { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel',
                    exclude: '/node_modules/',
                    include: path.join(__dirname, './frontend/src/main.js'),
                    query: { presets: ['es2015', 'react', 'stage-0'] },

                }
            );
            console.log('dev');
            break;
        //case 'deploy':
        case 'deploy':

            entry.bundle = './frontend/src/main.js';

            loaders.push(
                { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?includePaths[]=' + path.resolve(__dirname, './node_modules/compass-mixins/lib')) },
                { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css') },
                { test: /\.(jpg|png|gif)$/, loader: 'url-loader' },
                { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader" },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel',
                    include: path.join(__dirname, './frontend/src'),
                    query: { presets: ['latest', 'react', 'stage-0'] },
                }
            );

            plugins.push(
                new HtmlWebpackPlugin({
                    filename: 'index.html',
                    template: './frontend/index.html',
                    //favicon : 'app/favicon.ico'
                }),
                new ExtractTextPlugin('assets/styles/[name].css'),
                new webpack.optimize.UglifyJsPlugin(),
                new webpack.optimize.DedupePlugin(),
                new webpack.NoErrorsPlugin()
            )

            break;
    }


    return {
        entry: entry,
        output: {
            path: outputpath,
            filename: 'js/[name].js',
            sourceMapFilename: "app.js.map"
        },
        module: {
            loaders: loaders,
            preLoaders: [{ test: /\.js$/, loaders: ['source-map'] }]
        },
        postcss: [autoprefixer, csswring],
        resolve: resolve,
        plugins: plugins,
        devtool: 'cheap-eval-source-map'

    }
}
