import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new HtmlWebpackPlugin({
      title: "Simbrain Web",
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    })
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
