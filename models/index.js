const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite:radius.db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Groups = require('./system/group')(sequelize, Sequelize.DataTypes);
db.Menus = require('./system/menu')(sequelize, Sequelize.DataTypes);
db.Users = require('./system/user')(sequelize, Sequelize.DataTypes);

db.Groups.belongsTo(db.Users, { as: 'AddedByUser', foreignKey: 'added_by_user_id' });
db.Groups.belongsToMany(db.Users, { through: 'UserGroups' });
db.Users.belongsToMany(db.Groups, { through: 'UserGroups' });
db.Menus.hasMany(db.Menus, { as: "Submenus", foreignKey: "parent_menu_id" });
db.Menus.belongsTo(db.Menus, { as: "ParentMenu", foreignKey: "parent_menu_id" });
   
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;