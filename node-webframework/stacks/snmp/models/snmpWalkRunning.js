module.exports = (sequelize, DataTypes) => {
    const snmpWalkLatestValue = sequelize.define('snmpWalkLatestValue', {
      oid: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: true },
      valueType: { type: DataTypes.STRING, allowNull: true },
      deviceId: { type: DataTypes.INTEGER, allowNull: false },
      snmpWalkId: { type: DataTypes.INTEGER, allowNull: false }      
    }, {
      updatedAt: 'lastChange',
      createdAt: 'firstSeen'
    });
  
    snmpWalkLatestValue.associate = (models) => {
      snmpWalkLatestValue.belongsTo(models.SNMPWalkConfig, { foreignKey: 'snmpWalkId', onDelete: 'CASCADE' });
      snmpWalkLatestValue.belongsTo(models.Device, { foreignKey: 'deviceId', onDelete: 'CASCADE' }); // Associate with Device
    };
  
    return snmpWalkLatestValue;
  };
  