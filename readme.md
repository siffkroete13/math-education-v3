# Math Education V3

In diesem Projekt werden verschiedene Mathe Themen geometrisch dargestellt um sie besser zu verstehen. Z.B. lineare Abbildungen mit Matrix Multiplikation.
Spannend ist auch webpack.config.js, dort wird das Projekt so erstellt, dass es mehrere Versionen hat (v1, v2...). Man kann sie einzeln erstellen.
Zusätzlich hat jede Version mehrere pages mit eigenen html Templates und eigenen js files. 
Das alles wird mit webpack erstellt, man muss nur npm run build:v1 und npm run start:v1 in der console eingeben und fertig!

## Setup

### 1. Projekt initialisieren und notwendige Pakete installieren
npm init -y
npm install webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env
npm install --save-dev html-webpack-plugin cross-env
npm install webgl-debug gl-matrix

### 2. Webpack Konfiguration erstellen
Erstelle eine Datei `webpack.config.js` im Projektverzeichnis und füge die Konfiguration hinzu (siehe Beispiel im Projekt).

### 3. Skripte in `package.json` hinzufügen
Ergänze folgende Einträge unter "scripts" in der `package.json`:
"scripts": {
"start
": "cross-env VERSION=v1 webpack serve --config webpack.config.js --open",
"start
": "cross-env VERSION=v2 webpack serve --config webpack.config.js --open",
"build
": "cross-env VERSION=v1 webpack --config webpack.config.js",
"build
": "cross-env VERSION=v2 webpack --config webpack.config.js"
}

### 4. Projekt für Version 1 bauen und starten
npm run build
npm run start

### 5. .gitignore hinzufügen
Vergiss nicht, eine `.gitignore` Datei zu erstellen und entsprechende Einträge hinzuzufügen, um unnötige Dateien vom Repository auszuschließen.

## Git Repository initialisieren und erste Commit
### 6. Git initialisieren
git init
### 7. Dateien zum Repository hinzufügen
git add .
### 8. Ersten Commit erstellen
git commit -m "first commit"
### 9. Remote Repository hinzufügen
git remote add origin https://github.com/siffkroete13/math-education-v3.git
### 10. Änderungen pushen
git push -u origin master

## Hinweise
- Achte darauf, dass die `webpack.config.js` richtig konfiguriert ist, um die verschiedenen Versionen korrekt zu verarbeiten.
- Die `index.html` Dateien sollten entsprechend der Struktur in den `v1` und `v2` Verzeichnissen abgelegt sein.
