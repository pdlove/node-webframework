const fs = require('fs').promises;
const path = require('path');

class hotspringGlobal {
    static stacks = {};
    static rootFolder = path.resolve(__dirname,'../..');
    static configuration = {
        defaultStackRoot: path.resolve(__dirname,'../../stacks')
    };

    static async loadStacks_all(absolutePath) {

    }


}
module.exports = { hotspringGlobal };