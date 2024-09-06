module.exports = (sequelize, DataTypes) => {
    const DeviceInterface = sequelize.define('DeviceInterface', {
        deviceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Devices', key: 'id' }
        },
        interfaceType: { type: DataTypes.STRING, allowNull: false },
        snmpIndex: { type: DataTypes.INTEGER, allowNull: false },
        adminStatus: { type: DataTypes.ENUM('up', 'down'), allowNull: false },
        functionalStatus: { type: DataTypes.ENUM('up', 'down'), allowNull: false },
        speed: { type: DataTypes.INTEGER, allowNull: false },
        duplexMode: { type: DataTypes.ENUM('full', 'half'), allowNull: false },
        poeStatus: { type: DataTypes.BOOLEAN, allowNull: false },
        stpStatus: { type: DataTypes.BOOLEAN, allowNull: false },
        vlansTagged: { type: DataTypes.STRING },
        vlansUntagged: { type: DataTypes.STRING },
        profileId: { type: DataTypes.INTEGER }
    });

    return DeviceInterface;
};
