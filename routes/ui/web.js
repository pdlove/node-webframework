const express = require('express');
const router = express.Router();

//Used for Control loading
const path = require('path');
const fs = require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

//Used to minify content
const CleanCSS = require('clean-css');
const UglifyJS = require("uglify-js");
const htmlMinify = require("html-minifier");

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
      let defContents = fs.readFileSync(fullPath, 'utf8');
      let defFile = JSON.parse(defContents);
      let defName = path.relative(startPath, dir).replace(/\\/g, '/');
      if (defFile.name) defName=defFile.name;
      let definition = { name: defName, cssCode: null, htmlCode: null, jsCode: null, requiredControls: defFile.requiredControls };
      if (defFile.css) {
        let cssCode = '';
        for (let idx in defFile.css) {
          let content = fs.readFileSync(path.join(dir, defFile.css[idx]), 'utf8');
          cssCode += '\n' + content;
        }
        cssCodeMinified = new CleanCSS().minify(cssCode);
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
        htmlCodeMinified = htmlMinify.minify(htmlCode, {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
          });
        
        definition.htmlCode = htmlCode;
      }
      if (defFile.js) {
        let jsCode = '';
        for (let idx in defFile.js) {
          let content = fs.readFileSync(path.join(dir, defFile.js[idx]), 'utf8');
          jsCode += '\n' + content;
        }
        jsCodeMinified = UglifyJS.minify(jsCode);
        definition.jsCode = jsCode;
      }
      myList[defName] = definition;
    }

  });
  return myList;
}

var listControls = loadClientCodeList(path.join(appDir, 'client_objects'), false);

// Get a MenuItem by ID
router.get('/control/:id', async (req, res) => {
  try {
    let thisOne = null;
    if (req.params.id.endsWith('.min.js')) {
      const controlName = req.params.id.substring(0,req.params.id.length-7)
      thisOne = listControls[controlName]
      res.type("application/javascript");
      res.send(thisOne.jsCodeMinified);
    } else if (req.params.id.endsWith('.js')) {
      const controlName = req.params.id.substring(0,req.params.id.length-3)
      thisOne = listControls[controlName]
      res.type("application/javascript");
      res.send(thisOne.jsCode);
    } else if (req.params.id.endsWith('.min.css')) {
      const controlName = req.params.id.substring(0,req.params.id.length-8)
      thisOne = listControls[controlName]
      res.type("text/css");
      res.send(thisOne.cssCodeMinified);
    } else if (req.params.id.endsWith('.css')) {
      const controlName = req.params.id.substring(0,req.params.id.length-4)
      thisOne = listControls[controlName]
      res.type("text/css");
      res.send(thisOne.cssCode);
    } else {
      const controlName = req.params.id
      thisOne = listControls[controlName]      
      res.status(200).json(thisOne);
    }
    if (!thisOne) {
      res.status(404).json({ error: 'Control not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
