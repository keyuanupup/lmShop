const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//设置输入和输出根目录
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'src');
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
//获取环境
const env = process.env.NODE_ENV;
//循环生成每个入口文件对应的html
const HtmlWebpack = [];
['home', 'goodsClass'].forEach((item, index) => {
  let chunks = [item];
  //动态生成html插件
  HtmlWebpack[index] = new HtmlWebpackPlugin({
    // favicon:'./src/img/favicon.ico', //favicon路径
    filename: `./${item}.html`, //生成的html存放路径，相对于 path
    template: `./src/pages/${item}.html`,
    chunks: chunks,
    inject: true, //允许插件修改哪些内容，包括head与body
    hash: true, //为静态资源生成hash值
    minify: { //压缩HTML文件
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: false //删除空白符与换行符
    }
  })
});

const CommonsChunk = [
  new webpack.optimize.CommonsChunkPlugin({
    name: "commons",
    filename: "commons.js",
    minChunks: 2,
  })
];

//公共的插件
const commonPlugin = [
  new ExtractTextPlugin('style.css'),
  //热插拔
  new webpack.HotModuleReplacementPlugin(),
  //拷贝资源插件
  new CopyWebpackPlugin([{
    from: path.resolve(APP_PATH, 'assets'),
    to: path.resolve(BUILD_PATH, 'assets')
  }])
]

const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // 1. 属于 antd-mobile 内置 svg 文件
  path.resolve(__dirname, 'assets/svg'), // 2. 自己私人的 svg 存放目录
];

module.exports = {
  entry: {
    home: './src/modules/home',
    goodsClass: './src/modules/goodsClass'
  },
  output: {
    path: env === 'development' ? DEV_PATH : BUILD_PATH,
    /*publicPath: "/assets",*/
    filename: "[name].js"
  },
  //目前最流行的Source Maps选项是cheap-module-eval-source-map，这个工具会帮助开发环境下在Chrome/Firefox中显示源代码文件，其速度快于source-map与eval-source-map：
  devtool: env === 'development' ? '#eval-source-map' : 'hidden-source-map',
  module: {
    rules: [{
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'less-loader']
        }),
        include: APP_PATH
      }, {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: svgDirs
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/, //处理css文件中的背景图片
        loader: 'url-loader?limit=1&name=./static/assets/[name].[hash:4].[ext]'
        //当图片大小小于这个限制的时候，会自动启用base64编码图片。减少http请求,提高性能
      },
      {
        test: /\.js$/, //用babel编译jsx和es6
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ],
    //注意一下, extensions webpack2第一个不是空字符串! 对应不需要后缀的情况.
    extensions: ['.web.js', '.js', '.jsx', '.json'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      'container': path.resolve('./src/container'),
      'commonComponent': path.resolve('./src/common/components'),
      'common': path.resolve('./src/common'),
      'baseComponent': path.resolve(__dirname, './src/base-components'),
      'assets': path.resolve(__dirname, './src/assets')
    }
  },
  externals: {
    // 'react': 'react'
  },
  plugins: HtmlWebpack.concat(commonPlugin),
  watch: env === 'development' ? true : false
}
switch (env) {
  case 'production':
    module.exports.plugins = (module.exports.plugins || []).concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      //loader的最小化文件模式将会在webpack 3或者后续版本中被彻底取消掉.为了兼容部分旧式loader，你可以通过 LoaderOptionsPlugin 的配置项来提供这些功能。
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
      //每次运行webpack清理上一次的文件夹
      new CleanPlugin([BUILD_PATH]),
      //压缩混淆JS插件,UglifyJsPlugin 将不再支持让 Loaders 最小化文件的模式。debug 选项已经被移除。Loaders 不能从 webpack 的配置中读取到他们的配置项。
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true
        },
        comments: false,
        beautify: false,
        sourceMap: false
      })
    ]);
    break;
}
