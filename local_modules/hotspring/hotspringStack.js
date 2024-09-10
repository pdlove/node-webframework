const fs = require('fs').promises;
const path = require('path');

//Used to minify content
const CleanCSS = require('clean-css');
const UglifyJS = require("uglify-js");
const htmlMinify = require("html-minifier");


const { hotspringGlobal } = require('./hotspringGlobal');

class hotspringStack {
    enabled = true;
    name = '';
    description = '';
    configuration = {};
    client_blocks = {};
    client_panels = {};
    jobs = {};
    models = {};
    routes = {};

    constructor() {
    }

    static async loadFromPath(stackPath) {
        if (stackPath == '') {
            this.loadStacks_all(hotspringGlobal.configuration.defaultStackRoot);
        }
        if (!path.isAbsolute(stackPath)) {
            stackPath = path.resolve(hotspringGlobal.configuration.defaultStackRoot, stackPath);
        }

        const definitionPath = path.join(stackPath, 'stackDefinition.json');
        let definition = null;
        try {
            // Check if the file exists
            await fs.access(definitionPath);

            // Read the JSON content
            const jsonData = JSON.parse(await fs.readFile(definitionPath, 'utf8'));

            let newStack = new hotspringStack();
            if (jsonData.name) newStack.name = jsonData.name;
            if (jsonData.description) newStack.description = jsonData.description;
            if (jsonData.configuration) newStack.configuration = jsonData.configuration

            if (jsonData.client_blocks) {

            } else {
                //
            }



            if (jsonData.client_panels) newStack.client_panels = jsonData.client_panels
            if (jsonData.jobs) newStack.jobs = jsonData.jobs
            if (jsonData.models) newStack.models = jsonData.models
            if (jsonData.routes) newStack.routes = jsonData.routes


        } catch (error) {
            console.error('Error: stackDefinition.json does not exist or failed to load.');
            throw new Error(`File not found or invalid JSON: ${definitionPath}`);
        }
        definition = definition;
    }

        
static loadClientCodeList(dir, minify, startPath) {
    let myList = {};
    const files = fs.readdirSync(dir);
    if (!startPath) startPath = dir;
  
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
  
      if (stats.isDirectory()) {
        // Recursively load routes in subdirectories
        childList = hotspringStack.loadClientCodeList(fullPath, minify, startPath);
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
  


  
}

module.exports = { hotspringStack };