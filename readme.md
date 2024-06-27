1.) npm init -y
2.) npm install webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env
3.) npm install --save-dev html-webpack-plugin
4.) npm install --save-dev cross-env
5.) npm install npm install webgl-debug
6.) npm install gl-matrix
6.) webpack.config.js anlegen wie im Projekt.
7.) in package.json folgendes bei scripts ergänzen: "scripts": {
        "start:v1": "cross-env VERSION=v1 webpack serve --config webpack.config.js --open",
        "start:v2": "cross-env VERSION=v2 webpack serve --config webpack.config.js --open",
        "build:v1": "cross-env VERSION=v1 webpack --config webpack.config.js",
        "build:v2": "cross-env VERSION=v2 webpack --config webpack.config.js",
    }
8.) in console: npm run build:v1
9.) in console: npm run start:v1

10.) git init
11.) git add .
12.) git commit -m "first commit"
13.) git remote add origin https://github.com/siffkroete13/math-education-v3.git
14.) git push -u origin main