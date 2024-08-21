async function SeedDatabase(queryInterface) {
    await queryInterface.bulkInsert('Menus', [
      { "menuID": 1, "parent_menu_id": null, "iconClass": "nc-icon nc-bank", "name": "Dashboard", "panel":"dashboard", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 2, "parent_menu_id": null, "iconClass": "nc-icon nc-book-bookmark", "name": "Devices", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 3, "parent_menu_id": 2, "iconText": "A", "name": "All", "panel": "devices", "panel_parameters": "all", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 4, "parent_menu_id": 2, "iconText": "S", "name": "Switches", "panel":"devices", "panel_parameters": "switches", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 5, "parent_menu_id": null, "iconClass": "nc-icon nc-settings-gear-65", "name": "Configuration", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 15, "parent_menu_id": 5, "name": "Inventory", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 16, "parent_menu_id": 5, "name": "Services", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 6, "parent_menu_id": 15, "iconClass": "nc-icon nc-globe", "name": "Organization", "panel": "config_org", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 7, "parent_menu_id": 15, "iconClass": "nc-icon nc-pin-3", "name": "Locations", "panel": "config_locations", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 8, "parent_menu_id": 15, "iconClass": "nc-icon nc-box-2", "name": "VLANs", "panel": "config_vlans", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 9, "parent_menu_id": 15, "iconClass": "nc-icon nc-vector", "name": "Networks", "panel": "config_nets", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 11, "parent_menu_id": 16, "iconText": "R", "name": "Radius Server", "panel": "config_radius", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 12, "parent_menu_id": 16, "iconText": "IP", "name": "DHCP Integration", "panel": "config_dhcp", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 13, "parent_menu_id": 16, "iconText": "D", "name": "DNS Integration", "panel": "config_dns", createdAt: new Date(), updatedAt: new Date()  }
    ], {});

    await queryInterface.bulkInsert('Users', [ 
      {userID: 1,username: "admin",  password: "$2b$10$4WnFV5PrgXLqqjRkrweZJO.39LiqwdQTB1eemK56.QiAFazZ5AStu",  locked: false, createdAt: new Date(), updatedAt: new Date()  },
    ]);
  }
//'$2b$10$DUG9tWmdx/zVzw3gqGE0TOyrXlmT9aAMhz2EX84syUloNnfJ9fI5a'

console.log("Initializing the Database");
const db = require('./models');

// Sync database and start server
db.sequelize.sync().then(() => {
    console.log("Seeding the Database");
    SeedDatabase(db.sequelize.queryInterface).then(() => {console.log("Done")}).catch(err => {console.error('Unable to Seed Database: ', err)});
}).catch(err => {
    console.error('Error syncing database:', err);
  });
  

