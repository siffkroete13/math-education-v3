markdown
Copy code
# Math Education V3

## Setup

### 1. Projekt initialisieren
```sh
npm init -y
2. Webpack und Babel installieren
sh
Copy code
npm install webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env
3. HTML Webpack Plugin installieren
sh
Copy code
npm install --save-dev html-webpack-plugin
4. Cross-Env installieren
sh
Copy code
npm install --save-dev cross-env
5. WebGL Debug installieren
sh
Copy code
npm install webgl-debug
6. GL-Matrix installieren
sh
Copy code
npm install gl-matrix
7. Webpack Konfiguration erstellen
Erstelle eine Datei webpack.config.js im Projektverzeichnis und füge die Konfiguration hinzu (siehe Beispiel im Projekt).

8. Skripte in package.json hinzufügen
Ergänze folgende Einträge unter "scripts" in der package.json:

json
Copy code
"scripts": {
    "start:v1": "cross-env VERSION=v1 webpack serve --config webpack.config.js --open",
    "start:v2": "cross-env VERSION=v2 webpack serve --config webpack.config.js --open",
    "build:v1": "cross-env VERSION=v1 webpack --config webpack.config.js",
    "build:v2": "cross-env VERSION=v2 webpack --config webpack.config.js"
}
9. Projekt für Version 1 bauen
sh
Copy code
npm run build:v1
10. Projekt für Version 1 starten
sh
Copy code
npm run start:v1
11. .gitignore hinzufügen
Vergiss nicht, eine .gitignore Datei zu erstellen und entsprechende Einträge hinzuzufügen, um unnötige Dateien vom Repository auszuschließen.

Git Repository initialisieren und erste Commit
12. Git initialisieren
sh
Copy code
git init
13. Dateien zum Repository hinzufügen
sh
Copy code
git add .
14. Ersten Commit erstellen
sh
Copy code
git commit -m "first commit"
15. Remote Repository hinzufügen
sh
Copy code
git remote add origin https://github.com/siffkroete13/math-education-v3.git
16. Änderungen pushen
sh
Copy code
git push -u origin master
Hinweise
Achte darauf, dass die webpack.config.js richtig konfiguriert ist, um die verschiedenen Versionen korrekt zu verarbeiten.
Die index.html Dateien sollten entsprechend der Struktur in den v1 und v2 Verzeichnissen abgelegt sein.