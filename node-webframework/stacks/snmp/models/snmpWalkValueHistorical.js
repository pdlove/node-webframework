const { HotspringObjectType, DataTypes } = require('hotspring-framework');

class SNMPWalkValueHistorical extends HotspringObjectType {
  name = 'snmpWalkValueHistorical';
  autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  defaultWriteAccess = 'admin'; //admin, user, public
  defaultReadAccess = 'admin'; //admin, user, public

  sequelizeDefinition = {
    oid: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: true },
    valueType: { type: DataTypes.STRING, allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
    snmpWalkId: { type: DataTypes.INTEGER, allowNull: false },
    isNew: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isChanged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isRemoved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    changedAmount: { type: DataTypes.FLOAT, allowNull: true },
    changedSeconds: { type: DataTypes.INTEGER, allowNull: true }     
  };
  sequelizeOptions = {
    updatedAt: 'timestamp',
    createdAt: 'timestamp'
  };
  sequelizeConnections = [
    { connection: "1M", parentType: "snmp.snmpWalk", parentKey: "snmpWalkId", childType: "snmp.snmpWalkValueHistorical", childKey: "snmpWalkId" },
    { connection: "1M", parentType: "inventory.networkdevice", parentKey: "deviceId", childType: "snmp.snmpWalkValueHistorical", childKey: "deviceId" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = SNMPWalkValueHistorical;