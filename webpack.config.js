const path = require('path');
console.log('✅ Using my updated webpack config!');

module.exports = {
  entry: './src/content.jsx',
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'inline-source-map',

  module: {
    rules: [
      // ✅ Handles both global CSS and CSS Modules
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: /\.module\.css$/i, // 👈 enables modules only for *.module.css
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          },
        ],
      },
      // ✅ Babel for JSX
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};

/*
module.exports = {
  entry: './src/content.jsx',
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'], // optional: allows omitting file extensions
  },
  devtool: 'inline-source-map', // ✅ This is the key line
  module: {
    rules: [
      {
        test: /\.css$/i,                               // every .css file
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // treat ONLY *.module.css as CSS-modules
              modules: {
                auto: /\.module\.css$/i,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
};
*/ 

/*
 rules: [
      {
        test: /\.css$/i,                               // every .css file
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // treat ONLY *.module.css as CSS-modules
              modules: {
                auto: /\.module\.css$/i,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
          },
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },

 rules: [
      {
        test: /\.jsx?$/,              // matches .js and .jsx files
        exclude: /node_modules/,      // don’t transpile dependencies
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.module\.css$/, // only matches .module.css files
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, // <-- this is key
            },
          },
        ],
      },
    ],
  },
*/ 
