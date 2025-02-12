const { HotspringObjectType, DataTypes } = require('hotspring-framework');

class LogBatch extends HotspringObjectType {
  name = 'logbatch';
  autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  defaultWriteAccess = 'admin'; //admin, user, public
  defaultReadAccess = 'admin'; //admin, user, public

  sequelizeDefinition = {
    batchID: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    collectorID: { type: DataTypes.INTEGER, allowNull: false},
    sourceDeviceID: { type: DataTypes.INTEGER, allowNull: false },
    sourceIP: { type: DataTypes.INET, allowNull: false },
    uploadTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    processingByID: { type: DataTypes.INTEGER, allowNull: false},
    processingStartTime: { type: DataTypes.DATE },
    processingEndTime: { type: DataTypes.DATE },
    totalLines: { type: DataTypes.BIGINT, defaultValue: 0 },
    processedLines: { type: DataTypes.BIGINT, defaultValue: 0 },    
    state: {type: DataTypes.SMALLINT, defaultValue: 0, allowNull: false, enumValues: {0: 'Created', 1: 'UnProcessed', 2:'Processed', 3:'Error', 4:'Ignored'}, },
  };
  sequelizeConnections = [
    { connection: "1M", parentType: "inventory.networkdevice", parentKey: "deviceID", childType: "syslog.LogBatch", childKey: "sourceDeviceID" },
    { connection: "1M", parentType: "inventory.networkdevice", parentKey: "deviceID", childType: "syslog.LogBatch", childKey: "collectorID" },
    { connection: "1M", parentType: "inventory.networkdevice", parentKey: "deviceID", childType: "syslog.LogBatch", childKey: "processingByID" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = LogBatch;

