const express = require('express');
const router = express.Router();

//Used for Control loading
const path = require('path');
const fs = require('fs');

//Used to minify content
const CleanCSS = require('clean-css');
const UglifyJS = require("uglify-js");
const htmlMinify = require("html-minifier");

// Get a MenuItem by ID
router.get('/control/:id', async (req, res) => {
  try {
    const thisOne = listControls[req.params.id]
    if (thisOne) {
      res.status(200).json(thisOne);
    } else {
      res.status(404).json({ error: 'Control not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


function loadClientCodeList(dir, minify, startPath) {
  let myList = {};
  const files = fs.readdirSync(dir);
  if (!startPath) startPath = dir;

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recursively load routes in subdirectories
      childList = loadClientCodeList(fullPath, minify, startPath);
      childList = childList
      for (let test in childList) {
        myList[test] = childList[test];
      }
    } else if (file === 'definition.json') {
      let defName = path.relative(startPath, dir).replace(/\\/g, '/');
      let defContents = fs.readFileSync(fullPath, 'utf8');
      let defFile = JSON.parse(defContents);
      let definition = { name: defName, cssCode: null, htmlCode: null, jsCode: null, startFunction: null };
      if (defFile.css) {
        let cssCode = '';
        for (let idx in defFile.css) {
          let content = fs.readFileSync(path.join(dir, defFile.css[idx]), 'utf8');
          cssCode += '\n' + content;
        }
        if (minify) {
          cssCode = new CleanCSS().minify(cssCode);
        }
        definition.cssCode = cssCode;
      }
      if (defFile.html) {
        let htmlCode = '';
        // Still need to improve how multiple HTML files are concatenated.
        // I think if there are mulitple I need to encapsulate them in a div.
        for (let idx in defFile.html) {
          let content = fs.readFileSync(path.join(dir, defFile.html[idx]), 'utf8');
          htmlCode += '\n' + content;
        }
        if (minify) {
          htmlCode = htmlMinify.minify(htmlCode, {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
          });
        }
        definition.htmlCode = htmlCode;
      }
      if (defFile.js) {
        let jsCode = '';
        for (let idx in defFile.js) {
          let content = fs.readFileSync(path.join(dir, defFile.js[idx]), 'utf8');
          jsCode += '\n' + content;
        }
        if (minify) {
          jsCode = UglifyJS.minify(jsCode);
        }
        definition.jsCode = jsCode;
      }
      myList[defName] = definition;
    }

  });
  return myList;
}

var listControls = loadClientCodeList(path.join(__dirname, '../client_controls'), false);
var listComponents = loadClientCodeList(path.join(__dirname, '../client_components'), false);
var listPages = loadClientCodeList(path.join(__dirname, '../client_pages'), false);

module.exports = router;
