const { HotspringObjectType, DataTypes } = require('hotspring-framework');

class LogEntry extends HotspringObjectType {
  name = 'logentry';
  autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  defaultWriteAccess = 'admin'; //admin, user, public
  defaultReadAccess = 'admin'; //admin, user, public

  sequelizeDefinition = {
    batchID: { type: DataTypes.INTEGER, allowNull: false, },
    lineID:  { type: DataTypes.INTEGER, allowNull: false, },
    facility: {type: DataTypes.SMALLINT, allowNull: false, },
    severity: {type: DataTypes.SMALLINT, allowNull: false, },
    time: {type: DataTypes.DATE, allowNull: false, },
    message: {type: DataTypes.BLOB, allowNull: false, },
    state: {type: DataTypes.SMALLINT, defaultValue: 1, allowNull: false, enumValues: {0: 'Created', 1: 'UnProcessed', 2:'Processed', 3:'Error', 4:'Ignored'}, },    
  };
  sequelizeConnections = [
    { connection: "1M", parentType: "syslog.LogBatch", parentKey: "batchID", childType: "syslog.LogEntry", childKey: "batchID" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = LogEntry;