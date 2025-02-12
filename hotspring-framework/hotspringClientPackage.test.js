const { expect } = require('chai');
const fs = require('fs').promises;
const path = require('path');
const HotspringClientPackage = require('./hotspringClientPackage');

describe('HotspringClientPackage', function() {
  describe('loadDefinition', function() {
    it('should load package definition from file', async function() {
      // Mock the file system
      const mockFilePath = path.join(__dirname, 'mockDefinition.json');
      const mockDefinition = {
        name: 'testPackage',
        namespace: 'testNamespace',
        requiredPackages: ['package1', 'package2'],
        css: ['style1.css', 'style2.css'],
        html: ['index.html'],
        js: ['script.js'],
        otherFiles: ['other.txt']
      };

      await fs.writeFile(mockFilePath, JSON.stringify(mockDefinition), 'utf8');

      // Mock the CSS file contents
      await fs.writeFile(path.join(__dirname, 'style1.css'), 'body { color: red; }', 'utf8');
      await fs.writeFile(path.join(__dirname, 'style2.css'), 'body { background: blue; }', 'utf8');

      // Mock the HTML file contents
      await fs.writeFile(path.join(__dirname, 'index.html'), '<html><body>Hello World</body></html>', 'utf8');

      // Mock the JS file contents
      await fs.writeFile(path.join(__dirname, 'script.js'), 'console.log("Hello World");', 'utf8');

      // Mock the other file contents
      await fs.writeFile(path.join(__dirname, 'other.txt'), 'This is a test file.', 'utf8');

      // Load the package definition
      const myPackage = await HotspringClientPackage.loadDefinition(mockFilePath, 'testStack');

      // Assertions
      expect(myPackage.name).to.equal('testPackage');
      expect(myPackage.namespace).to.equal('testNamespace');
      expect(myPackage.stack).to.equal('testStack');
      expect(myPackage.requiredPackages).to.deep.equal(['package1', 'package2']);
      expect(myPackage.cssFiles).to.deep.equal(['style1.css', 'style2.css']);
      expect(myPackage.htmlFiles).to.deep.equal(['index.html']);
      expect(myPackage.jsFiles).to.deep.equal(['script.js']);
      expect(myPackage.otherFiles).to.deep.equal(['other.txt']);
      expect(myPackage.cssRaw).to.include('body { color: red; }\nbody { background: blue; }');
      expect(myPackage.cssMinified).to.include('body{color:red}body{background:#00f}');
      expect(myPackage.htmlRaw).to.include('<html><body>Hello World</body></html>');
      expect(myPackage.jsRaw).to.include('console.log("Hello World");');

      // Clean up
      await fs.unlink(mockFilePath);
      await fs.unlink(path.join(__dirname, 'style1.css'));
      await fs.unlink(path.join(__dirname, 'style2.css'));
      await fs.unlink(path.join(__dirname, 'index.html'));
      await fs.unlink(path.join(__dirname, 'script.js'));
      await fs.unlink(path.join(__dirname, 'other.txt'));
    });
    
  });
});