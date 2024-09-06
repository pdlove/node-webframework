const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./stacks/system/models');

const app = express();
const port = 3002;



app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Function to load routes dynamically
async function loadRoutes(dir, apiRootPath, startPath) {
  const files = fs.readdirSync(dir);
  if (!startPath) startPath = dir;
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Recursively load routes in subdirectories
      loadRoutes(fullPath, apiRootPath, startPath);
    } else if (path.extname(file) === '.js') {
      // Create a route for each JavaScript file
      const router = require(fullPath);

      // Check if the module exports an Express Router
      if (typeof router === 'function' && router.name === 'router') {
        const routePath = apiRootPath + '/' + path.relative(startPath, fullPath).replace(/\\/g, '/').replace(/\.js$/, '');
        app.use(routePath, router);
        console.log(`Loaded route ${routePath}`);
      } else {
        console.warn(`Skipped file ${fullPath}: Not an Express Router`);
      }
    }
  });
}
let routeLoader = loadRoutes(path.join(__dirname, 'routes'), "/api");

async function loadJobTypes(dir, apiRootPath, startPath) {
    const files = fs.readdirSync(dir);
    if (!startPath) startPath = dir;
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
  
      if (stats.isDirectory()) {
        // Recursively load routes in subdirectories
        loadRoutes(fullPath, apiRootPath, startPath);
      } else if (path.extname(file) === '.js') {
        // Create a route for each JavaScript file
        const router = require(fullPath);
  
        // Check if the module exports an Express Router
        if (typeof router === 'function' && router.name === 'router') {
          const routePath = apiRootPath + '/' + path.relative(startPath, fullPath).replace(/\\/g, '/').replace(/\.js$/, '');
          app.use(routePath, router);
          console.log(`Loaded route ${routePath}`);
        } else {
          console.warn(`Skipped file ${fullPath}: Not an Express Router`);
        }
      }
    });
  }



// Sync database and start server
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Error syncing database:', err);
});

async function runJob() {
  var jobsToRun = db.Job.findAll({where: { status: "pending"}});

}

async function test() {
    var snmpNetworking = require('./snmp/snmp_networking').SNMP_NetDevice;
  let test = new snmpNetworking("192.168.5.3","BW15NMp");
  await test.UpdateDetails();
  await test.UpdatePortLearnedMACs();
  test=test;
}
test();

var snmp = require('./original');