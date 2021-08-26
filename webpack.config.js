const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const JavaScriptObfuscator = require('webpack-obfuscator');

console.log(path.join(__dirname, 'src'));

module.exports = (env, argv) => {
  console.log(argv.mode);
  console.log('env: ', env);

  if (argv.mode == 'production') {
    return {
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            include: [
              path.join(__dirname, '../src')
            ],
            use: {
              loader: "babel-loader",
            }
          },
          {
            test: /\.js/,
            loader: 'string-replace-loader',
            options: {
              search: '$assets',
              replace: './assets' // prod
              // replace: '' // dev
            },
            include: path.join(__dirname, 'src')
          },
          {
            test: /\.js/,
            loader: 'string-replace-loader',
            options: {
              search: '$preload',
              replace: 'preload',
              // replace: '' // dev
            },
            include: path.join(__dirname, 'src')
          },
          {
            test: /\.js/,
            loader: 'string-replace-loader',
            options: {
              search: '$platform_save_directory',
              replace: env.windows ? ('%USERPROFILE%\\\\AppData\\\\LocalLow\\\\') : (env.osx ? '~/Library/Application Support/' : '~/'),
              // replace: '' // dev
            },
            include: path.join(__dirname, 'src')
          }
        ]
      },
      plugins: [
        new JavaScriptObfuscator ({
            rotateUnicodeArray: true
        })
      ]
    };
  } else {
    return {
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            include: [
              path.join(__dirname, '../src')
            ],
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.js/,
            loader: 'string-replace-loader',
            options: {
              search: '$assets',
              replace: './assets' // prod
              // replace: '' // dev
            },
            include: path.join(__dirname, 'src')
          },
          {
            test: /\.js/,
            loader: 'string-replace-loader',
            options: {
              search: '$platform_save_directory',
              replace: env.windows ? ('%USERPROFILE%/AppData/LocalLow/') : (env.osx ? '~/Library/Application Support/' : '~/')
              // replace: '' // dev
            },
            include: path.join(__dirname, 'src')
          },
          {
            test: /\.js/,
            loader: 'string-replace-loader',
            options: {
              search: '$preload',
              replace: 'preload',
              // replace: '' // dev
            },
            include: path.join(__dirname, 'src')
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: "html-loader"
              }
            ]
          }
        ]
      },
      plugins: [
        new HtmlWebPackPlugin({
          template: "./dist.html",
          filename: "./index.html"
        })
      ]
    };
  }
};