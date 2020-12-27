const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const path = require('path');
const fs = require('fs');

const getAllFiles = function(dirPath, filesArray) {
  const files = fs.readdirSync(dirPath);

  let arrayOfFiles = filesArray || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      const splitFile = file.split('.');
      const extension = splitFile[splitFile.length - 1];
      if(extension === 'js' && splitFile.length < 3) {
        arrayOfFiles.push({
          path: path.join(__dirname, dirPath, "/"),
          name: file,
          minName: `${splitFile[0]}.min.js`
        });
      }
    }
  });

  return arrayOfFiles
}

const jsFiles = getAllFiles('./cdn', []);
console.log(jsFiles);

function handleMinifyError(err) {
  console.log(err);
  process.exit(1);
}

jsFiles.forEach(fileObj => {
  minify({
    compressor: uglifyES,
    input: `${fileObj.path}${fileObj.name}`,
    output: `${fileObj.path}${fileObj.minName}`,
    callback: function(err, min) {
      handleMinifyError(err);

      console.log(`Minified ${fileObj.name}`);
    }
  });
});

process.exit(0);