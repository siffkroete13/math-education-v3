const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Lese alle Verzeichnisse aus, die dem Muster v\d+ entsprechen (z.B. v1, v2, ...)
const versions = fs.readdirSync(__dirname).filter(dir => /^v\d+$/.test(dir));

// Hole die zu bauende Version aus einer Umgebungsvariable oder einem Skript-Argument
const targetVersion = process.env.VERSION || process.argv[2];

if (!targetVersion) {
  throw new Error('Bitte eine Version als Umgebungsvariable oder als Argument angeben. Beispiel: cross-env VERSION=v1 npm start');
}

if (!versions.includes(targetVersion)) {
  throw new Error(`Die angegebene Version ${targetVersion} existiert nicht.`);
}

module.exports = {
  entry: `./${targetVersion}/src/index.js`,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, targetVersion, 'dist'),
    publicPath: `/${targetVersion}/dist/`
  },
  mode: 'development', // Setzt den Modus auf Entwicklung
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new (require('webpack')).HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, targetVersion, 'index.html'),
      filename: 'index.html'
    })
  ],
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, targetVersion, 'dist')
      },
      {
        directory: path.resolve(__dirname, 'models'),
        publicPath: '/models',
      },
      {
        directory: path.resolve(__dirname, 'shaders'),
        publicPath: '/shaders',
      }
    ],
    compress: true,
    port: 9000 + parseInt(targetVersion.substring(1)), // Dynamisch für jede Version
    open: true
  },
  devtool: 'source-map' // Aktiviert die Source Maps
};
