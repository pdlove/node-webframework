const { HotspringObjectType, DataTypes } = require('hotspring-framework');

class NetworkDevice extends HotspringObjectType {
  name = 'networkdevice';
  autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  defaultWriteAccess = 'admin'; //admin, user, public
  defaultReadAccess = 'admin'; //admin, user, public

  sequelizeDefinition = {
    deviceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ManagementIP: { type: DataTypes.INET, defaultValue: null },
    DeviceName: { type: DataTypes.STRING(255), defaultValue: 'New Device' },
    SNMPCommunity: { type: DataTypes.STRING(255), defaultValue: null },
    SNMPVersion: { type: DataTypes.INTEGER, defaultValue: null },
    PollPerformanceLast: { type: DataTypes.DATE, defaultValue: null },
    PollPerformanceEvery: { type: DataTypes.INTEGER, defaultValue: null },
    PollEnvironmentLast: { type: DataTypes.DATE, defaultValue: null },
    PollEnvironmentEvery: { type: DataTypes.INTEGER, defaultValue: null },
    PollBasicLast: { type: DataTypes.DATE, defaultValue: null },
    PollBasicEvery: { type: DataTypes.INTEGER, defaultValue: null },
    LastDetected: { type: DataTypes.DATE, defaultValue: null }
};
  sequelizeConnections = [
    // { connection: "1M", parentType: "system.group", parentKey: "groupID", childType: "system.group_menu", childKey: "groupID" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = NetworkDevice;
