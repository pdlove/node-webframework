const { hotspringGlobal }  = require('hotspring');
const path = require('path');


hotspringGlobal.loadStack(path.resolve(__dirname,'stacks',''))


console.log(require.paths);