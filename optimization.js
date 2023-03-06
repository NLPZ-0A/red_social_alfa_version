const fs = require('fs');
const path = require('path');
const terser = require('terser');

const filePath = path.join(__dirname, './src/controller/postController.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

const result = terser.minify(fileContent);

if (result.error) {
  console.error(result.error);
} else {
  fs.writeFileSync(filePath, result.code, 'utf8');
  console.log(`Archivo ${filePath} optimizado exitosamente.`);
}